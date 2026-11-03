import httpStatus from "http-status";
import ApiError from "../errors/api_error";
import { User } from "../app/modules/user/user.model";
import { OTPModel } from "../app/modules/verify_email/otp.model";
import { VerifyEmailService } from "../app/modules/verify_email/verify_email.service";
import { AuthService } from "../app/modules/auth/auth.service";

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../app/modules/verify_email/otp.model", () => ({
  OTPModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("../app/modules/verify_email/verify_email.service", () => ({
  VerifyEmailService: {
    VerifyEmail: jest.fn(),
  },
}));

describe("AuthService.resendVerificationEmail", () => {
  const mockedUserFindOne = User.findOne as jest.Mock;
  const mockedOtpFindOne = OTPModel.findOne as jest.Mock;
  const mockedVerifyEmail = VerifyEmailService.VerifyEmail as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resends verification email for a pending unverified email", async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedOtpFindOne.mockResolvedValue({
      email: "user@example.com",
      isVerified: false,
    });

    const expectedResult = {
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    mockedVerifyEmail.mockResolvedValue(expectedResult);

    const result = await AuthService.resendVerificationEmail(
      "  USER@example.com  ",
    );

    expect(mockedUserFindOne).toHaveBeenCalledWith({
      email: "user@example.com",
    });

    expect(mockedOtpFindOne).toHaveBeenCalledWith({
      email: "user@example.com",
    });

    expect(mockedVerifyEmail).toHaveBeenCalledWith({
      email: "user@example.com",
      name: "User",
    });

    expect(result).toEqual(expectedResult);
  });

  it("rejects resend when an account already exists", async () => {
    mockedUserFindOne.mockResolvedValue({
      email: "user@example.com",
    });

    await expect(
      AuthService.resendVerificationEmail("user@example.com"),
    ).rejects.toMatchObject({
      status: httpStatus.CONFLICT,
      message: "An account with this email already exists.",
    });

    expect(mockedOtpFindOne).not.toHaveBeenCalled();
    expect(mockedVerifyEmail).not.toHaveBeenCalled();
  });

  it("creates a fresh verification email when the previous OTP no longer exists", async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedOtpFindOne.mockResolvedValue(null);

    const expectedResult = {
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    mockedVerifyEmail.mockResolvedValue(expectedResult);

    const result =
      await AuthService.resendVerificationEmail("user@example.com");

    expect(mockedVerifyEmail).toHaveBeenCalledWith({
      email: "user@example.com",
      name: "User",
    });

    expect(result).toEqual(expectedResult);
  });

  it("rejects resend when the email has already been verified", async () => {
    mockedUserFindOne.mockResolvedValue(null);
    mockedOtpFindOne.mockResolvedValue({
      email: "user@example.com",
      isVerified: true,
    });

    await expect(
      AuthService.resendVerificationEmail("user@example.com"),
    ).rejects.toMatchObject({
      status: httpStatus.CONFLICT,
      message:
        "Email has already been verified. Please continue with registration.",
    });

    expect(mockedVerifyEmail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email value", async () => {
    await expect(
      AuthService.resendVerificationEmail(undefined),
    ).rejects.toBeInstanceOf(ApiError);

    expect(mockedUserFindOne).not.toHaveBeenCalled();
    expect(mockedOtpFindOne).not.toHaveBeenCalled();
    expect(mockedVerifyEmail).not.toHaveBeenCalled();
  });
});
