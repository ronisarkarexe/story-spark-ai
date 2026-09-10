import { Request, Response, NextFunction } from "express";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

interface RateLimitRecord {
  attempts: number;
  blockUntil: number;
  lastAttemptAt: number;
}

// FIX #1: Switched to a Map. Maps perform better for frequent key additions/removals
// and inherently track insertion order, making it easy to pop the oldest entry to prevent OOM.
const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_STORE_SIZE = 10000; // Hard limit to prevent Memory DoS
const PHASE_1_MAX_ATTEMPTS = 5;
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes
const PHASE_2_MAX_ATTEMPTS = 8; // 5 + 3 final chances
const PERMANENT_BLOCK_TIME = 24 * 60 * 60 * 1000; // 24 hours block
const IDLE_RESET_TIME = 15 * 60 * 1000; // 15 mins of inactivity resets limits deterministically

// Cleanup old keys periodically to prevent memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (
      (now > record.blockUntil && record.attempts >= PHASE_2_MAX_ATTEMPTS) ||
      (now > record.lastAttemptAt + IDLE_RESET_TIME)
    ) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // every hour
cleanupInterval.unref();

/**
 * Tiered Rate limiting middleware for OTP verification
 * - 5 free attempts
 * - 5 mins cooldown
 * - 3 final chances
 * - 24 hour block
 */
export const otpRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body?.email;

    if (!email) {
      // FIX #3: Pass errors to Express next() rather than throwing directly
      return next(new ApiError(httpStatus.BAD_REQUEST, "Email is required"));
    }

    const normalizedEmail = email.toString().toLowerCase().trim();
    const now = Date.now();
    const key = `otp_${normalizedEmail}`;

    // FIX #1b: Memory DoS Protection - Evict the oldest key if we hit our maximum map size
    if (rateLimitStore.size >= MAX_STORE_SIZE && !rateLimitStore.has(key)) {
      const oldestKey = rateLimitStore.keys().next().value;
      if (oldestKey) rateLimitStore.delete(oldestKey);
    }

    // Initialize or get record
    const record = rateLimitStore.get(key) || { attempts: 0, blockUntil: 0, lastAttemptAt: now };

    // FIX #2: Deterministic Reset - If the user has been idle for the reset time (and is not actively blocked), reset attempts.
    if (now - record.lastAttemptAt > IDLE_RESET_TIME && now > record.blockUntil) {
      record.attempts = 0;
      record.blockUntil = 0;
    }

    // Check if currently blocked
    if (record.blockUntil > now) {
      const minsLeft = Math.ceil((record.blockUntil - now) / 60000);
      const hoursLeft = Math.ceil((record.blockUntil - now) / (60000 * 60));
      
      if (record.attempts >= PHASE_2_MAX_ATTEMPTS) {
        return next(
          new ApiError(
            httpStatus.TOO_MANY_REQUESTS,
            `You have been blocked from verifying due to too many attempts. Please try again after ${hoursLeft} hours.`
          )
        );
      } else {
        return next(
          new ApiError(
            httpStatus.TOO_MANY_REQUESTS,
            `Too many OTP verification attempts. Please try again after ${minsLeft} minutes.`
          )
        );
      }
    }

    // If the 24 hour block has passed, reset attempts
    if (record.attempts >= PHASE_2_MAX_ATTEMPTS && now > record.blockUntil) {
      record.attempts = 0;
    }

    // Increment attempts and update last activity
    record.attempts += 1;
    record.lastAttemptAt = now;

    // Apply cooldowns based on new attempt count
    if (record.attempts === PHASE_1_MAX_ATTEMPTS) {
      record.blockUntil = now + COOLDOWN_TIME;
    } else if (record.attempts >= PHASE_2_MAX_ATTEMPTS) {
      record.blockUntil = now + PERMANENT_BLOCK_TIME;
    }

    rateLimitStore.set(key, record);

    next();
  } catch (error) {
    next(error);
  }
};

export const clearOtpAttempts = (email: string) => {
  const normalizedEmail = email.toString().toLowerCase().trim();
  const key = `otp_${normalizedEmail}`;
  rateLimitStore.delete(key);
};
