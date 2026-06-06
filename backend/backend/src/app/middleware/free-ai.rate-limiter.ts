import { createRateLimiter } from "./ip.rate-limiter";

// Free guest AI generations: 5 per 24 hours, 24-hour block once exceeded.
// Backed by the shared MongoDB store so the limit holds across serverless
// instances and cold starts.
export const freeAiRateLimiter = createRateLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  maxRequests: 5,
  blockTimeMs: 24 * 60 * 60 * 1000,
  keyPrefix: "free_ai",
  actionLabel: "free generation",
  buildMessage: (retryAfterSec) =>
    `Daily limit for free generations reached. Try again after ${Math.ceil(
      retryAfterSec / 3600
    )} hours or sign in to use your monthly quota.`,
});

export default freeAiRateLimiter;
