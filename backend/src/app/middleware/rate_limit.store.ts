import { Schema, model } from "mongoose";
import logger from "../../utils/logger.util";

// Shared, serverless safe rate limit store backed by MongoDB. The previous
// in-memory Map could not work across Vercel function instances or cold starts,
// so every instance enforced its own counter and the limit was bypassable.

interface IRateLimitRecord {
  key: string;
  count: number;
  firstRequestAt: Date | null;
  blockedUntil: Date | null;
  expireAt: Date;
}

const rateLimitSchema = new Schema<IRateLimitRecord>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  firstRequestAt: { type: Date, default: null },
  blockedUntil: { type: Date, default: null },
  expireAt: { type: Date, required: true },
});

// TTL index: Mongo removes the document once expireAt passes, so stale keys are
// cleaned up automatically without an in-process interval.
rateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitRecord = model<IRateLimitRecord>(
  "RateLimitRecord",
  rateLimitSchema
);

export interface ConsumeOptions {
  key: string;
  windowMs: number;
  maxRequests: number;
  blockTimeMs: number;
}

export interface ConsumeResult {
  allowed: boolean;
  retryAfterSec: number;
}

const STORE_ERROR_RETRY_AFTER_SEC = 60;

// Atomically records one hit for a key and decides whether it is allowed.
// The whole window-and-block state transition runs in a single pipeline update
// so concurrent requests cannot race. Fails closed on store errors.
export const consumeRateLimit = async (
  opts: ConsumeOptions
): Promise<ConsumeResult> => {
  const { key, windowMs, maxRequests, blockTimeMs } = opts;
  const now = new Date();
  const ttlMs = Math.max(windowMs, blockTimeMs) + 60_000;

  try {
    const prevCount = { $ifNull: ["$count", 0] };
    const prevFirst = { $ifNull: ["$firstRequestAt", now] };
    const prevBlocked = { $ifNull: ["$blockedUntil", null] };
    const currentlyBlocked = {
      $and: [{ $ne: [prevBlocked, null] }, { $gt: [prevBlocked, now] }],
    };
    const windowElapsed = { $gt: [{ $subtract: [now, prevFirst] }, windowMs] };

    const updated = await RateLimitRecord.findOneAndUpdate(
      { key },
      [
        {
          $set: {
            _blocked: currentlyBlocked,
            _prevBlocked: prevBlocked,
            _count: {
              $cond: [
                currentlyBlocked,
                prevCount,
                { $cond: [windowElapsed, 1, { $add: [prevCount, 1] }] },
              ],
            },
            _first: {
              $cond: [
                currentlyBlocked,
                prevFirst,
                { $cond: [windowElapsed, now, prevFirst] },
              ],
            },
          },
        },
        {
          $set: {
            count: "$_count",
            firstRequestAt: "$_first",
            blockedUntil: {
              $cond: [
                "$_blocked",
                "$_prevBlocked",
                {
                  $cond: [
                    { $gt: ["$_count", maxRequests] },
                    new Date(now.getTime() + blockTimeMs),
                    null,
                  ],
                },
              ],
            },
            expireAt: new Date(now.getTime() + ttlMs),
          },
        },
        { $unset: ["_blocked", "_prevBlocked", "_count", "_first"] },
      ],
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const blockedUntil = updated?.blockedUntil ?? null;
    if (blockedUntil && blockedUntil.getTime() > now.getTime()) {
      return {
        allowed: false,
        retryAfterSec: Math.ceil(
          (blockedUntil.getTime() - now.getTime()) / 1000
        ),
      };
    }
    return { allowed: true, retryAfterSec: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Rate limit store error for ${key}: ${message}`);
    return { allowed: false, retryAfterSec: STORE_ERROR_RETRY_AFTER_SEC };
  }
};

import Redis from "ioredis";

// We use ioredis to securely track token quotas
const redisClient = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : new Redis();

const QUOTA_LUA = `
local key     = KEYS[1]
local needed  = tonumber(ARGV[1])
local limit   = tonumber(ARGV[2])
local ttl_sec = tonumber(ARGV[3])

local current = tonumber(redis.call('GET', key) or 0)
if current + needed > limit then
  return {0, current, redis.call('TTL', key)}
end

local after = redis.call('INCRBY', key, needed)
if after == needed then
  -- Key was just created (first request); set the expiry now.
  redis.call('EXPIRE', key, ttl_sec)
end
return {1, after, ttl_sec}
`;

export const consumeTokenQuota = async (
  userIdOrIp: string,
  tokensRequired: number,
  dailyQuotaLimit: number
): Promise<{ allowed: boolean; remainingTokens: number; retryAfterSec: number }> => {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const key = `token_quota:${userIdOrIp}:${dateStr}`;

  // TTL: seconds remaining until midnight UTC
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  ));
  const ttlSec = Math.ceil((tomorrow.getTime() - now.getTime()) / 1000);

  try {
    // eval(script, numkeys, ...keys, ...args) – ioredis signature
    const result = await redisClient.eval(
      QUOTA_LUA,
      1,           // number of KEYS
      key,         // KEYS[1]
      String(tokensRequired),
      String(dailyQuotaLimit),
      String(ttlSec)
    ) as [number, number, number];

    const [allowed, usedOrAfter] = result;

    if (allowed === 0) {
      return {
        allowed: false,
        remainingTokens: Math.max(0, dailyQuotaLimit - usedOrAfter),
        retryAfterSec: ttlSec,
      };
    }

    return {
      allowed: true,
      remainingTokens: Math.max(0, dailyQuotaLimit - usedOrAfter),
      retryAfterSec: 0,
    };
  } catch (error) {
    logger.error(`Redis token quota error: ${error}`);
    // Fail closed: deny when the quota store is unreachable.
    return { allowed: false, remainingTokens: 0, retryAfterSec: 60 };
  }
};
