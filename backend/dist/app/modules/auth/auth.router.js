"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const user_validation_1 = require("../user/user.validation");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const ip_rate_limiter_1 = require("../../middleware/ip.rate-limiter");
const router = express_1.default.Router();
// Login API route
router.post("/login", ip_rate_limiter_1.loginRateLimiter, (0, validate_request_1.default)(user_validation_1.UserValidator.login), auth_controller_1.AuthController.login);
// Google Login API route
router.post("/google-login", ip_rate_limiter_1.loginRateLimiter, auth_controller_1.AuthController.googleLogin);
// Register API route
router.post("/register", (0, validate_request_1.default)(user_validation_1.UserValidator.register), ip_rate_limiter_1.ipRateLimiter, auth_controller_1.AuthController.register);
// Refresh Token API route
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
// Logout API route
router.post("/logout", auth_controller_1.AuthController.logout);
// Change Password API route
router.post("/change-password", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), auth_controller_1.AuthController.changePassword);
// Forgot Password API route
router.post("/forgot-password", ip_rate_limiter_1.forgotPasswordRateLimiter, (0, validate_request_1.default)(user_validation_1.UserValidator.forgotPassword), auth_controller_1.AuthController.forgotPassword);
// Reset Password API route
router.post("/reset-password", ip_rate_limiter_1.resetPasswordRateLimiter, (0, validate_request_1.default)(user_validation_1.UserValidator.resetPassword), auth_controller_1.AuthController.resetPassword);
exports.AuthRouter = router;
