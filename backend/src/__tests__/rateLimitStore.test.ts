const mockFindOneAndUpdate = jest.fn();
const mockLoggerError = jest.fn();
const mockRedisClient = {
  status: "end",
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  incrby: jest.fn(),
  expire: jest.fn(),
  on: jest.fn(),
};

jest.mock("mongoose", () => ({
  Schema: jest.fn().mockImplementation(() => ({
    index: jest.fn(),
  })),
  model: jest.fn(() => ({
    findOneAndUpdate: mockFindOneAndUpdate,
  })),
}), { virtual: true });

jest.mock("../utils/logger.util", () => ({
  __esModule: true,
  default: {
    error: mockLoggerError,
  },
}));

jest.mock("../app/utils/redis.client", () => ({
  __esModule: true,
  default: mockRedisClient,
}), { virtual: true });

import { consumeRateLimit, consumeTokenQuota } from "../app/middleware/rate_limit.store";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    mockFindOneAndUpdate.mockReset();
    mockLoggerError.mockReset();
    mockRedisClient.status = "end";
    mockRedisClient.get.mockReset();
    mockRedisClient.set.mockReset();
    mockRedisClient.del.mockReset();
    mockRedisClient.incrby.mockReset();
    mockRedisClient.expire.mockReset();
    mockRedisClient.on.mockReset();
  });

  it("fails closed when the backing store throws", async () => {
    mockFindOneAndUpdate.mockRejectedValueOnce(new Error("database unavailable"));

    const result = await consumeRateLimit({
      key: "login_127.0.0.1",
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      blockTimeMs: 15 * 60 * 1000,
    });

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBe(60);
    expect(result.remaining).toBe(0);
    expect(typeof result.resetAt).toBe("number");
    expect(mockLoggerError).toHaveBeenCalledWith(
      "Rate limit store error for login_127.0.0.1: database unavailable"
    );
  });

  it("allows a request within the rate limit window", async () => {
    const now = new Date();
    mockFindOneAndUpdate.mockResolvedValueOnce({
      key: "login_127.0.0.1",
      count: 3,
      firstRequestAt: now,
      blockedUntil: null,
      expireAt: new Date(now.getTime() + 16 * 60 * 1000),
    });

    const result = await consumeRateLimit({
      key: "login_127.0.0.1",
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      blockTimeMs: 15 * 60 * 1000,
    });

    expect(result.allowed).toBe(true);
    expect(result.retryAfterSec).toBe(0);
    expect(result.remaining).toBe(7);
  });

  it("blocks a request that exceeds the rate limit", async () => {
    const now = new Date();
    mockFindOneAndUpdate.mockResolvedValueOnce({
      key: "login_127.0.0.1",
      count: 11,
      firstRequestAt: now,
      blockedUntil: new Date(now.getTime() + 15 * 60 * 1000),
      expireAt: new Date(now.getTime() + 16 * 60 * 1000),
    });

    const result = await consumeRateLimit({
      key: "login_127.0.0.1",
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      blockTimeMs: 15 * 60 * 1000,
    });

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
    expect(result.remaining).toBe(0);
  });

  it("blocks a request when already in the block window", async () => {
    const now = new Date();
    const blockUntil = new Date(now.getTime() + 5 * 60 * 1000);
    mockFindOneAndUpdate.mockResolvedValueOnce({
      key: "login_127.0.0.1",
      count: 15,
      firstRequestAt: now,
      blockedUntil: blockUntil,
      expireAt: new Date(now.getTime() + 16 * 60 * 1000),
    });

    const result = await consumeRateLimit({
      key: "login_127.0.0.1",
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      blockTimeMs: 15 * 60 * 1000,
    });

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
    expect(result.remaining).toBe(0);
  });

  it("falls back to allowing token quota checks when Redis is not ready", async () => {
    const result = await consumeTokenQuota("user-123", 2, 10);

    expect(result).toEqual({
      allowed: true,
      remainingTokens: 10,
      retryAfterSec: 0,
    });
    expect(mockRedisClient.get).not.toHaveBeenCalled();
    expect(mockRedisClient.incrby).not.toHaveBeenCalled();
    expect(mockRedisClient.expire).not.toHaveBeenCalled();
  });
});

describe("consumeTokenQuota with Redis ready", () => {
  beforeEach(() => {
    mockRedisClient.status = "ready";
    mockRedisClient.get.mockReset();
    mockRedisClient.incrby.mockReset();
    mockRedisClient.expire.mockReset();
  });

  it("allows a request within the token quota", async () => {
    mockRedisClient.get.mockResolvedValueOnce("3");

    const result = await consumeTokenQuota("user-123", 2, 10);

    expect(result.allowed).toBe(true);
    expect(result.remainingTokens).toBe(5);
    expect(result.retryAfterSec).toBe(0);
    expect(mockRedisClient.incrby).toHaveBeenCalledWith(
      expect.stringContaining("token_quota:user-123:"),
      2
    );
    expect(mockRedisClient.expire).toHaveBeenCalledWith(
      expect.stringContaining("token_quota:user-123:"),
      48 * 60 * 60
    );
  });

  it("blocks a request that would exceed the token quota", async () => {
    mockRedisClient.get.mockResolvedValueOnce("9");

    const result = await consumeTokenQuota("user-123", 2, 10);

    expect(result.allowed).toBe(false);
    expect(result.remainingTokens).toBe(1);
    expect(result.retryAfterSec).toBeGreaterThan(0);
    expect(mockRedisClient.incrby).not.toHaveBeenCalled();
  });

  it("fails closed on Redis error", async () => {
    mockRedisClient.get.mockRejectedValueOnce(new Error("Redis connection refused"));

    const result = await consumeTokenQuota("user-123", 2, 10);

    expect(result.allowed).toBe(false);
    expect(result.remainingTokens).toBe(0);
    expect(result.retryAfterSec).toBe(60);
  });
});