import { Request, Response, NextFunction } from "express";
import logger from "../../../utils/logger.util";

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes sliding window
const MAX_REQUESTS = 5; // max 5 requests per window
const PRUNE_INTERVAL_MS = 60_000; // at most one full prune per minute
let lastPruneAt = 0;

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
      `otpRateLimiter: pruned ${removed} empty entries, trimmed ${trimmed} entries`
    );
  }
}

export function otpRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key: string =
    (req as any).user?.id ??
    req.body?.email ??
    req.ip ??
    "anonymous";

  const now = Date.now();
  pruneStaleEntries(now);
  const entry = store.get(key) ?? { timestamps: [] };

  // Evict timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldestTs = entry.timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldestTs);
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);

    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({
      success: false,
      message: `Too many OTP verification attempts. You can make ${MAX_REQUESTS} attempts every 15 minutes. Please retry after ${retryAfterSec} seconds.`,
      retryAfter: retryAfterSec,
      limit: MAX_REQUESTS,
      windowMs: WINDOW_MS,
    });
    return;
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  next();
}

export function clearOtpRateLimitStore(key?: string): void {
  key ? store.delete(key) : store.clear();
}
