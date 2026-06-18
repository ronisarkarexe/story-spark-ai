import express from "express";
import { VerifyEmailController } from "./verify_email.controller";
import { otpRateLimiter } from "./otp.rate-limiter.middleware";

const router = express.Router();

router.post("/verify-email", VerifyEmailController.VerifyEmail);
router.post("/verify-otp", otpRateLimiter, VerifyEmailController.VerifyOtp);

export const VerifyEmailRouter = router;