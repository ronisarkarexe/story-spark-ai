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

    expect(result).toEqual({ allowed: false, retryAfterSec: 60 });
    expect(mockLoggerError).toHaveBeenCalledWith(
      "Rate limit store error for login_127.0.0.1: database unavailable"
    );
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
