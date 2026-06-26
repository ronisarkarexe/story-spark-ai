import { Request, Response, NextFunction } from "express";
import ApiError from "../../errors/api_error";
import httpStatus from "http-status";

interface RateRecord {
  count: number;
  firstRequestAt: number;
  blockedUntil?: number;
}

const store = new Map<string, RateRecord>();

// Configurable limits for chat
const WINDOW_MS = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS = 10; // max free chat messages per hour
const BLOCK_TIME_MS = 60 * 60 * 1000; // block 1 hour when exceeded

// Cleanup old keys periodically
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of store.entries()) {
    const age = now - rec.firstRequestAt;
    if ((rec.blockedUntil && rec.blockedUntil < now) || age > WINDOW_MS + BLOCK_TIME_MS) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000); // every hour
cleanupInterval.unref();

export const chatRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip;
    
    if (!ip) {
      throw new ApiError(httpStatus.FORBIDDEN, "Could not determine client IP address.");
    }
    
    const now = Date.now();
    const key = `chat_${ip}`;

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
        `Hourly chat limit for guest sessions reached. Try again in ${Math.ceil(retryAfter / 60)} minutes or sign in for unlimited access.`
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
        "Hourly chat limit for guest sessions reached. Please sign in to continue chatting with your Co-Pilot."
      );
    }

    store.set(key, rec);
    return next();
  } catch (error) {
    next(error);
  }
};

export default chatRateLimiter;
