import mongoose from "mongoose";
import httpStatus from "http-status";
import { AuthService } from "../app/modules/auth/auth.service";
import { User } from "../app/modules/user/user.model";
import { OTPModel } from "../app/modules/verify_email/otp.model";
import ApiError from "../errors/api_error";
import { ENUM_USER_ROLE } from "../enums/user";

jest.mock("../app/modules/verify_email/verify_email.service", () => ({
  VerifyEmailService: {
    VerifyEmail: jest.fn().mockResolvedValue(true),
    VerifyOtp: jest.fn().mockResolvedValue({ verified: true, verificationToken: "validToken" }),
  },
}));

jest.mock("../app/modules/auth/refresh_session.model", () => ({
  RefreshSession: {
    updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    create: jest.fn().mockResolvedValue({}),
  },
}));

describe("Password Reset Flow", () => {
  const mockEmail = "testuser@example.com";
  
  beforeAll(async () => {
    // Setup in-memory db or mock mongoose methods if necessary
    // Here we will mock since we do not have a real connection in this lightweight suite
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("AuthService.resetPassword", () => {
    it("Reset succeeds with valid OTP + token", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        email: mockEmail,
        password: "oldpassword",
        tokenVersion: 1,
        save: jest.fn().mockResolvedValue(true),
      } as any);

      jest.spyOn(OTPModel, "findOne").mockResolvedValue({
        email: mockEmail,
        isVerified: true,
        verificationToken: "valid-token",
        verificationTokenExpires: new Date(Date.now() + 1000 * 60),
      } as any);

      jest.spyOn(OTPModel, "deleteOne").mockResolvedValue({} as any);

      const res = await AuthService.resetPassword({
        email: mockEmail,
        password: "NewPassword123!",
        confirmPassword: "NewPassword123!",
        verificationToken: "valid-token"
      });

      expect(res.accessToken).toBeDefined();
      expect(res.refreshToken).toBeDefined();
      expect(OTPModel.deleteOne).toHaveBeenCalledWith({ email: mockEmail });
    });

    it("Expired verification token returns 401", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue({ email: mockEmail } as any);
      jest.spyOn(OTPModel, "findOne").mockResolvedValue({
        email: mockEmail,
        isVerified: true,
        verificationToken: "expired-token",
        verificationTokenExpires: new Date(Date.now() - 1000 * 60),
      } as any);

      await expect(
        AuthService.resetPassword({
          email: mockEmail,
          password: "NewPassword123!",
          confirmPassword: "NewPassword123!",
          verificationToken: "expired-token"
        })
      ).rejects.toThrowError(new ApiError(httpStatus.UNAUTHORIZED, "Verification token has expired. Please verify your email again."));
    });

    it("Invalid token returns 401", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue({ email: mockEmail } as any);
      jest.spyOn(OTPModel, "findOne").mockResolvedValue(null as any); // simulate token not found

      await expect(
        AuthService.resetPassword({
          email: mockEmail,
          password: "NewPassword123!",
          confirmPassword: "NewPassword123!",
          verificationToken: "invalid-token"
        })
      ).rejects.toThrowError(new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired verification token. Please verify your email again."));
    });

    it("Weak password rejected", async () => {
      await expect(
        AuthService.resetPassword({
          email: mockEmail,
          password: "weak",
          confirmPassword: "weak",
          verificationToken: "valid-token"
        })
      ).rejects.toThrowError(new ApiError(httpStatus.BAD_REQUEST, "Password must be at least 8 characters long"));
    });
  });
});
