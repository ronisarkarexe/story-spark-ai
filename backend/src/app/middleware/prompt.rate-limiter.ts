import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

/**
 * Rate limiter for prompt analysis endpoints.
 * Caps requests to 10 per minute per IP to prevent DoS attacks.
 */
export const promptRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please wait before sending more prompts.",
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: "Too many requests. Please wait before sending more prompts.",
    });
  },
});

/**
 * Middleware to enforce 100KB payload size limit.
 * Returns HTTP 413 if the request body exceeds the limit.
 */
export const promptPayloadLimit = (
  req: Request,
  res: Response,
  next: Function
) => {
  const MAX_PAYLOAD_BYTES = 100 * 1024; // 100KB

  const contentLength = parseInt(req.headers["content-length"] || "0", 10);

  if (contentLength > MAX_PAYLOAD_BYTES) {
    res.status(413).json({
      success: false,
      statusCode: 413,
      message: "Payload Too Large. Request body must not exceed 100KB.",
    });
    return;
  }

  next();
};

/**
 * Middleware to sanitize incoming JSON keys.
 * Rejects requests containing unrecognized extra attributes.
 */
export const sanitizePromptPayload = (
  req: Request,
  res: Response,
  next: Function
) => {
  const ALLOWED_KEYS = ["prompt", "language", "genre", "tone"];

  const body = req.body as Record<string, unknown>;

  if (body && typeof body === "object") {
    const unknownKeys = Object.keys(body).filter(
      (key) => !ALLOWED_KEYS.includes(key)
    );

    if (unknownKeys.length > 0) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Unrecognized fields in request body: ${unknownKeys.join(", ")}`,
      });
      return;
    }
  }

  next();
};