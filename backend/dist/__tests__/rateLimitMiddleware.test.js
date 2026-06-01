"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * rateLimitMiddleware.test.ts
 * ───────────────────────────
 * Unit tests for the sliding-window rate limiter.
 *
 * Run: npx jest rateLimitMiddleware --no-coverage
 *
 * GSSoC 2026 | feat/rate-limiting-api-key-rotation
 */
const rateLimitMiddleware_1 = require("../middlewares/rateLimitMiddleware");
// ── Mock factory ──────────────────────────────
function buildMocks(ip, userId, headers) {
    const req = {
        ip,
        headers: (headers !== null && headers !== void 0 ? headers : {}),
        user: userId ? { id: userId } : undefined,
    };
    const res = {
        statusCode: 200,
        body: null,
        headers: {},
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
        setHeader(k, v) { this.headers[k] = v; },
    };
    const next = jest.fn();
    return { req, res, next };
}
// ── Clear store before each test ──────────────
beforeEach(() => (0, rateLimitMiddleware_1.clearRateLimitStore)());
// ── Tests ─────────────────────────────────────
describe("storyRateLimiter — basic behaviour", () => {
    it("allows exactly 10 requests from the same IP", () => {
        const { req, res, next } = buildMocks("10.0.0.1");
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        expect(next).toHaveBeenCalledTimes(10);
        expect(res.statusCode).toBe(200); // untouched
    });
    it("blocks the 11th request with 429", () => {
        const { req, res, next } = buildMocks("10.0.0.2");
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        expect(res.statusCode).toBe(429);
        expect(res.body.success).toBe(false);
        expect(res.body.retryAfter).toBeGreaterThan(0);
        expect(res.headers["Retry-After"]).toBeDefined();
        expect(next).toHaveBeenCalledTimes(10); // not called on 11th
    });
    it("uses user.id as key for authenticated requests", () => {
        // Same IP, different user — should get separate limits
        const { req: req1, res: res1, next: next1 } = buildMocks("1.1.1.1", "user-alpha");
        const { req: req2, res: res2, next: next2 } = buildMocks("1.1.1.1", "user-beta");
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(req1, res1, next1);
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(req2, res2, next2);
        expect(next1).toHaveBeenCalledTimes(10);
        expect(next2).toHaveBeenCalledTimes(10);
    });
    it("reports correct remaining count via getRateLimitStatus", () => {
        const { req, res, next } = buildMocks("10.0.0.3");
        (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        const status = (0, rateLimitMiddleware_1.getRateLimitStatus)("10.0.0.3");
        expect(status.count).toBe(2);
        expect(status.remaining).toBe(8);
    });
});
describe("storyRateLimiter — X-Forwarded-For spoofing", () => {
    it("ignores X-Forwarded-For and keys on req.ip", () => {
        const { req, res, next } = buildMocks("10.0.0.1", undefined, {
            "x-forwarded-for": "1.2.3.4",
        });
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        // 11th should be blocked — same req.ip regardless of header
        (0, rateLimitMiddleware_1.storyRateLimiter)(req, res, next);
        expect(res.statusCode).toBe(429);
    });
    it("does not create separate buckets per X-Forwarded-For value", () => {
        const { req: r1, res: s1, next: n1 } = buildMocks("10.0.0.1", undefined, {
            "x-forwarded-for": "1.1.1.1",
        });
        const { req: r2, res: s2, next: n2 } = buildMocks("10.0.0.1", undefined, {
            "x-forwarded-for": "2.2.2.2",
        });
        // First requestor fills the bucket
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(r1, s1, n1);
        // Second requestor shares same req.ip → should be blocked
        (0, rateLimitMiddleware_1.storyRateLimiter)(r2, s2, n2);
        expect(s2.statusCode).toBe(429);
    });
});
describe("storyRateLimiter — store management", () => {
    it("clearRateLimitStore(key) removes only that key", () => {
        const { req: r1, res: s1, next: n1 } = buildMocks("10.0.0.10");
        const { req: r2, res: s2, next: n2 } = buildMocks("10.0.0.11");
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(r1, s1, n1);
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(r2, s2, n2);
        (0, rateLimitMiddleware_1.clearRateLimitStore)("10.0.0.10");
        // r1 limit should be cleared — can make 10 more
        for (let i = 0; i < 10; i++)
            (0, rateLimitMiddleware_1.storyRateLimiter)(r1, s1, n1);
        expect(n1).toHaveBeenCalledTimes(20);
        // r2 still blocked
        (0, rateLimitMiddleware_1.storyRateLimiter)(r2, s2, n2);
        expect(s2.statusCode).toBe(429);
    });
});
