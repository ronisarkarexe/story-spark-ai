// Set environment variables to prevent AI provider validation
process.env.OPEN_AI_KEY = "test-key";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";

// Mock the rate limit store
jest.mock("../app/middleware/rate_limit.store", () => ({
  consumeRateLimit: jest.fn(),
}));

import { createSocketRateLimiter } from "../socket/socket-rate-limiter";
import { consumeRateLimit } from "../app/middleware/rate_limit.store";

const mockConsumeRateLimit = consumeRateLimit as jest.MockedFunction<typeof consumeRateLimit>;

describe("Socket.IO Rate Limiter", () => {
  let mockSocket: any;
  let mockNext: jest.Mock;
  let rateLimiter: any;

  beforeEach(() => {
    mockConsumeRateLimit.mockReset();
    
    // Create mock socket with handshake
    mockSocket = {
      handshake: {
        address: "127.0.0.1",
      },
    };
    
    mockNext = jest.fn();
    rateLimiter = createSocketRateLimiter();
  });

  it("allows connection when rate limit is not exceeded", async () => {
    mockConsumeRateLimit.mockResolvedValueOnce({
      allowed: true,
      retryAfterSec: 0,
      remaining: 29,
      resetAt: Date.now() + 60000,
    });

    await rateLimiter(mockSocket, mockNext);

    expect(mockConsumeRateLimit).toHaveBeenCalledWith({
      key: "socket_connection_127.0.0.1",
      windowMs: 60000,
      maxRequests: 30,
      blockTimeMs: 300000,
    });
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("rejects connection when rate limit is exceeded", async () => {
    mockConsumeRateLimit.mockResolvedValueOnce({
      allowed: false,
      retryAfterSec: 120,
      remaining: 0,
      resetAt: Date.now() + 120000,
    });

    await rateLimiter(mockSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("Rate limit exceeded. Please try again in 120 seconds.")
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("rejects connection when IP address is missing", async () => {
    mockSocket.handshake.address = undefined;

    await rateLimiter(mockSocket, mockNext);

    expect(mockConsumeRateLimit).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      new Error("Unable to determine client IP address")
    );
  });

  it("fails closed when rate limit store throws an error", async () => {
    mockConsumeRateLimit.mockRejectedValueOnce(new Error("Database error"));

    await rateLimiter(mockSocket, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new Error("Rate limit check failed")
    );
  });

  it("uses custom configuration when provided", async () => {
    const customConfig = {
      windowMs: 30000,
      maxRequests: 10,
      blockTimeMs: 60000,
    };
    const customRateLimiter = createSocketRateLimiter(customConfig);

    mockConsumeRateLimit.mockResolvedValueOnce({
      allowed: true,
      retryAfterSec: 0,
      remaining: 9,
      resetAt: Date.now() + 30000,
    });

    await customRateLimiter(mockSocket, mockNext);

    expect(mockConsumeRateLimit).toHaveBeenCalledWith({
      key: "socket_connection_127.0.0.1",
      windowMs: 30000,
      maxRequests: 10,
      blockTimeMs: 60000,
    });
  });

  it("handles different IP addresses independently", async () => {
    const socket1 = { handshake: { address: "192.168.1.1" } };
    const socket2 = { handshake: { address: "10.0.0.1" } };

    mockConsumeRateLimit
      .mockResolvedValueOnce({
        allowed: true,
        retryAfterSec: 0,
        remaining: 29,
        resetAt: Date.now() + 60000,
      })
      .mockResolvedValueOnce({
        allowed: false,
        retryAfterSec: 60,
        remaining: 0,
        resetAt: Date.now() + 60000,
      });

    await rateLimiter(socket1, jest.fn());
    await rateLimiter(socket2, mockNext);

    expect(mockConsumeRateLimit).toHaveBeenCalledTimes(2);
    expect(mockConsumeRateLimit).toHaveBeenNthCalledWith(1, {
      key: "socket_connection_192.168.1.1",
      windowMs: 60000,
      maxRequests: 30,
      blockTimeMs: 300000,
    });
    expect(mockConsumeRateLimit).toHaveBeenNthCalledWith(2, {
      key: "socket_connection_10.0.0.1",
      windowMs: 60000,
      maxRequests: 30,
      blockTimeMs: 300000,
    });
  });
});
