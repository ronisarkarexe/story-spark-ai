// backend/src/utils/aiLimiter.ts
import pLimit from "p-limit";

const rawConcurrency = parseInt(process.env.AI_CONCURRENCY ?? "3", 10);

// Guard: clamp between 1 and 10
const concurrency = Math.min(Math.max(rawConcurrency || 1, 1), 10);

export const aiLimit = pLimit(concurrency);

export const getAIConcurrencyStats = () => ({
  concurrencyLimit: concurrency,
  activeCount: aiLimit.activeCount,
  pendingCount: aiLimit.pendingCount,
});