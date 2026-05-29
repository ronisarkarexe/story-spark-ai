import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validate.request";
import { UserValidator } from "../user/user.validation";
import ipRateLimiter, {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
} from "../../middleware/ip.rate-limiter";
const router = express.Router();

// Login API route
router.post(
  "/login",
  loginRateLimiter,
  validateRequest(UserValidator.login),
  AuthController.login
);

// Google Login API route
router.post("/google-login", loginRateLimiter, AuthController.googleLogin);

// Register API route
router.post(
  "/register",
  validateRequest(UserValidator.register),
  ipRateLimiter,
  AuthController.register
);

// Refresh Token API route
router.post("/refresh-token", AuthController.refreshToken);

// Forgot Password API route
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  validateRequest(UserValidator.forgotPassword),
  AuthController.forgotPassword
);

// Reset Password API route
router.post(
  "/reset-password",
  resetPasswordRateLimiter,
  validateRequest(UserValidator.resetPassword),
  AuthController.resetPassword
);

export const AuthRouter = router;

