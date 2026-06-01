import { Request, Response, NextFunction } from "express";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

interface RateLimitStore {
  [key: string]: {
    attempts: number;
    blockUntil: number;
  };
}

const rateLimitStore: RateLimitStore = {};

const PHASE_1_MAX_ATTEMPTS = 5;
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes
const PHASE_2_MAX_ATTEMPTS = 8; // 5 + 3 final chances
const PERMANENT_BLOCK_TIME = 24 * 60 * 60 * 1000; // 24 hours block

// Cleanup old keys periodically to prevent memory leaks
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(rateLimitStore)) {
    const record = rateLimitStore[key];
    if (
      (now > record.blockUntil && record.attempts >= PHASE_2_MAX_ATTEMPTS) ||
      (now > record.blockUntil + COOLDOWN_TIME && record.attempts < PHASE_2_MAX_ATTEMPTS)
    ) {
      delete rateLimitStore[key];
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
  const email = req.body?.email;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
  }

  const normalizedEmail = email.toString().toLowerCase().trim();
  const now = Date.now();
  const key = `otp_${normalizedEmail}`;

  // Initialize or get record
  const record = rateLimitStore[key] || { attempts: 0, blockUntil: 0 };

  // Check if currently blocked
  if (record.blockUntil > now) {
    const minsLeft = Math.ceil((record.blockUntil - now) / 60000);
    const hoursLeft = Math.ceil((record.blockUntil - now) / (60000 * 60));
    
    if (record.attempts >= PHASE_2_MAX_ATTEMPTS) {
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        `You have been blocked from verifying due to too many attempts. Please try again after ${hoursLeft} hours.`
      );
    } else {
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        `Too many OTP verification attempts. Please try again after ${minsLeft} minutes.`
      );
    }
  }

  // If the 24 hour block has passed, reset attempts
  if (record.attempts >= PHASE_2_MAX_ATTEMPTS && now > record.blockUntil) {
    record.attempts = 0;
  }

  // Increment attempts
  record.attempts += 1;

  // Apply cooldowns based on new attempt count
  if (record.attempts === PHASE_1_MAX_ATTEMPTS) {
    record.blockUntil = now + COOLDOWN_TIME;
  } else if (record.attempts >= PHASE_2_MAX_ATTEMPTS) {
    record.blockUntil = now + PERMANENT_BLOCK_TIME;
  }

  rateLimitStore[key] = record;

  next();
};
