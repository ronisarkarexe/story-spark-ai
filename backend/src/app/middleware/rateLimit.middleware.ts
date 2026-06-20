import rateLimit from "express-rate-limit";

/**
 * Dedicated rate limiter for the /api/v1/search endpoint.
 * 30 requests per minute per IP to prevent scraping and abuse.
 */
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many search requests. Please wait a moment and try again.",
});

/**
 * General API rate limiter compliant with CodeQL js/missing-rate-limiting.
 * Protects route handlers performing auth or DB access from raw spam.
 * 100 requests per 15 minutes per IP (default IPv6-safe key).
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
});