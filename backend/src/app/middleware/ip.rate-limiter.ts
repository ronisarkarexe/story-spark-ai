import { Request, Response, NextFunction } from "express";
import ApiError from "../../errors/api_error";
import httpStatus from "http-status";
import { consumeRateLimit } from "./rate_limit.store";

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
  /** Optional custom message builder for the 429 response */
  buildMessage?: (retryAfterSec: number) => string;
}

/**
 * Factory that builds a rate-limiting middleware backed by the shared MongoDB
 * store, so limits hold across all serverless instances and cold starts.
 * Each prefix tracks its endpoint independently.
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const { windowMs, maxRequests, blockTimeMs, keyPrefix, actionLabel = "request", buildMessage } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      if (!ip) {
        throw new ApiError(httpStatus.FORBIDDEN, "Could not determine client IP address.");
      }

      const { allowed, retryAfterSec } = await consumeRateLimit({
        key: `${keyPrefix}_${ip}`,
        windowMs,
        maxRequests,
        blockTimeMs,
      });

      if (!allowed) {
        res.setHeader("Retry-After", String(retryAfterSec));
        const message = buildMessage
          ? buildMessage(retryAfterSec)
          : `Too many ${actionLabel} attempts. Please try again after ${Math.ceil(retryAfterSec / 60)} minutes.`;
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, message);
      }

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


export const aiGenerationRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  blockTimeMs: 5 * 60 * 1000, // 5 minutes
  keyPrefix: "ai_generation",
  actionLabel: "AI generation",
});


/** Payment: 20 attempts per 15 minutes, 15-minute block */
export const paymentRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 20,
  blockTimeMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: "payment",
  actionLabel: "payment",
});

/** Bug report submit: 10 per hour, 1-hour block */
export const bugReportRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 10,
  blockTimeMs: 60 * 60 * 1000, // 1 hour
  keyPrefix: "bug_report",
  actionLabel: "bug report",
});

/** Contact form (sends email): 5 per hour, 1-hour block */
export const contactRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 5,
  blockTimeMs: 60 * 60 * 1000, // 1 hour
  keyPrefix: "contact",
  actionLabel: "contact",
});

/** Newsletter subscribe (sends email): 5 per hour, 1-hour block */
export const newsletterRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour
  maxRequests: 5,
  blockTimeMs: 60 * 60 * 1000, // 1 hour
  keyPrefix: "newsletter",
  actionLabel: "newsletter subscription",
});

/**
 * Refresh Token: 10 attempts per 15 minutes, 15-minute block
 * (prevents token rotation abuse)
 */
export const refreshTokenRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 10,
  blockTimeMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: "refresh_token",
  actionLabel: "token refresh",
});

/** Email verification: 10 attempts per hour, 1-hour block */
export const verifyEmailChangeRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  blockTimeMs: 60 * 60 * 1000, // 1 hour
  keyPrefix: "verify_email_change",
  actionLabel: "email verification",
});

/** Change Password: 10 attempts per 15 minutes, 15-minute block */
export const changePasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  blockTimeMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: "change_password",
  actionLabel: "password change",
});

export default ipRateLimiter;
