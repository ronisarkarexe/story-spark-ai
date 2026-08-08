import type { NextFunction, Request, Response } from "express";
import csrfMiddleware, { generateCsrfToken } from "../csrf.middleware";

describe("csrf middleware", () => {
  const buildMocks = (
    headerValue?: string,
    userId: string | { toString(): string } = "user-123",
    authorization?: string
  ) => {
    const headers: Record<string, string> = {};
    if (headerValue !== undefined) {
      headers["x-csrf-token"] = headerValue;
    }
    if (authorization !== undefined) {
      headers.authorization = authorization;
    }

    const req = {
      headers,
      header: (name: string) => headers[name.toLowerCase()] ?? headers[name],
      get: (name: string) => headers[name.toLowerCase()] ?? headers[name],
      user: { _id: userId },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    return { req, res, next };
  };

  it("allows requests with a valid token", () => {
    const { req, res, next } = buildMocks(generateCsrfToken("user-123"));

    csrfMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("allows Bearer-authenticated requests without a CSRF token", () => {
    const { req, res, next } = buildMocks(undefined, "user-123", "Bearer access-token");

    csrfMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("stringifies ObjectId-like user ids for HMAC", () => {
    const objectId = { toString: () => "507f1f77bcf86cd799439011" };
    expect(generateCsrfToken(objectId)).toBe(
      generateCsrfToken("507f1f77bcf86cd799439011")
    );

    const { req, res, next } = buildMocks(
      generateCsrfToken(objectId),
      objectId
    );

    csrfMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("blocks requests with a missing token", () => {
    const { req, res, next } = buildMocks();

    csrfMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid or missing CSRF token",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("blocks requests with an invalid token", () => {
    const { req, res, next } = buildMocks("bad-token");

    csrfMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid or missing CSRF token",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
