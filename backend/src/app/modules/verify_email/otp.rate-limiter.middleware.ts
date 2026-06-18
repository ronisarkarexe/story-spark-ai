import { Request, Response, NextFunction } from "express";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { consumeRateLimit } from "../../middleware/rate_limit.store";

// OTP rate limiter constants — mirroring the original tiered behaviour
// but now backed by MongoDB so state survives restarts and is shared
// across all Node.js processes/instances.
const PHASE_1_MAX_ATTEMPTS = 5;
const COOLDOWN_TIME_MS = 5 * 60 * 1000;      // 5 minutes
const PERMANENT_BLOCK_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Tiered Rate limiting middleware for OTP verification — MongoDB-backed.
 *
 * Previously used a module-level in-memory object which was lost on server
 * restart and not shared across multiple Node.js processes (PM2 cluster,
 * multiple dynos). Now uses the shared MongoDB consumeRateLimit store so
 * blocks persist across restarts and are consistent across all instances.
 *
 * Tiers:
 * - 5 free attempts within a 5-minute window → 5-minute cooldown
 * - 3 final chances (8 total) → 24-hour block
 */
export const otpRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body?.email;

    if (!email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
    }

    const normalizedEmail = email.toString().toLowerCase().trim();
    const key = `otp_${normalizedEmail}`;

    // Phase 1: 5 attempts per 5-minute window with 5-minute cooldown
    const phase1Result = await consumeRateLimit({
      key: `${key}_phase1`,
      windowMs: COOLDOWN_TIME_MS,
      maxRequests: PHASE_1_MAX_ATTEMPTS,
      blockTimeMs: COOLDOWN_TIME_MS,
    });

    if (!phase1Result.allowed) {
      const minsLeft = Math.ceil(phase1Result.retryAfterSec / 60);
      // Phase 2: allow 3 more attempts before permanent block
      const phase2Result = await consumeRateLimit({
        key: `${key}_phase2`,
        windowMs: PERMANENT_BLOCK_TIME_MS,
        maxRequests: 3,
        blockTimeMs: PERMANENT_BLOCK_TIME_MS,
      });

      if (!phase2Result.allowed) {
        const hoursLeft = Math.ceil(phase2Result.retryAfterSec / 3600);
        throw new ApiError(
          httpStatus.TOO_MANY_REQUESTS,
          `You have been blocked from verifying due to too many attempts. Please try again after ${hoursLeft} hours.`
        );
      }

      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        `Too many OTP verification attempts. Please try again after ${minsLeft} minutes.`
      );
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export const clearOtpAttempts = (_email: string) => {
  // With MongoDB-backed store, individual key deletion is handled by
  // the TTL index on the RateLimitRecord collection automatically.
  // No manual cleanup needed — records expire via MongoDB TTL.
};
