import { AuthService } from "../auth.service";
import { User } from "../../user/user.model";
import { OTPModel } from "../../verify_email/otp.model";
import authMiddleware from "../../../middleware/auth.middleware";
import checkRequestLimit from "../../../middleware/check.request.limit";
import { JwtHalers } from "../../../../utils/jwt.helper";
import httpStatus from "http-status";
import { Request, Response } from "express";

jest.mock("../../user/user.model");
jest.mock("../../verify_email/otp.model");
jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => ({
            email: "oauth@example.com",
            name: "Oauth User",
            picture: "avatar.png",
          }),
        }),
      };
    }),
  };
});

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

jest.mock("../../../../config", () => ({
  env: "test",
  port: "5000",
  database_url: "mongodb://mock",
  bcrypt_salt_rounds: 10,
  jwt: {
    secret: "test_secret",
    refresh_secret: "test_refresh_secret",
    expires_in: "1h",
    refresh_expires_in: "30d",
  },
  google_client_id: "google_id",
}));

const mockedUser = User as jest.Mocked<typeof User>;
const mockedOTPModel = OTPModel as jest.Mocked<typeof OTPModel>;

describe("Auth Token Versioning Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should include tokenVersion in the token payload", async () => {
      mockedUser.findOne.mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        password: "hashed_password",
        role: "user",
        subscriptionType: "free",
        name: "Test User",
        postsCount: 0,
        tokenVersion: 2,
      } as any);

      const result = await AuthService.login({
        email: "test@example.com",
        password: "password123",
      });

      const decodedAccess = JwtHalers.verifyToken(result.accessToken, "test_secret" as any);
      expect(decodedAccess.tokenVersion).toBe(2);

      const decodedRefresh = JwtHalers.verifyToken(result.refreshToken, "test_refresh_secret" as any);
      expect(decodedRefresh.tokenVersion).toBe(2);
    });
  });

  describe("register", () => {
    it("should include tokenVersion in the token payload", async () => {
      mockedOTPModel.findOne.mockResolvedValue({
        email: "test@example.com",
        isVerified: true,
        verificationToken: "token123",
        verificationTokenExpires: new Date(Date.now() + 100000),
      } as any);

      mockedUser.findOne.mockResolvedValue(null);
      mockedUser.create.mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        name: "Test User",
        postsCount: 0,
        tokenVersion: 0,
      } as any);

      const result = await AuthService.register({
        email: "test@example.com",
        name: "Test User",
        verificationToken: "token123",
      } as any);

      const decodedAccess = JwtHalers.verifyToken(result.accessToken, "test_secret" as any);
      expect(decodedAccess.tokenVersion).toBe(0);
    });
  });

  describe("googleLogin", () => {
    it("should include tokenVersion in the token payload", async () => {
      mockedUser.findOne.mockResolvedValue({
        _id: "user123",
        email: "oauth@example.com",
        role: "user",
        subscriptionType: "free",
        name: "Oauth User",
        postsCount: 0,
        tokenVersion: 1,
      } as any);

      const result = await AuthService.googleLogin({ token: "google_token" });

      const decodedAccess = JwtHalers.verifyToken(result.accessToken, "test_secret" as any);
      expect(decodedAccess.tokenVersion).toBe(1);
    });
  });

  describe("resetPassword", () => {
    it("should increment tokenVersion and return tokens with incremented version", async () => {
      mockedOTPModel.findOne.mockResolvedValue({
        email: "test@example.com",
        isVerified: true,
        verificationToken: "token123",
        verificationTokenExpires: new Date(Date.now() + 100000),
      } as any);

      const mockSave = jest.fn();
      const mockUserInstance = {
        _id: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        name: "Test User",
        postsCount: 0,
        tokenVersion: 1,
        password: "old_password",
        save: mockSave,
      };

      mockedUser.findOne.mockResolvedValue(mockUserInstance as any);

      const result = await AuthService.resetPassword({
        email: "test@example.com",
        password: "NewPassword123!",
        confirmPassword: "NewPassword123!",
        verificationToken: "token123",
      });

      expect(mockUserInstance.tokenVersion).toBe(2);
      expect(mockSave).toHaveBeenCalled();

      const decodedAccess = JwtHalers.verifyToken(result.accessToken, "test_secret" as any);
      expect(decodedAccess.tokenVersion).toBe(2);
    });
  });

  describe("refreshToken", () => {
    it("should succeed and return new access token if tokenVersion matches", async () => {
      mockedUser.findOne.mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        name: "Test User",
        postsCount: 0,
        tokenVersion: 3,
      } as any);

      const refreshToken = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user", subscriptionType: "free", name: "Test User", postsCount: 0, tokenVersion: 3 },
        "test_refresh_secret",
        "30d"
      );

      const result = await AuthService.refreshToken(refreshToken);
      const decodedAccess = JwtHalers.verifyToken(result.accessToken, "test_secret" as any);
      expect(decodedAccess.tokenVersion).toBe(3);
    });

    it("should throw if tokenVersion is mismatched", async () => {
      mockedUser.findOne.mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        name: "Test User",
        postsCount: 0,
        tokenVersion: 4,
      } as any);

      const oldRefreshToken = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user", subscriptionType: "free", name: "Test User", postsCount: 0, tokenVersion: 3 },
        "test_refresh_secret",
        "30d"
      );

      await expect(AuthService.refreshToken(oldRefreshToken)).rejects.toThrow("Session expired, please login again");
    });
  });

  describe("auth middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
      mockReq = {
        headers: {},
      };
      mockRes = {};
      mockNext = jest.fn();
    });

    it("should allow request if tokenVersion is valid", async () => {
      mockedUser.findById.mockResolvedValue({
        _id: "user123",
        role: "user",
        tokenVersion: 2,
      } as any);

      const token = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user", tokenVersion: 2 },
        "test_secret",
        "1h"
      );
      mockReq.headers!.authorization = token;

      const middleware = authMiddleware("user");
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user?.tokenVersion).toBe(2);
    });

    it("should reject with 401 if tokenVersion is mismatched", async () => {
      mockedUser.findById.mockResolvedValue({
        _id: "user123",
        role: "user",
        tokenVersion: 3,
      } as any);

      const token = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user", tokenVersion: 2 },
        "test_secret",
        "1h"
      );
      mockReq.headers!.authorization = token;

      const middleware = authMiddleware("user");
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(error.message).toBe("Session expired, please login again");
    });

    it("should reject with 401 if tokenVersion is missing", async () => {
      mockedUser.findById.mockResolvedValue({
        _id: "user123",
        role: "user",
        tokenVersion: 2,
      } as any);

      const token = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user" },
        "test_secret",
        "1h"
      );
      mockReq.headers!.authorization = token;

      const middleware = authMiddleware("user");
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("checkRequestLimit middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
      mockReq = {
        headers: {},
      };
      mockRes = {};
      mockNext = jest.fn();
    });

    it("should allow request if tokenVersion is valid", async () => {
      mockedUser.findById.mockResolvedValue({
        _id: "user123",
        role: "user",
        tokenVersion: 2,
      } as any);

      const token = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user", tokenVersion: 2 },
        "test_secret",
        "1h"
      );
      mockReq.headers!.authorization = token;

      const middleware = checkRequestLimit();
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it("should reject with 401 if tokenVersion is mismatched", async () => {
      mockedUser.findById.mockResolvedValue({
        _id: "user123",
        role: "user",
        tokenVersion: 3,
      } as any);

      const token = JwtHalers.createToken(
        { _id: "user123", email: "test@example.com", role: "user", tokenVersion: 2 },
        "test_secret",
        "1h"
      );
      mockReq.headers!.authorization = token;

      const middleware = checkRequestLimit();
      await middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
