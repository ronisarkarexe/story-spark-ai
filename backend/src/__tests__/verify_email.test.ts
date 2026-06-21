import { VerifyEmailService } from "../app/modules/verify_email/verify_email.service";
import { OTPModel } from "../app/modules/verify_email/otp.model";
import nodemailer from "nodemailer";
import ApiError from "../errors/api_error";
import httpStatus from "http-status";

jest.mock("../config", () => ({
  verify_email: "test@example.com",
  verify_password: "testpassword",
}));

jest.mock("nodemailer", () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: "test-id" });
  return {
    createTransport: jest.fn(() => ({
      sendMail,
    })),
  };
});

jest.mock("../app/modules/verify_email/otp.model", () => {
  const mockDeleteOne = jest.fn();
  const mockCreate = jest.fn();
  const mockFindOne = jest.fn();

  return {
    OTPModel: {
      deleteOne: mockDeleteOne,
      create: mockCreate,
      findOne: mockFindOne,
    },
  };
});

describe("VerifyEmailService.VerifyEmail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate OTP and send email when config is set", async () => {
    const result = await VerifyEmailService.VerifyEmail({ email: "user@example.com", name: "User" });

    // OTP should be stored via OTPModel.create
    expect(require("../app/modules/verify_email/otp.model").OTPModel.create).toHaveBeenCalled();
    // Email should be sent via nodemailer
    const mockSendMail = nodemailer.createTransport().sendMail;
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

  let activeOtpRecord: any;

  beforeEach(() => {
    jest.clearAllMocks();
    activeOtpRecord = {
      ...mockOtpRecord,
      save: jest.fn().mockImplementation(function (this: any) {
        return Promise.resolve(this);
      }),
    };
    require("../app/modules/verify_email/otp.model").OTPModel.findOne.mockResolvedValue(activeOtpRecord);
  });

  it("should verify a correct OTP", async () => {
    const response = await VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "123456" });
    expect(response).toMatchObject({ verified: true });
    expect(activeOtpRecord.save).toHaveBeenCalled();
  });

  it("should reject an invalid OTP with proper error", async () => {
    await expect(
      VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "000000" })
    ).rejects.toThrow(ApiError);
    // ensure failed attempts incremented
    expect(activeOtpRecord.failedAttempts).toBe(mockOtpRecord.failedAttempts + 1);
  });

  it("should handle expired OTP", async () => {
    const expiredRecord = {
      ...mockOtpRecord,
      expiresAt: new Date(Date.now() - 1000),
      save: jest.fn().mockResolvedValue(undefined),
    };
    require("../app/modules/verify_email/otp.model").OTPModel.findOne.mockResolvedValue(expiredRecord);
    await expect(
      VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "123456" })
    ).rejects.toMatchObject({ statusCode: httpStatus.BAD_REQUEST, message: "OTP expired. Please request a new one." });
  });

  it("should enforce max failed attempts", async () => {
    const limitRecord = {
      ...mockOtpRecord,
      failedAttempts: 5,
      save: jest.fn().mockResolvedValue(undefined),
    };
    require("../app/modules/verify_email/otp.model").OTPModel.findOne.mockResolvedValue(limitRecord);
    await expect(
      VerifyEmailService.VerifyOtp({ email: "user@example.com", otp: "123456" })
    ).rejects.toMatchObject({ statusCode: httpStatus.TOO_MANY_REQUESTS });
  });
});
