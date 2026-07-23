import express from "express";
import request from "supertest";

jest.mock("../app/modules/auth/auth.service", () => ({
  AuthService: {
    resendVerificationEmail: jest.fn(),
  },
}));

jest.mock("../app/middleware/ip.rate-limiter", () => ({
  loginRateLimiter: (_req: any, _res: any, next: any) => next(),
  forgotPasswordRateLimiter: (_req: any, _res: any, next: any) => next(),
  resetPasswordRateLimiter: (_req: any, _res: any, next: any) => next(),
  refreshTokenRateLimiter: (_req: any, _res: any, next: any) => next(),
  ipRateLimiter: (_req: any, _res: any, next: any) => next(),
  resendVerificationEmailRateLimiter: (
    _req: any,
    _res: any,
    next: any
  ) => next(),
  verifyEmailChangeRateLimiter: (_req: any, _res: any, next: any) => next(),
  changePasswordRateLimiter: (_req: any, _res: any, next: any) => next(),
}));

import { AuthRouter } from "../app/modules/auth/auth.router";
import { AuthService } from "../app/modules/auth/auth.service";

const app = express();

app.use(express.json());
app.use("/api/v1/auth", AuthRouter);

describe("POST /api/v1/auth/verify-email/resend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resends a verification email for a valid request", async () => {
    (
      AuthService.resendVerificationEmail as jest.Mock
    ).mockResolvedValue({
      expiresAt: new Date("2026-07-23T12:00:00.000Z"),
    });

    const response = await request(app)
      .post("/api/v1/auth/verify-email/resend")
      .send({
        email: "user@example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Verification email resent successfully!"
    );

    expect(AuthService.resendVerificationEmail).toHaveBeenCalledWith(
      "user@example.com"
    );
  });

  it("rejects an invalid email before calling the service", async () => {
    const response = await request(app)
      .post("/api/v1/auth/verify-email/resend")
      .send({
        email: "not-an-email",
      });

    expect(response.status).toBeGreaterThanOrEqual(400);

    expect(
      AuthService.resendVerificationEmail
    ).not.toHaveBeenCalled();
  });

  it("rejects a request with no email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/verify-email/resend")
      .send({});

    expect(response.status).toBeGreaterThanOrEqual(400);

    expect(
      AuthService.resendVerificationEmail
    ).not.toHaveBeenCalled();
  });
});