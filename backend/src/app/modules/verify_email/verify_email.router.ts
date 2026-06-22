import express from "express";
import { VerifyEmailController } from "./verify_email.controller";
import { otpRateLimiter } from "./otp.rate-limiter.middleware";
import { apiRateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

router.post("/verify-email", apiRateLimiter, VerifyEmailController.VerifyEmail);
router.post("/verify-otp", apiRateLimiter, otpRateLimiter, VerifyEmailController.VerifyOtp);

export const VerifyEmailRouter = router;