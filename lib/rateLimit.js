import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

// ---------------------------------------------------------------------------
// In-memory fallback — used when Upstash env vars are not configured.
// Safe for local development (single process) but NOT for serverless
// production where multiple Lambda instances each hold an independent Map.
// ---------------------------------------------------------------------------
const memoryBuckets = new Map();

function checkMemory(key) {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, {
      count: 1,
      resetAt: now + WINDOW_SECONDS * 1_000,
    });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }
  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  bucket.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - bucket.count };
}

// ---------------------------------------------------------------------------
// Upstash Redis sliding-window rate limiter — enforced globally across all
// serverless instances. Requires UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN environment variables (set in Vercel project
// settings; see EnvExample.txt for documentation).
// ---------------------------------------------------------------------------
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
      })
    : null;

let warnedMissingUpstash = false;

/**
 * Checks whether the given identifier (e.g. "contact:1.2.3.4") should be
 * allowed to proceed.
 *
 * In production (Upstash configured): enforced across all Lambda instances via
 * a shared Redis store — bypassing the rate limit by hitting different
 * instances is not possible.
 *
 * In local development (Upstash not configured): falls back to a process-local
 * Map. The limit still works correctly in a single-process dev server.
 *
 * @param {string} key  A namespaced identifier, e.g. "contact:<ip>"
 * @returns {Promise<{ allowed: boolean, remaining: number }>}
 */
export async function checkRateLimit(key) {
  if (!ratelimit) {
    if (!warnedMissingUpstash && process.env.NODE_ENV === "production") {
      warnedMissingUpstash = true;
      console.warn(
        "[rateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set in production; falling back to in-memory rate limiting (bypassable across serverless instances).",
      );
    }
    return checkMemory(key);
  }

const { success, remaining, reset } = await ratelimit.limit(key);

return {
  allowed: success,
  remaining: remaining ?? 0,
  resetAt: reset ?? Date.now() + WINDOW_SECONDS * 1000,
};
}
