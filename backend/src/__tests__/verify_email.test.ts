import { VerifyEmailService } from "../app/modules/verify_email/verify_email.service";
import { OTPModel } from "../app/modules/verify_email/otp.model";
import nodemailer from "nodemailer";
import ApiError from "../errors/api_error";
import httpStatus from "http-status";

// Shared nodemailer sendMail mock to persist call tracking
const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-id" });
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: (...args: any[]) => mockSendMail(...args),
  })),
}));

jest.mock("../config", () => ({
  verify_email: "test@example.com",
  verify_password: "testpassword",
}));

const mockDeleteOne = jest.fn();
const mockCreate = jest.fn();
const mockFindOne = jest.fn();

jest.mock("../app/modules/verify_email/otp.model", () => ({
  OTPModel: {
    deleteOne: (...args: any[]) => mockDeleteOne(...args),
    create: (...args: any[]) => mockCreate(...args),
    findOne: (...args: any[]) => mockFindOne(...args),
  },
}));

describe("VerifyEmailService.VerifyEmail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate OTP and send email when config is set", async () => {
    const result = await VerifyEmailService.VerifyEmail({ email: "user@example.com", name: "User" });

    // OTP should be stored via OTPModel.create
    expect(mockCreate).toHaveBeenCalled();
    // Email should be sent via nodemailer
    expect(mockSendMail).toHaveBeenCalled();
    expect(result).toHaveProperty("expiresAt");
  });
});

describe("VerifyEmailService.VerifyOtp", () => {
  const mockOtpRecord = {
    email: "user@example.com",
    otp: "123456",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    failedAttempts: 0,
    isVerified: false,
    save: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock findOne to return a copy of mockOtpRecord
    mockFindOne.mockResolvedValue({
      ...mockOtpRecord,
      save: jest.fn().mockResolvedValue(undefined),
    });
  });

  it("should verify a correct OTP", async () => {
    const response = await VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "123456" });
    expect(response).toMatchObject({ verified: true });
    const savedRecord = await mockFindOne.mock.results[0].value;
    expect(savedRecord.save).toHaveBeenCalled();
  });

  it("should reject an invalid OTP with proper error", async () => {
    await expect(
      VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "000000" })
    ).rejects.toThrow(ApiError);
    // ensure failed attempts incremented
    const savedRecord = await mockFindOne.mock.results[0].value;
    expect(savedRecord.failedAttempts).toBe(mockOtpRecord.failedAttempts + 1);
  });

  it("should handle expired OTP", async () => {
    const expiredRecord = { ...mockOtpRecord, expiresAt: new Date(Date.now() - 1000) };
    mockFindOne.mockResolvedValue(expiredRecord);
    await expect(
      VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "123456" })
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_REQUEST, message: "OTP expired. Please request a new one." });
  });

  it("should enforce max failed attempts", async () => {
    const limitRecord = { ...mockOtpRecord, failedAttempts: 5 };
    mockFindOne.mockResolvedValue(limitRecord);
    await expect(
      VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "123456" })
    ).rejects.toMatchObject({ statusCode: httpStatus.TOO_MANY_REQUESTS });
  });
});
