import type { NextFunction, Request, Response } from "express";
import csrfMiddleware, { generateCsrfToken } from "../csrf.middleware";

describe("csrf middleware", () => {
  const buildMocks = (headerValue?: string, userId = "user-123") => {
    const req = {
      headers: headerValue === undefined ? {} : { "x-csrf-token": headerValue },
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
