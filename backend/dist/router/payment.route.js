"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = __importDefault(require("../app/middleware/auth.middleware"));
const user_1 = require("../enums/user");
const ip_rate_limiter_1 = require("../app/middleware/ip.rate-limiter");
const paymentRouter = (0, express_1.Router)();
// Route to create a new Razorpay order — requires a valid user session
paymentRouter.post("/create-order", ip_rate_limiter_1.paymentRateLimiter, (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER), payment_controller_1.createOrder);
// Route to verify payment signature after successful payment — requires a valid user session
paymentRouter.post("/verify", ip_rate_limiter_1.paymentRateLimiter, (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER), payment_controller_1.verifyPayment);
exports.default = paymentRouter;
