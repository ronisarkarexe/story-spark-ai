import { Request, Response, NextFunction } from "express";
import ApiError from "../../errors/api_error";
import httpStatus from "http-status";

interface RateRecord {
  count: number;
  firstRequestAt: number;
  blockedUntil?: number;
}

const store = new Map<string, RateRecord>();

// Configurable limits
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours window
const MAX_REQUESTS = 5; // max free generations per WINDOW_MS
const BLOCK_TIME_MS = 24 * 60 * 60 * 1000; // block 24 hours when exceeded

// Cleanup old keys periodically to prevent memory leak
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of store.entries()) {
    const age = now - rec.firstRequestAt;
    if ((rec.blockedUntil && rec.blockedUntil < now) || age > WINDOW_MS + BLOCK_TIME_MS) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000); // every hour
cleanupInterval.unref(); // Allow Node process to exit cleanly

export const freeAiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip;
    
    if (!ip) {
      throw new ApiError(httpStatus.FORBIDDEN, "Could not determine client IP address.");
    }
    
    const now = Date.now();
    const key = `free_ai_${ip}`;

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
        `Daily limit for free generations reached. Try again after ${Math.ceil(retryAfter / 3600)} hours or sign in to use your monthly quota.`
      );
    }

    // Reset window if elapsed
    if (now - rec.firstRequestAt > WINDOW_MS) {
      rec.count = 1;
      rec.firstRequestAt = now;
      rec.blockedUntil = undefined;
      store.set(key, rec);
      return next();
    }

    rec.count += 1;

    if (rec.count > MAX_REQUESTS) {
      rec.blockedUntil = now + BLOCK_TIME_MS;
      store.set(key, rec);
      const retryAfter = Math.ceil(BLOCK_TIME_MS / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        "Daily limit for free generations reached. Please sign in to continue generating stories."
      );
    }

    store.set(key, rec);
    return next();
  } catch (error) {
    next(error);
  }
};

export default freeAiRateLimiter;
