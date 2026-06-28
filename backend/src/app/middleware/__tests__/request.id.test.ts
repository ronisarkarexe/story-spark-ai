/**
 * request.id.test.ts
 * Unit tests for the request.id middleware.
 */
import requestId from "../../middleware/request.id";
import type { Request, Response, NextFunction } from "express";

// Mock uuid
jest.mock("uuid", () => ({ v4: () => "mock-uuid-v4" }));

function buildMocks(incomingHeader?: string | string[]) {
  const headers: Record<string, string> = {};
  if (incomingHeader !== undefined) {
    headers["x-request-id"] = incomingHeader as string;
  }
  const req = { headers } as unknown as Request;
  const res = {
    _headerSet: false,
    _headerValue: "",
    setHeader(key: string, val: string) {
      (this as any)._headerValue = val;
      (this as any)._headerSet = key === "X-Request-Id";
    },
  } as unknown as Response;
  const next = jest.fn();
  return { req, res, next };
}

describe("request.id middleware", () => {
  it("generates a new UUID when no x-request-id header is present", () => {
    const { req, res, next } = buildMocks();
    requestId(req, res, next);
    expect(req.id).toBe("mock-uuid-v4");
    expect(next).toHaveBeenCalled();
  });

  it("uses the incoming x-request-id header value when present (string)", () => {
    const { req, res, next } = buildMocks("incoming-id-123");
    requestId(req, res, next);
    expect(req.id).toBe("incoming-id-123");
    expect(next).toHaveBeenCalled();
  });

  it("uses the first value when x-request-id is an array", () => {
    const { req, res, next } = buildMocks(["first-id", "second-id"]);
    requestId(req, res, next);
    expect(req.id).toBe("first-id");
    expect(next).toHaveBeenCalled();
  });

  it("trims whitespace from the incoming header value", () => {
    const { req, res, next } = buildMocks("  trimmed-id  ");
    requestId(req, res, next);
    expect(req.id).toBe("trimmed-id");
    expect(next).toHaveBeenCalled();
  });

  it("sets X-Request-Id response header with the assigned id", () => {
    const { req, res, next } = buildMocks("response-id");
    requestId(req, res, next);
    expect((res as any)._headerSet).toBe(true);
    expect((res as any)._headerValue).toBe("response-id");
  });

  it("sets X-Request-Id response header with generated UUID when no incoming header", () => {
    const { req, res, next } = buildMocks();
    requestId(req, res, next);
    expect((res as any)._headerSet).toBe(true);
    expect((res as any)._headerValue).toBe("mock-uuid-v4");
  });
});
