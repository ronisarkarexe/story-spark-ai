/**
 * rateLimitMiddleware.ts
 * ──────────────────────
 * Sliding-window in-memory rate limiter for AI story generation.
 *
 *  • 10 requests / minute  per authenticated user (req.user.id)
 *  • 10 requests / minute  per IP for unauthenticated guests
 *  • Returns 429 + Retry-After header when exceeded
 *  • Zero external dependencies
 *  • Self-pruning store (bounded memory under long uptime)
 *
 * GSSoC 2026 | feat/rate-limiting-api-key-rotation
 */
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.util";

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS          = 60_000; // 1 minute sliding window
const MAX_REQUESTS       = 10;     // max requests per window
const PRUNE_INTERVAL_MS  = 60_000; // at most one full prune per minute
let lastPruneAt         = 0;

/**
 * Prune the in-memory store to prevent unbounded growth.
 *
 * Without this, every unique key (IP / user id) that ever hit the
 * limiter would persist in `store` forever with stale timestamps,
 * leaking memory for the lifetime of the process. Pruning is
 * piggy-backed on real traffic and runs at most once per minute so
 * it has zero steady-state cost on hot paths.
 */
function pruneStaleEntries(now: number): void {
  if (now - lastPruneAt < PRUNE_INTERVAL_MS) return;
  lastPruneAt = now;

  let removed = 0;
  let trimmed = 0;
  for (const [key, entry] of store.entries()) {
    const active = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (active.length === 0) {
      store.delete(key);
      removed++;
    } else if (active.length !== entry.timestamps.length) {
      store.set(key, { timestamps: active });
      trimmed++;
    }
  }

  if (removed > 0 || trimmed > 0) {
    logger.debug(
      `rateLimitMiddleware: pruned ${removed} empty entries, trimmed ${trimmed} entries`
    );
  }
}

/**
 * Express middleware — apply to any AI generation route:
 *   router.post("/generate", storyRateLimiter, generateStoryHandler);
 */
export function storyRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prefer authenticated user id, fall back to IP.
  // NOTE: Do NOT read X-Forwarded-For directly — the client controls that
  // header and can spoof a new IP per request to bypass the limit.
  // Instead rely on req.ip, which Express derives from the proxy chain
  // when trust proxy is enabled (see app.set("trust proxy", 1) in app.ts).
  const key: string =
    (req as any).user?.id ??
    req.ip ??
    "anonymous";

  const now   = Date.now();
  pruneStaleEntries(now);
  const entry = store.get(key) ?? { timestamps: [] };

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
