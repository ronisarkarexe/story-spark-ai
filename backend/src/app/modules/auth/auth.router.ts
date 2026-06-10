import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validate.request";
import { UserValidator } from "../user/user.validation";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
  ipRateLimiter,
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

// Logout API route
router.post("/logout", AuthController.logout);

// Change Password API route
router.post(
  "/change-password",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(UserValidator.changePassword),
  AuthController.changePassword
);

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
