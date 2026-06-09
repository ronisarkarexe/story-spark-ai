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
  message: {
    success: false,
    message: "Too many search requests. Please wait a moment and try again.",
  },
  keyGenerator: (req) => {
    // Prefer real IP behind proxy (trust proxy is set in app.ts)
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown"
    );
  },
});