import express from "express";
import request from "supertest";

jest.mock("../app/middleware/auth.middleware", () => ({
  __esModule: true,
  default:
    () =>
    (_req: any, _res: any, next: any) =>
      next(),
}));

jest.mock("../app/modules/usage/usage.service", () => ({
  UsageService: {
    getMyUsage: jest.fn(),
  },
}));

jest.mock("../app/middleware/token", () => ({
  getToken: jest.fn().mockResolvedValue({
    email: "test@example.com",
  }),
}));

import { UsageRouter } from "../app/modules/usage/usage.router";
import { UsageService } from "../app/modules/usage/usage.service";

const app = express();

app.use(express.json());
app.use("/api/v1/usage", UsageRouter);

describe("UsageRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load successfully", () => {
    expect(UsageRouter).toBeDefined();
  });

  it("should return usage data", async () => {
    (UsageService.getMyUsage as jest.Mock).mockResolvedValue({
      plan: "pro",
      billingPeriodStart: "2026-06-01T00:00:00.000Z",
      billingPeriodEnd: "2026-06-30T23:59:59.999Z",
      actions: {
        story_generate: {
          used: 12,
          limit: 50,
          remaining: 38,
        },
      },
    });

    const response = await request(app).get("/api/v1/usage/me");

   expect(response.status).toBe(200);

expect(response.body.success).toBe(true);

expect(response.body).toHaveProperty("message");

expect(response.body.data).toHaveProperty("actions");

expect(response.body.data.actions).toHaveProperty("story_generate");

expect(response.body.data.plan).toBe("pro");

expect(response.body.data).toHaveProperty("billingPeriodStart");

expect(response.body.data).toHaveProperty("billingPeriodEnd");

expect(response.body.data.actions.story_generate.used).toBe(12);

expect(response.body.data.actions.story_generate.limit).toBe(50);

    
  
});
});