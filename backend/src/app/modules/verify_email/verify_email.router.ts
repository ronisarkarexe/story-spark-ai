import express from "express";
import { VerifyEmailController } from "./verify_email.controller";
import { Request, Response, NextFunction } from "express";

const router = express.Router();

// Simple in-memory OTP rate limiter (max 5 attempts per 15 minutes per IP)
const otpAttempts = new Map<string, { count: number; resetAt: number }>();
const otpRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;
  const record = otpAttempts.get(ip);
  if (!record || now > record.resetAt) {
    otpAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }
  if (record.count >= maxAttempts) {
    return res.status(429).json({ success: false, message: "Too many OTP attempts. Please try again later." });
  }
  record.count++;
  return next();
};

// Verify email
router.post("/verify-email", VerifyEmailController.VerifyEmail);

// Verify OTP with rate limiting (max 5 attempts per 15 minutes)
router.post("/verify-otp", otpRateLimiter, VerifyEmailController.VerifyOtp);

export const VerifyEmailRouter = router;
