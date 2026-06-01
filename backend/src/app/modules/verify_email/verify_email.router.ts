import express from "express";
import { VerifyEmailController } from "./verify_email.controller";
import { otpRateLimiter } from "./otp.rate-limiter.middleware";
const router = express.Router();

// Verify email
router.post("/verify-email", VerifyEmailController.VerifyEmail);

// Verify OTP with rate limiting (max 5 attempts per 15 minutes)
router.post("/verify-otp", otpRateLimiter, VerifyEmailController.VerifyOtp);

export const VerifyEmailRouter = router;
