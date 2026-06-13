/**
 * checkRequestLimit.test.ts
 * ─────────────────────────
 * Tests for the checkRequestLimit middleware factory.
 *
 * Covers:
 *  1. Factory function returns a middleware (not called directly).
 *  2. Middleware calls next() when quota is available.
 *  3. Middleware calls next(err) when quota is exceeded (409 Conflict).
 *  4. Middleware calls next(err) when token is missing (401 Unauthorized).
 *  5. Regression: checkRequestLimit() (factory-invoked) must reach next()
 *     — i.e. requests no longer hang on /remix and /translate routes.
 *
 * Run: npx jest checkRequestLimit --no-coverage
 *
 * GSSoC 2026 | fix/#2096-missing-parentheses-check-request-limit
 */

import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

// ── Module mocks (must be declared before imports that use them) ──────────────

jest.mock("../utils/jwt.helper", () => ({
  JwtHelpers: {
    verifyToken: jest.fn(),
  },
}));

jest.mock("../app/modules/ai_model/quota.service", () => ({
  reserveUserQuota: jest.fn(),
}));

jest.mock("../app/modules/ai_model/quota.lifecycle", () => ({
  createUserQuotaGuard: jest.fn().mockReturnValue({ refundOnce: jest.fn() }),
}));

jest.mock("../config", () => ({
  __esModule: true,
  default: { jwt: { secret: "test-secret" } },
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { JwtHelpers } from "../utils/jwt.helper";
import { reserveUserQuota } from "../app/modules/ai_model/quota.service";
import { createUserQuotaGuard } from "../app/modules/ai_model/quota.lifecycle";
import checkRequestLimit from "../app/middleware/check.request.limit";

// ── Typed mock helpers ────────────────────────────────────────────────────────

const mockVerifyToken = JwtHelpers.verifyToken as jest.MockedFunction<
  typeof JwtHelpers.verifyToken
>;
const mockReserveUserQuota = reserveUserQuota as jest.MockedFunction<
  typeof reserveUserQuota
>;
const mockCreateUserQuotaGuard = createUserQuotaGuard as jest.MockedFunction<
  typeof createUserQuotaGuard
>;

// ── Mock builder ──────────────────────────────────────────────────────────────

function buildMocks(authHeader?: string) {
  const req = {
    headers: authHeader ? { authorization: authHeader } : {},
  } as unknown as Request;

  const locals: Record<string, unknown> = {};
  const res = { locals } as unknown as Response;

  const next: NextFunction = jest.fn();

  return { req, res, next };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("checkRequestLimit — factory function signature", () => {
  it("is a function (the factory)", () => {
    expect(typeof checkRequestLimit).toBe("function");
  });

  it("calling checkRequestLimit() returns a middleware function", () => {
    const middleware = checkRequestLimit();
    expect(typeof middleware).toBe("function");
  });

  it("calling checkRequestLimit() multiple times returns independent middleware instances", () => {
    const mw1 = checkRequestLimit();
    const mw2 = checkRequestLimit();
    // Each call should produce a distinct function reference.
    expect(mw1).not.toBe(mw2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("checkRequestLimit() — middleware behaviour", () => {
  beforeEach(() => {
    // resetAllMocks clears call history AND resets queued implementations,
    // preventing inter-test coupling from leftover mockOnce behaviour.
    jest.resetAllMocks();
  });

  // ── Happy path ──────────────────────────────────────────────────────────────

  it("calls next() with no error when token is valid and quota is available", async () => {
    mockVerifyToken.mockReturnValueOnce({ email: "user@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined);

    const { req, res, next } = buildMocks("Bearer valid.jwt.token");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    expect(mockVerifyToken).toHaveBeenCalledWith(
      "valid.jwt.token",
      "test-secret"
    );
    expect(mockReserveUserQuota).toHaveBeenCalledWith("user@example.com");
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("attaches quotaRefundGuard to res.locals after a successful reservation", async () => {
    const fakeGuard = { refundOnce: jest.fn() };
    mockVerifyToken.mockReturnValueOnce({ email: "user@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined);
    mockCreateUserQuotaGuard.mockReturnValueOnce(fakeGuard as any);

    const { req, res, next } = buildMocks("Bearer valid.jwt.token");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    expect(res.locals.quotaRefundGuard).toBe(fakeGuard);
  });

  it("strips 'Bearer ' prefix before verifying the token", async () => {
    mockVerifyToken.mockReturnValueOnce({ email: "user@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined);

    const { req, res, next } = buildMocks("Bearer abc.def.ghi");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    // Verify token was called with the raw token, not the full "Bearer …" header.
    expect(mockVerifyToken).toHaveBeenCalledWith("abc.def.ghi", "test-secret");
  });

  it("works when the token is supplied without 'Bearer ' prefix", async () => {
    mockVerifyToken.mockReturnValueOnce({ email: "user@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined);

    const { req, res, next } = buildMocks("rawtoken.without.prefix");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    expect(mockVerifyToken).toHaveBeenCalledWith(
      "rawtoken.without.prefix",
      "test-secret"
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  // ── Missing token ───────────────────────────────────────────────────────────

  it("calls next(err) with 401 when no Authorization header is present", async () => {
    const { req, res, next } = buildMocks(/* no header */);
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(mockReserveUserQuota).not.toHaveBeenCalled();
  });

  // ── Quota exceeded ──────────────────────────────────────────────────────────

  it("calls next(err) with 409 when monthly quota is exceeded", async () => {
    const quotaError = {
      statusCode: httpStatus.CONFLICT,
      message: "Monthly request limit exceeded!",
    };
    mockVerifyToken.mockReturnValueOnce({ email: "user@example.com" } as any);
    mockReserveUserQuota.mockRejectedValueOnce(quotaError);

    const { req, res, next } = buildMocks("Bearer valid.jwt.token");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err.statusCode).toBe(httpStatus.CONFLICT);
    expect(err.message).toMatch(/Monthly request limit exceeded/i);
    // Guard should NOT be attached when reservation failed.
    expect(res.locals.quotaRefundGuard).toBeUndefined();
  });

  // ── Invalid token ───────────────────────────────────────────────────────────

  it("calls next(err) when JWT verification throws", async () => {
    mockVerifyToken.mockImplementationOnce(() => {
      throw new Error("invalid signature");
    });

    const { req, res, next } = buildMocks("Bearer bad.token.here");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err.message).toBe("invalid signature");
    expect(mockReserveUserQuota).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("checkRequestLimit — quota enforcement (allow vs block)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("allows request when quota is not yet exhausted (resolves without throwing)", async () => {
    mockVerifyToken.mockReturnValueOnce({ email: "quota-ok@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined); // quota available

    const { req, res, next } = buildMocks("Bearer tok.en.ok");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    // next() must be called with no arguments — request proceeds to controller
    expect(next).toHaveBeenCalledWith();
  });

  it("blocks request when quota is exhausted (next called with error)", async () => {
    const limitError = {
      statusCode: httpStatus.CONFLICT,
      message: "Monthly request limit exceeded!",
    };
    mockVerifyToken.mockReturnValueOnce({ email: "quota-full@example.com" } as any);
    mockReserveUserQuota.mockRejectedValueOnce(limitError);

    const { req, res, next } = buildMocks("Bearer tok.en.full");
    const middleware = checkRequestLimit();

    await middleware(req, res, next);

    const [err] = (next as jest.Mock).mock.calls[0];
    expect(err).toBeDefined();
    expect(err.statusCode).toBe(httpStatus.CONFLICT);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("checkRequestLimit — regression: /remix and /translate routes no longer hang (#2096)", () => {
  /**
   * Root cause: checkRequestLimit is a middleware *factory*.
   *
   *   const checkRequestLimit = () => async (req, res, next) => { … };
   *
   * Registering it WITHOUT calling the factory:
   *
   *   router.post('/remix', checkRequestLimit, …)   ← BUG
   *
   * causes Express to call the factory as if it were middleware. The factory
   * receives (req, res, next) but it only *returns* the inner async function —
   * it never calls next(). The request hangs forever.
   *
   * The fix is to invoke the factory:
   *
   *   router.post('/remix', checkRequestLimit(), …)  ← CORRECT
   *
   * These tests verify the fix at the unit level by confirming that the
   * middleware returned by the factory always calls next().
   */

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("[/remix] middleware returned by checkRequestLimit() calls next() — request does NOT hang", async () => {
    mockVerifyToken.mockReturnValueOnce({ email: "remix@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined);

    const { req, res, next } = buildMocks("Bearer remix.jwt.token");

    // Simulate the correct registration: checkRequestLimit()
    const middleware = checkRequestLimit();
    await middleware(req, res, next);

    // If next() is never called the request would hang; this assertion
    // is the regression check.
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("[/translate] middleware returned by checkRequestLimit() calls next() — request does NOT hang", async () => {
    mockVerifyToken.mockReturnValueOnce({ email: "translate@example.com" } as any);
    mockReserveUserQuota.mockResolvedValueOnce(undefined);

    const { req, res, next } = buildMocks("Bearer translate.jwt.token");

    // Simulate the correct registration: checkRequestLimit()
    const middleware = checkRequestLimit();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("factory function (checkRequestLimit) called directly WITHOUT () never calls next() — demonstrates original bug", () => {
    /**
     * This test documents the broken behaviour so future developers
     * understand exactly what went wrong.
     *
     * checkRequestLimit is defined as:
     *   const checkRequestLimit = () => async (req, res, next) => { … };
     *
     * When Express mistakenly calls the factory as if it were middleware:
     *   router.post('/remix', checkRequestLimit, …)  ← BUG
     *
     * Express invokes checkRequestLimit(req, res, next). The factory ignores
     * those arguments and simply returns the inner async middleware function.
     * next() is never called — the request hangs forever.
     *
     * Note: result is the inner middleware *function* (not a Promise),
     * so no await is needed or meaningful here.
     */
    const { req, res, next } = buildMocks("Bearer some.jwt.token");

    // Intentionally call the factory as middleware (the old, buggy pattern).
    // Cast to `any` because TypeScript correctly flags the type mismatch.
    const result = (checkRequestLimit as any)(req, res, next);

    // The factory did NOT call next() — it only returned the inner middleware.
    expect(next).not.toHaveBeenCalled();

    // Confirm the returned value is the inner middleware function (not a Promise).
    expect(typeof result).toBe("function");
  });
});
