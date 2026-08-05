/**
 * requestId.middleware.test.ts
 *
 * Unit tests for the requestId middleware in backend/src/app/middleware/request.id.ts.
 * Tests: generates uuid when no X-Request-Id present, honors incoming header,
 * handles array values, trims whitespace, sets response header, calls next().
 *
 * Run: pnpm --filter story-spark-ai-backend test -- --colors=false
 */

import type { Request, Response, NextFunction } from "express";

const mockSetHeader = jest.fn();
const mockNext = jest.fn();

jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-v4"),
}));

import { v4 as uuidv4 } from "uuid";
import requestId from "../app/middleware/request.id";

describe("requestId middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      headers: {},
      id: undefined,
    };
    mockRes = {
      setHeader: mockSetHeader,
    } as any;
  });

  it("generates a uuid when no X-Request-Id header is present", () => {
    const middleware = requestId as any;
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.id).toBe("test-uuid-v4");
    expect(uuidv4).toHaveBeenCalled();
  });

  it("uses the incoming X-Request-Id header value as-is", () => {
    mockReq.headers = { "x-request-id": "existing-request-id" };

    const middleware = requestId as any;
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.id).toBe("existing-request-id");
    expect(uuidv4).not.toHaveBeenCalled();
  });

  it("uses the first element when X-Request-Id is an array", () => {
    mockReq.headers = { "x-request-id": ["array-id-first", "second"] } as any;

    const middleware = requestId as any;
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.id).toBe("array-id-first");
  });

  it("trims whitespace from the X-Request-Id header", () => {
    mockReq.headers = { "x-request-id": "  trimmed-id  " };

    const middleware = requestId as any;
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.id).toBe("trimmed-id");
  });

  it("sets X-Request-Id response header with the assigned id", () => {
    const middleware = requestId as any;
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockSetHeader).toHaveBeenCalledWith("X-Request-Id", "test-uuid-v4");
  });

  it("calls next() to pass control to the next middleware", () => {
    const middleware = requestId as any;
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
