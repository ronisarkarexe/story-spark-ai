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
