"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeAiRateLimiter = void 0;
const ip_rate_limiter_1 = require("./ip.rate-limiter");
// Free guest AI generations: 5 per 24 hours, 24-hour block once exceeded.
// Backed by the shared MongoDB store so the limit holds across serverless
// instances and cold starts.
exports.freeAiRateLimiter = (0, ip_rate_limiter_1.createRateLimiter)({
    windowMs: 24 * 60 * 60 * 1000,
    maxRequests: 5,
    blockTimeMs: 24 * 60 * 60 * 1000,
    keyPrefix: "free_ai",
    actionLabel: "free generation",
    buildMessage: (retryAfterSec) => `Daily limit for free generations reached. Try again after ${Math.ceil(retryAfterSec / 3600)} hours or sign in to use your monthly quota.`,
});
exports.default = exports.freeAiRateLimiter;
