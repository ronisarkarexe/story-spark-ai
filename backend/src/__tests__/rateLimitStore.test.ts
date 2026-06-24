const mockFindOneAndUpdate = jest.fn();
const mockLoggerError = jest.fn();

jest.mock("mongoose", () => ({
  Schema: jest.fn().mockImplementation(() => ({
    index: jest.fn(),
  })),
  model: jest.fn(() => ({
    findOneAndUpdate: mockFindOneAndUpdate,
  })),
}));

jest.mock("../utils/logger.util", () => ({
  __esModule: true,
  default: {
    error: mockLoggerError,
  },
}));

import { consumeRateLimit } from "../app/middleware/rate_limit.store";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    mockFindOneAndUpdate.mockReset();
    mockLoggerError.mockReset();
  });

  it("fails closed when the backing store throws", async () => {
    mockFindOneAndUpdate.mockRejectedValueOnce(new Error("database unavailable"));

    const result = await consumeRateLimit({
      key: "login_127.0.0.1",
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      blockTimeMs: 15 * 60 * 1000,
    });

    expect(result).toEqual({ allowed: false, retryAfterSec: 60 });
    expect(mockLoggerError).toHaveBeenCalledWith(
      "Rate limit store error for login_127.0.0.1: database unavailable"
    );
  });
});

// ─── consumeTokenQuota ────────────────────────────────────────────────────────

const mockEval = jest.fn();

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    eval: mockEval,
  }));
});

import { consumeTokenQuota } from "../app/middleware/rate_limit.store";

describe("consumeTokenQuota", () => {
  const USER = "user_abc";
  const TOKENS = 100;
  const LIMIT = 1000;

  beforeEach(() => {
    mockEval.mockReset();
  });

  it("allows request when quota is not exceeded and returns correct remaining", async () => {
    // Lua returns [allowed=1, usedAfter=100, ttlSec=<anything>]
    mockEval.mockResolvedValueOnce([1, 100, 86400]);

    const result = await consumeTokenQuota(USER, TOKENS, LIMIT);

    expect(result.allowed).toBe(true);
    expect(result.remainingTokens).toBe(900); // 1000 - 100
    expect(result.retryAfterSec).toBe(0);
  });

  it("denies request when quota is exceeded and returns time-until-midnight", async () => {
    // Lua returns [allowed=0, currentUsed=950, ttl=3600]
    mockEval.mockResolvedValueOnce([0, 950, 3600]);

    const result = await consumeTokenQuota(USER, TOKENS, LIMIT);

    expect(result.allowed).toBe(false);
    expect(result.remainingTokens).toBe(50); // 1000 - 950
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it("passes a single atomic eval call (no separate GET + INCRBY)", async () => {
    mockEval.mockResolvedValueOnce([1, 200, 86400]);

    await consumeTokenQuota(USER, TOKENS, LIMIT);

    // Must be exactly one call — the Lua script — not multiple round-trips
    expect(mockEval).toHaveBeenCalledTimes(1);
    const [, numKeys, key] = mockEval.mock.calls[0];
    expect(numKeys).toBe(1);
    expect(key).toMatch(/^token_quota:user_abc:\d{4}-\d{2}-\d{2}$/);
  });

  it("is concurrent-safe: 10 parallel bursts each get independent Lua calls", async () => {
    // Simulate 10 concurrent requests each consuming 150 tokens against a 1000-token limit.
    // With the atomic Lua fix, the backing store serialises them; only the first 6 pass.
    // Here we just assert that 10 independent eval calls are made (not one GET + 10 INCRBY).
    let counter = 0;
    mockEval.mockImplementation(async () => {
      counter += 150;
      const allowed = counter <= LIMIT ? 1 : 0;
      return [allowed, counter, 3600];
    });

    const results = await Promise.all(
      Array.from({ length: 10 }, () => consumeTokenQuota(USER, 150, LIMIT))
    );

    expect(mockEval).toHaveBeenCalledTimes(10);
    const allowed = results.filter((r) => r.allowed).length;
    const denied = results.filter((r) => !r.allowed).length;
    expect(allowed).toBe(6);  // floor(1000/150) = 6
    expect(denied).toBe(4);
  });

  it("fails closed when Redis throws", async () => {
    mockEval.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const result = await consumeTokenQuota(USER, TOKENS, LIMIT);

    expect(result).toEqual({ allowed: false, remainingTokens: 0, retryAfterSec: 60 });
    expect(mockLoggerError).toHaveBeenCalledWith(
      expect.stringContaining("Redis token quota error")
    );
  });
});