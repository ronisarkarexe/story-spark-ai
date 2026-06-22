import { createRateLimiter } from "./ip.rate-limiter";

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  blockTimeMs: 15 * 60 * 1000,
  keyPrefix: "global",
  actionLabel: "request",
});

export default globalRateLimiter;