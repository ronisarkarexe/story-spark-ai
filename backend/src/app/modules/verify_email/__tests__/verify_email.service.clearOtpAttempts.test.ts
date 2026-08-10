jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn() })),
}));

jest.mock("../../../../config", () => ({
  __esModule: true,
  default: { verify_email: "e", verify_password: "p" },
}));

jest.mock("../../../../utils/email.util", () => ({ escapeHtml: (s: string) => s }));

const clearOtpAttemptsMock = jest.fn();
jest.mock("../otp.rate-limiter.middleware", () => ({
  __esModule: true,
  clearOtpAttempts: clearOtpAttemptsMock,
}));

const otpDocMock: any = {
  email: "user@example.com",
  otp: "123456",
  failedAttempts: 0,
  isVerified: false,
  expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  save: jest.fn(),
};

jest.mock("../otp.model", () => ({
  __esModule: true,
  OTPModel: { findOne: jest.fn(), deleteOne: jest.fn() },
}));

import { OTPModel } from "../otp.model";
import { VerifyEmailService } from "../verify_email.service";

describe("verify_email.service OTP success clears rate-limit (#6534)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    otpDocMock.failedAttempts = 0;
    otpDocMock.isVerified = false;
    otpDocMock.save.mockResolvedValue(otpDocMock);
    (OTPModel.findOne as jest.Mock).mockResolvedValue(otpDocMock);
  });

  it("calls the real clearOtpAttempts (from the middleware) on successful verify", async () => {
    const res = await VerifyEmailService.VerifyOtp({
      email: "user@example.com",
      otp: "123456",
    } as any);

    expect(res.verified).toBe(true);
    expect(clearOtpAttemptsMock).toHaveBeenCalledTimes(1);
    expect(clearOtpAttemptsMock).toHaveBeenCalledWith("user@example.com");
  });

  it("does NOT clear rate-limit attempts on a failed (wrong-OTP) verify", async () => {
    await expect(
      VerifyEmailService.VerifyOtp({
        email: "user@example.com",
        otp: "000000",
      } as any)
    ).rejects.toBeDefined();

    expect(clearOtpAttemptsMock).not.toHaveBeenCalled();
  });
});
