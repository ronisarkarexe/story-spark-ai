import { Request, Response, NextFunction } from "express";
import ApiError from "../../errors/api_error";
import httpStatus from "http-status";

interface RateRecord {
  count: number;
  firstRequestAt: number;
  blockedUntil?: number;
}

interface RateLimiterOptions {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed within the window */
  maxRequests: number;
  /** Duration to block the IP in milliseconds once limit is exceeded */
  blockTimeMs: number;
  /** Unique key prefix to isolate this limiter's store entries (e.g. "login", "register") */
  keyPrefix: string;
  /** Human-readable label used in error messages (e.g. "login", "password reset") */
  actionLabel?: string;
}

const store = new Map<string, RateRecord>();

// Cleanup old keys periodically to prevent memory leak
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of store.entries()) {
    // Use a generous max age for cleanup — 25 hours covers the largest block time
    const MAX_AGE = 25 * 60 * 60 * 1000;
    if ((rec.blockedUntil && rec.blockedUntil < now) || now - rec.firstRequestAt > MAX_AGE) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000); // every hour
cleanupInterval.unref(); // Allow Node process to exit cleanly

/**
 * Factory function to create a rate-limiting middleware with custom thresholds.
 * Each call returns an independent middleware that shares the global in-memory store
 * but uses a unique key prefix so limits are tracked separately per endpoint.
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const { windowMs, maxRequests, blockTimeMs, keyPrefix, actionLabel = "request" } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;

      if (!ip) {
        throw new ApiError(httpStatus.FORBIDDEN, "Could not determine client IP address.");
      }

      const now = Date.now();
      const key = `${keyPrefix}_${ip}`;

      let rec = store.get(key);
      if (!rec) {
        rec = { count: 1, firstRequestAt: now };
        store.set(key, rec);
        return next();
      }

      // If currently blocked
      if (rec.blockedUntil && rec.blockedUntil > now) {
        const retryAfter = Math.ceil((rec.blockedUntil - now) / 1000);
        res.setHeader("Retry-After", String(retryAfter));
        throw new ApiError(
          httpStatus.TOO_MANY_REQUESTS,
          `Too many ${actionLabel} attempts from this IP. Try again after ${Math.ceil(retryAfter / 60)} minutes.`
        );
      }

      // Reset window if elapsed
      if (now - rec.firstRequestAt > windowMs) {
        rec.count = 1;
        rec.firstRequestAt = now;
        rec.blockedUntil = undefined;
        store.set(key, rec);
        return next();
      }

      rec.count += 1;

      if (rec.count > maxRequests) {
        rec.blockedUntil = now + blockTimeMs;
        store.set(key, rec);
        const retryAfter = Math.ceil(blockTimeMs / 1000);
        res.setHeader("Retry-After", String(retryAfter));
        throw new ApiError(
          httpStatus.TOO_MANY_REQUESTS,
          `Too many ${actionLabel} attempts. This IP has been temporarily blocked.`
        );
      }

      store.set(key, rec);
      return next();
    } catch (error) {
      next(error);
    }
  };
};

// ── Pre-configured rate limiters for authentication endpoints ──

/** Registration: 5 attempts per hour, 24-hour block (original behaviour) */
export const ipRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,        // 1 hour
  maxRequests: 5,
  blockTimeMs: 24 * 60 * 60 * 1000, // 24 hours
  keyPrefix: "reg",
  actionLabel: "registration",
});

/** Login: 10 attempts per 15 minutes, 15-minute block */
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 10,
  blockTimeMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: "login",
  actionLabel: "login",
});

/** Forgot Password: 3 attempts per hour, 1-hour block (prevents email spam) */
export const forgotPasswordRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 3,
  blockTimeMs: 60 * 60 * 1000, // 1 hour
  keyPrefix: "forgot_pw",
  actionLabel: "password reset",
});

/** Reset Password: 5 attempts per hour, 1-hour block */
export const resetPasswordRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 5,
  blockTimeMs: 60 * 60 * 1000, // 1 hour
  keyPrefix: "reset_pw",
  actionLabel: "password reset",
});

export default ipRateLimiter;

