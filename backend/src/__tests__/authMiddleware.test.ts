import auth from "../app/middleware/auth.middleware";
import { User } from "../app/modules/user/user.model";
import { TokenBlacklist } from "../app/modules/auth/tokenBlacklist.model";
import { JwtHelpers } from "../utils/jwt.helper";
import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/api_error";
import httpStatus from "http-status";
import { USER_STATUS } from "../enums/user_status";

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../app/modules/auth/tokenBlacklist.model", () => ({
  TokenBlacklist: {
    findOne: jest.fn(),
  },
}));

jest.mock("../utils/jwt.helper", () => ({
  JwtHelpers: {
    verifyToken: jest.fn(),
  },
}));

// ─── Helper Mocks ─────────────────────────────────────────────────────────────

const mockRequest = (headers: Record<string, string> = {}, cookies: Record<string, string> = {}): Partial<Request> => {
  return {
    headers,
    cookies,
  };
};

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("auth middleware - authentication & authorization", () => {
  const fakeUserId = "user_123";
  const fakeSecretToken = "valid.jwt.token";
  const fakeUserDoc = {
    _id: fakeUserId,
    status: USER_STATUS.ACTIVE,
    tokenVersion: 1,
    role: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("authenticates a valid token successfully and calls next()", async () => {
    // Arrange
    const req = mockRequest({ authorization: `Bearer ${fakeSecretToken}` });
    const res = mockResponse();
    const next = jest.fn();

    (JwtHelpers.verifyToken as jest.Mock).mockReturnValue({
      _id: fakeUserId,
      tokenVersion: 1,
      role: "user",
    });

    const mockFindOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null), // not blacklisted
    });
    (TokenBlacklist.findOne as jest.Mock) = mockFindOne;

    (User.findById as jest.Mock).mockResolvedValue(fakeUserDoc);

    // Act
    const middleware = auth("user");
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(JwtHelpers.verifyToken).toHaveBeenCalledWith(fakeSecretToken, expect.any(String));
    expect(TokenBlacklist.findOne).toHaveBeenCalledWith({ token: fakeSecretToken });
    expect(User.findById).toHaveBeenCalledWith(fakeUserId);
    expect((req as any).user).toEqual(fakeUserDoc);
    expect(next).toHaveBeenCalledWith();
  });

  it("fails and throws 401 when the token is blacklisted", async () => {
    // Arrange
    const req = mockRequest({ authorization: `Bearer ${fakeSecretToken}` });
    const res = mockResponse();
    const next = jest.fn();

    (JwtHelpers.verifyToken as jest.Mock).mockReturnValue({
      _id: fakeUserId,
      tokenVersion: 1,
      role: "user",
    });

    const mockFindOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ token: fakeSecretToken }), // blacklisted!
    });
    (TokenBlacklist.findOne as jest.Mock) = mockFindOne;

    // Act
    const middleware = auth();
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(JwtHelpers.verifyToken).toHaveBeenCalled();
    expect(TokenBlacklist.findOne).toHaveBeenCalledWith({ token: fakeSecretToken });
    expect(User.findById).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0] as ApiError;
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe("Token has been revoked. Please log in again.");
  });

  it("fails and throws 401 when the token is malformed / verifyToken throws", async () => {
    // Arrange
    const req = mockRequest({ authorization: `Bearer malformed-token` });
    const res = mockResponse();
    const next = jest.fn();

    (JwtHelpers.verifyToken as jest.Mock).mockImplementation(() => {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid signature");
    });

    // Act
    const middleware = auth();
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(JwtHelpers.verifyToken).toHaveBeenCalled();
    expect(TokenBlacklist.findOne).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("fails and throws 401 when the user's tokenVersion in DB mismatches token payload", async () => {
    // Arrange
    const req = mockRequest({ authorization: `Bearer ${fakeSecretToken}` });
    const res = mockResponse();
    const next = jest.fn();

    (JwtHelpers.verifyToken as jest.Mock).mockReturnValue({
      _id: fakeUserId,
      tokenVersion: 1, // token has version 1
      role: "user",
    });

    const mockFindOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    (TokenBlacklist.findOne as jest.Mock) = mockFindOne;

    const staleUserDoc = {
      ...fakeUserDoc,
      tokenVersion: 2, // user has bumped version to 2 in DB (e.g. logged out elsewhere)
    };
    (User.findById as jest.Mock).mockResolvedValue(staleUserDoc);

    // Act
    const middleware = auth();
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0] as ApiError;
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe("Token is invalid or expired");
  });

  it("fails closed (returns 500) if the blacklist database query throws an error", async () => {
    // Arrange
    const req = mockRequest({ authorization: `Bearer ${fakeSecretToken}` });
    const res = mockResponse();
    const next = jest.fn();

    (JwtHelpers.verifyToken as jest.Mock).mockReturnValue({
      _id: fakeUserId,
      tokenVersion: 1,
    });

    const mockFindOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("Database connection timeout")),
    });
    (TokenBlacklist.findOne as jest.Mock) = mockFindOne;

    // Act
    const middleware = auth();
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const error = next.mock.calls[0][0] as Error;
    expect(error.message).toBe("Database connection timeout");
    expect(User.findById).not.toHaveBeenCalled(); // Safe closed: did not proceed to user lookup
  });

  it("simulates full lifecycle: login, access success, logout, access fail, login again, access success", async () => {
    const tokenA = "token.session.a";
    const tokenB = "token.session.b";

    // 1. Initial State: tokenA is valid, not blacklisted, user exists
    const mockFindOne = jest.fn();
    (TokenBlacklist.findOne as jest.Mock) = mockFindOne;

    (JwtHelpers.verifyToken as jest.Mock).mockImplementation((token: string) => {
      if (token === tokenA) return { _id: fakeUserId, tokenVersion: 1, role: "user" };
      if (token === tokenB) return { _id: fakeUserId, tokenVersion: 2, role: "user" };
      throw new Error("Invalid token");
    });

    // Device A requests protected endpoint
    let req = mockRequest({ authorization: `Bearer ${tokenA}` });
    let res = mockResponse();
    let next = jest.fn();

    mockFindOne.mockReturnValueOnce({
      lean: jest.fn().mockResolvedValue(null), // not blacklisted
    });
    (User.findById as jest.Mock).mockResolvedValueOnce({
      ...fakeUserDoc,
      tokenVersion: 1,
    });

    const middleware = auth("user");
    await middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
    expect((req as any).user.tokenVersion).toBe(1);

    // 2. Logout happens: tokenA gets blacklisted
    // Device A attempts to access endpoint again with tokenA
    req = mockRequest({ authorization: `Bearer ${tokenA}` });
    res = mockResponse();
    next = jest.fn();

    mockFindOne.mockReturnValueOnce({
      lean: jest.fn().mockResolvedValue({ token: tokenA }), // blacklisted!
    });

    await middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    let error = next.mock.calls[0][0] as ApiError;
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error.message).toBe("Token has been revoked. Please log in again.");

    // 3. User logs back in: tokenB is issued
    req = mockRequest({ authorization: `Bearer ${tokenB}` });
    res = mockResponse();
    next = jest.fn();

    mockFindOne.mockReturnValueOnce({
      lean: jest.fn().mockResolvedValue(null), // tokenB is not blacklisted
    });
    (User.findById as jest.Mock).mockResolvedValueOnce({
      ...fakeUserDoc,
      tokenVersion: 2, // version bumped to 2
    });

    await middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledWith();
    expect((req as any).user.tokenVersion).toBe(2);
  });
});
