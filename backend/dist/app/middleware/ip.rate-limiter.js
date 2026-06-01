"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRateLimiter = exports.resetPasswordRateLimiter = exports.forgotPasswordRateLimiter = exports.loginRateLimiter = exports.ipRateLimiter = exports.createRateLimiter = void 0;
const api_error_1 = __importDefault(require("../../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
const rate_limit_store_1 = require("./rate_limit.store");
/**
 * Factory that builds a rate-limiting middleware backed by the shared MongoDB
 * store, so limits hold across all serverless instances and cold starts.
 * Each prefix tracks its endpoint independently.
 */
const createRateLimiter = (options) => {
    const { windowMs, maxRequests, blockTimeMs, keyPrefix, actionLabel = "request", buildMessage } = options;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ip = req.ip;
            if (!ip) {
                throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Could not determine client IP address.");
            }
            const { allowed, retryAfterSec } = yield (0, rate_limit_store_1.consumeRateLimit)({
                key: `${keyPrefix}_${ip}`,
                windowMs,
                maxRequests,
                blockTimeMs,
            });
            if (!allowed) {
                res.setHeader("Retry-After", String(retryAfterSec));
                const message = buildMessage
                    ? buildMessage(retryAfterSec)
                    : `Too many ${actionLabel} attempts. Please try again after ${Math.ceil(retryAfterSec / 60)} minutes.`;
                throw new api_error_1.default(http_status_1.default.TOO_MANY_REQUESTS, message);
            }
            return next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.createRateLimiter = createRateLimiter;
// ── Pre-configured rate limiters for authentication endpoints ──
/** Registration: 5 attempts per hour, 24-hour block (original behaviour) */
exports.ipRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    blockTimeMs: 24 * 60 * 60 * 1000, // 24 hours
    keyPrefix: "reg",
    actionLabel: "registration",
});
/** Login: 10 attempts per 15 minutes, 15-minute block */
exports.loginRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    blockTimeMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: "login",
    actionLabel: "login",
});
/** Forgot Password: 3 attempts per hour, 1-hour block (prevents email spam) */
exports.forgotPasswordRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    blockTimeMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: "forgot_pw",
    actionLabel: "password reset",
});
/** Reset Password: 5 attempts per hour, 1-hour block */
exports.resetPasswordRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    blockTimeMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: "reset_pw",
    actionLabel: "password reset",
});
/** Payment: 20 attempts per 15 minutes, 15-minute block */
exports.paymentRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20,
    blockTimeMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: "payment",
    actionLabel: "payment",
});
exports.default = exports.ipRateLimiter;
