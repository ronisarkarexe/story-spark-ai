import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

/**
 * Dedicated rate limiter for the /api/v1/search endpoint.
 * 30 requests per minute per IP to prevent scraping and abuse.
 */
export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many search requests. Please wait a moment and try again.",
  keyGenerator: (req: Request, _res: Response): string => {
    const forwarded = (req.headers["x-forwarded-for"] as string) ?? "";
    return forwarded.split(",")[0]?.trim() || req.ip || "unknown";
  },
});

/**
 * General API rate limiter compliant with CodeQL js/missing-rate-limiting.
 * Protects route handlers performing auth or DB access from raw spam.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
  keyGenerator: (req: Request, _res: Response): string => {
    const forwarded = (req.headers["x-forwarded-for"] as string) ?? "";
    return forwarded.split(",")[0]?.trim() || req.ip || "unknown";
  },
});