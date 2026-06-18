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
 * Dedicated rate limiter for the educational insights endpoint.
 */
export const insightsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many educational insights requests. Please try again later.",
});