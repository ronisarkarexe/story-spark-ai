/**
 * story.rate-limiter.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Per-user, subscription-tier-aware rate limiter for the story generation
 * endpoint.
 *
 * Fixes: Issue #3023 — No per-user rate limit on story generation endpoint.
 *
 * Key differences from the IP-based limiters (ip.rate-limiter.ts):
 *  • Keyed by `userId` (not IP), so shared IPs (NAT, VPN) are not penalised
 *    as a group and a single abusive account can't hide behind a shared IP.
 *  • Limits vary by subscription tier so the upgrade path is enforceable.
 *  • Falls back to IP-based limiting for unauthenticated requests.
 *  • Returns standard `Retry-After` and `RateLimit-*` headers.
 *
 * Tier limits (requests per hour):
 *   free    →   5 / hour
 *   pro     →  50 / hour
 *   premium → 200 / hour
 *   admin / super_admin → unlimited (bypass)
 *
 * GSSoC 2026 | fix/story-generation-rate-limit (resolves #3023)
 */

import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/api_error";
import { consumeRateLimit } from "./rate_limit.store";

// ── Tier configuration ───────────────────────────────────────────────────────

/** Hourly generation limits keyed by subscription / role tier. */
const TIER_LIMITS: Record<string, number> = {
  free: 5,
  pro: 50,
  premium: 200,
};

/**
 * Roles that bypass the rate limit entirely (admins & super-admins manage the
 * platform and should not be blocked by story generation limits).
 */
const BYPASS_ROLES = new Set(["admin", "super_admin"]);

const WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const BLOCK_TIME_MS = 60 * 60 * 1000; // block for the remainder of the window
const KEY_PREFIX = "story_gen";

// ── Middleware ────────────────────────────────────────────────────────────────

/**
 * Express middleware that enforces per-user, tier-aware rate limiting on the
 * story generation endpoint.
 *
 * Must be placed **after** the `auth` middleware so that `req.user` is
 * populated. For unauthenticated routes it falls back to the request IP.
 *
 * Usage in a router:
 * ```ts
 * router.post(
 *   "/generate",
 *   auth(ENUM_USER_ROLE.USER, ...),
 *   storyGenerationRateLimiter,
 *   storyController.generate,
 * );
 * ```
 */
export const storyGenerationRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ── Resolve user identity ──────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user as
      | { id?: string; _id?: string; role?: string; subscriptionType?: string }
      | undefined;

    const userId: string | undefined = user?.id ?? user?._id?.toString();
    const role: string = user?.role ?? "anonymous";
    const tier: string = user?.subscriptionType ?? "free";

    // ── Bypass for privileged roles ────────────────────────────────────────
    if (BYPASS_ROLES.has(role)) {
      return next();
    }

    // ── Determine limit for this user's tier ──────────────────────────────
    const maxRequests: number = TIER_LIMITS[tier] ?? TIER_LIMITS.free;

    // ── Build a stable, unique key ─────────────────────────────────────────
    // Prefer userId so that users behind the same NAT don't share a bucket.
    // Fall back to IP for unauthenticated callers (edge case — this route
    // should always be behind auth middleware).
    const ip = req.ip ?? "unknown";
    const rateLimitKey = `${KEY_PREFIX}_${userId ?? ip}`;

    // ── Consume one token from the store ──────────────────────────────────
    const { allowed, retryAfterSec } = await consumeRateLimit({
      key: rateLimitKey,
      windowMs: WINDOW_MS,
      maxRequests,
      blockTimeMs: BLOCK_TIME_MS,
    });

    // ── Set informational rate-limit headers ──────────────────────────────
    res.setHeader("RateLimit-Limit", String(maxRequests));
    res.setHeader("RateLimit-Policy", `${maxRequests};w=3600`);

    if (!allowed) {
      res.setHeader("Retry-After", String(retryAfterSec));
      res.setHeader("RateLimit-Remaining", "0");
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        `Story generation limit reached for your plan (${maxRequests}/hour). ` +
          `Please try again after ${Math.ceil(retryAfterSec / 60)} minutes, ` +
          `or upgrade your plan for a higher limit.`
      );
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export default storyGenerationRateLimiter;
