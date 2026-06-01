"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailRouter = void 0;
const express_1 = __importDefault(require("express"));
const verify_email_controller_1 = require("./verify_email.controller");
const otp_rate_limiter_middleware_1 = require("./otp.rate-limiter.middleware");
const router = express_1.default.Router();
// Verify email
router.post("/verify-email", verify_email_controller_1.VerifyEmailController.VerifyEmail);
// Verify OTP with rate limiting (max 5 attempts per 15 minutes)
router.post("/verify-otp", otp_rate_limiter_middleware_1.otpRateLimiter, verify_email_controller_1.VerifyEmailController.VerifyOtp);
exports.VerifyEmailRouter = router;
