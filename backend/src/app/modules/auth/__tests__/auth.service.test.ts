import { Types } from "mongoose";
import { AuthService } from "../auth.service";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("../../../../utils/jwt.helper", () => ({
  JwtHelpers: {
    createToken: jest.fn(),
    verifyToken: jest.fn(),
  },
}));

jest.mock("../../../../utils/logger.util", () => ({
  __esModule: true,
  default: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

jest.mock("../../user/user.model", () => {
  const mockUser = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  };
  return { User: mockUser };
});

jest.mock("../refresh_session.model", () => ({
  RefreshSession: {
    create: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    updateMany: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

jest.mock("../../verify_email/otp.model", () => ({
  OTPModel: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

jest.mock("../../gamification/gamification.service", () => ({
  GamificationService: {
    updateDailyStreak: jest.fn(),
  },
}));

jest.mock("../../verify_email/verify_email.service", () => ({
  VerifyEmailService: {
    VerifyEmail: jest.fn(),
  },
}));

const mockedUser = require("../../user/user.model").User;
const mockedRefreshSession = require("../refresh_session.model").RefreshSession;
const mockedOTPModel = require("../../verify_email/otp.model").OTPModel;
const mockedJwtHelpers = require("../../../../utils/jwt.helper").JwtHelpers;
const mockedBcrypt = require("bcryptjs");
const mockedGamification = require("../../gamification/gamification.service").GamificationService;

describe("AuthService", () => {
  const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
  const userEmail = "test@example.com";
  const hashedPassword = "hashedPassword123";

  const mockUserDoc = {
    _id: userId,
    email: userEmail,
    name: "Test User",
    password: hashedPassword,
    role: "user",
    status: "Active",
    subscriptionType: "free",
    postsCount: 0,
    tokenVersion: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedJwtHelpers.createToken.mockReturnValue("mock-jwt-token");
    mockedJwtHelpers.verifyToken.mockReturnValue({});
  });

  describe("login", () => {
    it("should return access and refresh tokens on successful login", async () => {
      mockedUser.findOne.mockResolvedValue(mockUserDoc);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockedRefreshSession.create.mockResolvedValue({});
      mockedGamification.updateDailyStreak.mockResolvedValue(undefined);

      const result = await AuthService.login({
        email: userEmail,
        password: "password123",
      });

      expect(result.accessToken).toBe("mock-jwt-token");
      expect(result.refreshToken).toBe("mock-jwt-token");
      expect(mockedUser.findOne).toHaveBeenCalledWith({ email: userEmail });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith("password123", hashedPassword);
    });

    it("should throw NOT_FOUND when user does not exist", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      await expect(
        AuthService.login({ email: userEmail, password: "password123" })
      ).rejects.toThrow("User not found!");
    });

    it("should throw FORBIDDEN when user status is Blocked", async () => {
      mockedUser.findOne.mockResolvedValue({ ...mockUserDoc, status: "Blocked" });

      await expect(
        AuthService.login({ email: userEmail, password: "password123" })
      ).rejects.toThrow("Your account has been blocked.");
    });

    it("should throw FORBIDDEN when user status is Inactive", async () => {
      mockedUser.findOne.mockResolvedValue({ ...mockUserDoc, status: "Inactive" });

      await expect(
        AuthService.login({ email: userEmail, password: "password123" })
      ).rejects.toThrow("Your account is inactive.");
    });

    it("should throw UNAUTHORIZED when password is incorrect", async () => {
      mockedUser.findOne.mockResolvedValue(mockUserDoc);
      mockedBcrypt.compare.mockResolvedValue(false);

      await expect(
        AuthService.login({ email: userEmail, password: "wrongpassword" })
      ).rejects.toThrow("Password is not valid!");
    });

    it("should throw UNAUTHORIZED when user has no password set", async () => {
      mockedUser.findOne.mockResolvedValue({ ...mockUserDoc, password: null });

      await expect(
        AuthService.login({ email: userEmail, password: "password123" })
      ).rejects.toThrow("Please use Google login for this account!");
    });

    it("should throw BAD_REQUEST when email is not a string", async () => {
      await expect(
        AuthService.login({ email: 123 as any, password: "password123" })
      ).rejects.toThrow("Invalid email address.");
    });

    it("should throw BAD_REQUEST when email is whitespace only", async () => {
      await expect(
        AuthService.login({ email: "   ", password: "password123" })
      ).rejects.toThrow("Email address is required.");
    });
  });

  describe("changePassword", () => {
    const tokenPayload = { _id: userId.toString(), email: userEmail };

    it("should update password when old password is correct", async () => {
      const mockSave = jest.fn();
      mockedUser.findById.mockResolvedValue({ ...mockUserDoc, save: mockSave });
      mockedBcrypt.compare.mockResolvedValue(true);

      await AuthService.changePassword(tokenPayload, {
        oldPassword: "oldpass",
        newPassword: "NewPass@123",
      });

      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw NOT_FOUND when user is not found", async () => {
      mockedUser.findById.mockResolvedValue(null);

      await expect(
        AuthService.changePassword(tokenPayload, {
          oldPassword: "oldpass",
          newPassword: "NewPass@123",
        })
      ).rejects.toThrow("User not found");
    });

    it("should throw BAD_REQUEST when user has no password set", async () => {
      mockedUser.findById.mockResolvedValue({ ...mockUserDoc, password: null });

      await expect(
        AuthService.changePassword(tokenPayload, {
          oldPassword: "oldpass",
          newPassword: "NewPass@123",
        })
      ).rejects.toThrow("User does not have a password set");
    });

    it("should throw UNAUTHORIZED when old password is incorrect", async () => {
      mockedUser.findById.mockResolvedValue(mockUserDoc);
      mockedBcrypt.compare.mockResolvedValue(false);

      await expect(
        AuthService.changePassword(tokenPayload, {
          oldPassword: "wrongoldpass",
          newPassword: "NewPass@123",
        })
      ).rejects.toThrow("Old password is incorrect");
    });
  });

  describe("logout", () => {
    it("should revoke refresh session and bump tokenVersion", async () => {
      const jti = "test-jti";
      const userIdStr = userId.toString();
      mockedJwtHelpers.verifyToken.mockReturnValue({ jti, _id: userIdStr });
      mockedRefreshSession.updateOne.mockResolvedValue({});
      mockedUser.updateOne.mockResolvedValue({});

      await AuthService.logout("some-refresh-token");

      expect(mockedRefreshSession.updateOne).toHaveBeenCalledWith(
        { jti },
        { revoked: true }
      );
      expect(mockedUser.updateOne).toHaveBeenCalledWith(
        { _id: userIdStr },
        { $inc: { tokenVersion: 1 } }
      );
    });

    it("should do nothing when no token is provided", async () => {
      await AuthService.logout(undefined);
      expect(mockedJwtHelpers.verifyToken).not.toHaveBeenCalled();
    });

    it("should ignore invalid tokens gracefully", async () => {
      mockedJwtHelpers.verifyToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(AuthService.logout("invalid-token")).resolves.toBeUndefined();
    });
  });

  describe("forgotPassword", () => {
    it("should return expiresAt regardless of whether user exists", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      const mockedVerifyEmail = require("../../verify_email/verify_email.service").VerifyEmailService;
      mockedVerifyEmail.VerifyEmail.mockResolvedValue(undefined);

      const result = await AuthService.forgotPassword(userEmail);

      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockedUser.findOne).toHaveBeenCalledWith({ email: userEmail });
    });

    it("should fire and forget VerifyEmail when user exists", async () => {
      mockedUser.findOne.mockResolvedValue(mockUserDoc);
      const mockedVerifyEmail = require("../../verify_email/verify_email.service").VerifyEmailService;
      mockedVerifyEmail.VerifyEmail.mockResolvedValue(undefined);

      await AuthService.forgotPassword(userEmail);

      expect(mockedVerifyEmail.VerifyEmail).toHaveBeenCalledWith({
        email: userEmail,
        name: mockUserDoc.name,
      });
    });

    it("should throw BAD_REQUEST when email is not a string", async () => {
      await expect(AuthService.forgotPassword(123 as any)).rejects.toThrow(
        "Invalid email address."
      );
    });
  });
});
