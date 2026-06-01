"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyRateLimiter = storyRateLimiter;
exports.clearRateLimitStore = clearRateLimitStore;
exports.getRateLimitStatus = getRateLimitStatus;
const store = new Map();
const WINDOW_MS = 60000; // 1 minute sliding window
const MAX_REQUESTS = 10; // max requests per window
/**
 * Express middleware — apply to any AI generation route:
 *   router.post("/generate", storyRateLimiter, generateStoryHandler);
 */
function storyRateLimiter(req, res, next) {
    var _a, _b, _c, _d;
    // Prefer authenticated user id, fall back to IP.
    // NOTE: Do NOT read X-Forwarded-For directly — the client controls that
    // header and can spoof a new IP per request to bypass the limit.
    // Instead rely on req.ip, which Express derives from the proxy chain
    // when trust proxy is enabled (see app.set("trust proxy", 1) in app.ts).
    const key = (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : req.ip) !== null && _c !== void 0 ? _c : "anonymous";
    const now = Date.now();
    const entry = (_d = store.get(key)) !== null && _d !== void 0 ? _d : { timestamps: [] };
    // Evict timestamps outside the sliding window
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length >= MAX_REQUESTS) {
        const oldestTs = entry.timestamps[0];
        const retryAfterMs = WINDOW_MS - (now - oldestTs);
        const retryAfterSec = Math.ceil(retryAfterMs / 1000);
        res.setHeader("Retry-After", String(retryAfterSec));
        res
            .status(429)
            .json({
            success: false,
            message: `Rate limit exceeded. You can make ${MAX_REQUESTS} story requests per minute. Please retry after ${retryAfterSec} seconds.`,
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
/** Clear store — used in tests / admin reset */
function clearRateLimitStore(key) {
    key ? store.delete(key) : store.clear();
}
/** Peek at current usage for a key — useful for debugging */
function getRateLimitStatus(key) {
    var _a;
    const now = Date.now();
    const entry = store.get(key);
    if (!entry)
        return { count: 0, remaining: MAX_REQUESTS, resetInMs: 0 };
    const active = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    const oldest = (_a = active[0]) !== null && _a !== void 0 ? _a : now;
    const resetInMs = Math.max(0, WINDOW_MS - (now - oldest));
    return {
        count: active.length,
        remaining: Math.max(0, MAX_REQUESTS - active.length),
        resetInMs,
    };
}
