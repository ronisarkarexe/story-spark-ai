import { Request, Response, NextFunction } from "express";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import mongoose, { Schema, Document } from "mongoose";

export interface IOtpRateLimit extends Document {
  email: string;
  attempts: number;
  blockUntil: Date | null;
}

const otpRateLimitSchema = new Schema<IOtpRateLimit>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    attempts: { type: Number, default: 0 },
    blockUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export const OtpRateLimit = mongoose.model<IOtpRateLimit>("OtpRateLimit", otpRateLimitSchema);

const PHASE_1_MAX_ATTEMPTS = 5;
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes
const PHASE_2_MAX_ATTEMPTS = 8; // 5 + 3 final chances
const PERMANENT_BLOCK_TIME = 24 * 60 * 60 * 1000; // 24 hours block

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
    const now = new Date();

    // Find or create the rate limit record in MongoDB
    let record = await OtpRateLimit.findOne({ email: normalizedEmail });
    if (!record) {
      record = new OtpRateLimit({ email: normalizedEmail, attempts: 0, blockUntil: null });
    }

    // Check if currently blocked
    if (record.blockUntil && record.blockUntil.getTime() > now.getTime()) {
      const timeLeftMs = record.blockUntil.getTime() - now.getTime();
      const minsLeft = Math.ceil(timeLeftMs / 60000);
      const hoursLeft = Math.ceil(timeLeftMs / (60000 * 60));
      
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

    // If the block time has passed, we reset attempts
    if (record.blockUntil && now.getTime() > record.blockUntil.getTime()) {
      record.attempts = 0;
      record.blockUntil = null;
    }

    // Increment attempts
    record.attempts += 1;

    // Apply cooldowns based on new attempt count
    if (record.attempts === PHASE_1_MAX_ATTEMPTS) {
      record.blockUntil = new Date(now.getTime() + COOLDOWN_TIME);
    } else if (record.attempts >= PHASE_2_MAX_ATTEMPTS) {
      record.blockUntil = new Date(now.getTime() + PERMANENT_BLOCK_TIME);
    }

    await record.save();
    next();
  } catch (error) {
    next(error);
  }
};

export const clearOtpAttempts = async (email: string) => {
  const normalizedEmail = email.toString().toLowerCase().trim();
  await OtpRateLimit.deleteOne({ email: normalizedEmail });
};
