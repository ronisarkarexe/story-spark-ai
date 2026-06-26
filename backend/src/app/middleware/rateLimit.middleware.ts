import rateLimit from "express-rate-limit";

/**
 * Search endpoint limiter
 */
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many search requests. Please wait a moment and try again.",
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
});