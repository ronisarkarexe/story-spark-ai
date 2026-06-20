/**
 * rateLimitMiddleware.test.ts
 * ───────────────────────────
 * Unit tests for the sliding-window rate limiter.
 *
 * Run: npx jest rateLimitMiddleware --no-coverage
 *
 * GSSoC 2026 | feat/rate-limiting-api-key-rotation
 */
import {
  storyRateLimiter,
  clearRateLimitStore,
  getRateLimitStatus,
} from "../middlewares/rateLimitMiddleware";
import type { Request, Response, NextFunction } from "express";

// ── Mock factory ──────────────────────────────
function buildMocks(ip: string, userId?: string, headers?: Record<string, string>) {
  const req = {
    ip,
    headers : (headers ?? {}) as Record<string, string>,
    user    : userId ? { id: userId } : undefined,
  } as unknown as Request;

  const res = {
    statusCode : 200,
    body       : null as unknown,
    headers    : {} as Record<string, string>,
    status(code: number) { (this as any).statusCode = code; return this; },
    json(body: unknown)  { (this as any).body = body;        return this; },
    setHeader(k: string, v: string) { (this as any).headers[k] = v; },
  } as unknown as Response;

  const next: NextFunction = jest.fn();
  return { req, res, next };
}

// ── Clear store before each test ──────────────
beforeEach(() => clearRateLimitStore());

// ── Tests ─────────────────────────────────────
describe("storyRateLimiter — basic behaviour", () => {
  it("allows exactly 10 requests from the same IP", () => {
    const { req, res, next } = buildMocks("10.0.0.1");
    for (let i = 0; i < 10; i++) storyRateLimiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(10);
    expect((res as any).statusCode).toBe(200); // untouched
  });

  it("blocks the 11th request with 429", () => {
    const { req, res, next } = buildMocks("10.0.0.2");
    for (let i = 0; i < 10; i++) storyRateLimiter(req, res, next);
    storyRateLimiter(req, res, next);
    expect((res as any).statusCode).toBe(429);
    expect((res as any).body.success).toBe(false);
    expect((res as any).body.retryAfter).toBeGreaterThan(0);
    expect((res as any).headers["Retry-After"]).toBeDefined();
    expect(next).toHaveBeenCalledTimes(10); // not called on 11th
  });

  it("uses user.id as key for authenticated requests", () => {
    // Same IP, different user — should get separate limits
    const { req: req1, res: res1, next: next1 } = buildMocks("1.1.1.1", "user-alpha");
    const { req: req2, res: res2, next: next2 } = buildMocks("1.1.1.1", "user-beta");
    for (let i = 0; i < 10; i++) storyRateLimiter(req1, res1, next1);
    for (let i = 0; i < 10; i++) storyRateLimiter(req2, res2, next2);
    expect(next1).toHaveBeenCalledTimes(10);
    expect(next2).toHaveBeenCalledTimes(10);
  });

  it("reports correct remaining count via getRateLimitStatus", () => {
    const { req, res, next } = buildMocks("10.0.0.3");
    storyRateLimiter(req, res, next);
    storyRateLimiter(req, res, next);
    const status = getRateLimitStatus("10.0.0.3");
    expect(status.count).toBe(2);
    expect(status.remaining).toBe(8);
  });
});

describe("storyRateLimiter — X-Forwarded-For spoofing", () => {
  it("ignores X-Forwarded-For and keys on req.ip", () => {
    const { req, res, next } = buildMocks("10.0.0.1", undefined, {
      "x-forwarded-for": "1.2.3.4",
    });
    for (let i = 0; i < 10; i++) storyRateLimiter(req, res, next);
    // 11th should be blocked — same req.ip regardless of header
    storyRateLimiter(req, res, next);
    expect((res as any).statusCode).toBe(429);
  });

  it("does not create separate buckets per X-Forwarded-For value", () => {
    const { req: r1, res: s1, next: n1 } = buildMocks("10.0.0.1", undefined, {
      "x-forwarded-for": "1.1.1.1",
    });
    const { req: r2, res: s2, next: n2 } = buildMocks("10.0.0.1", undefined, {
      "x-forwarded-for": "2.2.2.2",
    });
    // First requestor fills the bucket
    for (let i = 0; i < 10; i++) storyRateLimiter(r1, s1, n1);
    // Second requestor shares same req.ip → should be blocked
    storyRateLimiter(r2, s2, n2);
    expect((s2 as any).statusCode).toBe(429);
  });
});

describe("storyRateLimiter — store management", () => {
  it("clearRateLimitStore(key) removes only that key", () => {
    const { req: r1, res: s1, next: n1 } = buildMocks("10.0.0.10");
    const { req: r2, res: s2, next: n2 } = buildMocks("10.0.0.11");
    for (let i = 0; i < 10; i++) storyRateLimiter(r1, s1, n1);
    for (let i = 0; i < 10; i++) storyRateLimiter(r2, s2, n2);

    clearRateLimitStore("10.0.0.10");

    // r1 limit should be cleared — can make 10 more
    for (let i = 0; i < 10; i++) storyRateLimiter(r1, s1, n1);
    expect(n1).toHaveBeenCalledTimes(20);

    // r2 still blocked
    storyRateLimiter(r2, s2, n2);
    expect((s2 as any).statusCode).toBe(429);
  });

  it("prunes entries whose timestamps are all outside the window (memory-leak fix)", () => {
    // Bug: store grew unbounded because entries with only stale timestamps
    // were never deleted. Fix: pruneStaleEntries removes entries with zero
    // active timestamps whenever a request triggers a prune pass.
    const nowSpy = jest.spyOn(Date, "now");

    // Anchor to real Date.now() so the module-level lastPruneAt (updated
    // by previous tests) does not cause a future-pinned time to look
    // "before" a stale prune watermark.
    const t0 = Date.now();
    nowSpy.mockReturnValue(t0);
    const a = buildMocks("10.0.0.40");
    storyRateLimiter(a.req, a.res, a.next);
    expect(getRateLimitStatus("10.0.0.40").count).toBe(1);

    // t = t0 + 120s: well past WINDOW_MS (60s) and PRUNE_INTERVAL_MS (60s).
    // Any new request will now run the prune pass.
    nowSpy.mockReturnValue(t0 + 120_000);
    const b = buildMocks("10.0.0.41");
    storyRateLimiter(b.req, b.res, b.next);

    // 10.0.0.40's only timestamp is now 120s old → older than the 60s window.
    // The entry should be deleted, not just stale. getRateLimitStatus
    // distinguishes the two: deleted → resetInMs=0; stale-but-present → resetInMs=WINDOW_MS.
    const status = getRateLimitStatus("10.0.0.40");
    expect(status.count).toBe(0);
    expect(status.resetInMs).toBe(0);

    nowSpy.mockRestore();
  });
});
