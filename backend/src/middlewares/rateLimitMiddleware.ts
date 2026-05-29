/**
 * rateLimitMiddleware.ts
 * ──────────────────────
 * Sliding-window in-memory rate limiter for AI story generation.
 *
 *  • 10 requests / minute  per authenticated user (req.user.id)
 *  • 10 requests / minute  per IP for unauthenticated guests
 *  • Returns 429 + Retry-After header when exceeded
 *  • Zero external dependencies
 *
 * GSSoC 2026 | feat/rate-limiting-api-key-rotation
 */
import { Request, Response, NextFunction } from "express";

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS    = 60_000; // 1 minute sliding window
const MAX_REQUESTS = 10;     // max requests per window

/**
 * Express middleware — apply to any AI generation route:
 *   router.post("/generate", storyRateLimiter, generateStoryHandler);
 */
export function storyRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prefer authenticated user id, fall back to IP
  const key: string =
    (req as any).user?.id ??
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ??
    req.ip ??
    "anonymous";

  const now    = Date.now();
  const entry  = store.get(key) ?? { timestamps: [] };

  // Evict timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldestTs       = entry.timestamps[0];
    const retryAfterMs   = WINDOW_MS - (now - oldestTs);
    const retryAfterSec  = Math.ceil(retryAfterMs / 1000);

    res.setHeader("Retry-After", String(retryAfterSec));
    res
      .status(429)
      .json({
        success    : false,
        message    : `Rate limit exceeded. You can make ${MAX_REQUESTS} story requests per minute. Please retry after ${retryAfterSec} seconds.`,
        retryAfter : retryAfterSec,
        limit      : MAX_REQUESTS,
        windowMs   : WINDOW_MS,
      });
    return;
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  next();
}

/** Clear store — used in tests / admin reset */
export function clearRateLimitStore(key?: string): void {
  key ? store.delete(key) : store.clear();
}

/** Peek at current usage for a key — useful for debugging */
export function getRateLimitStatus(key: string): {
  count: number;
  remaining: number;
  resetInMs: number;
} {
  const now   = Date.now();
  const entry = store.get(key);
  if (!entry) return { count: 0, remaining: MAX_REQUESTS, resetInMs: 0 };

  const active    = entry.timestamps.filter((t) => now - t < WINDOW_MS);
  const oldest    = active[0] ?? now;
  const resetInMs = Math.max(0, WINDOW_MS - (now - oldest));

  return {
    count     : active.length,
    remaining : Math.max(0, MAX_REQUESTS - active.length),
    resetInMs,
  };
}
