import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { enforceQuota } from "../app/middleware/enforceQuota.middleware";
import { UsageRecord } from "../app/modules/ai_model/usageRecord.model";

// Mock the UsageRecord model
jest.mock("../app/modules/ai_model/usageRecord.model", () => ({
  UsageRecord: {
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

// Mock the quota config limits so the test doesn't depend on actual configuration changes
jest.mock("../config/quota.config", () => ({
  PLAN_QUOTAS: {
    free: { story_generate: 5, story_continue: 3 },
    pro: { story_generate: 50, story_continue: 30 },
    premium: { story_generate: Infinity, story_continue: Infinity },
  },
}));

describe("enforceQuota Middleware Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    
    req = {
      user: {
        _id: "user-123",
        email: "test@example.com",
        subscriptionType: "free",
      },
    } as any;

    res = {
      status: statusMock,
      json: jsonMock,
      locals: {},
    } as any;

    next = jest.fn();
  });

  it("should allow request and increment count when user is under limit", async () => {
    // Mock UsageRecord.findOneAndUpdate to return count = 3 (limit is 5)
    (UsageRecord.findOneAndUpdate as jest.Mock).mockResolvedValue({
      count: 3,
    });

    const middleware = enforceQuota("story_generate");
    await middleware(req as Request, res as Response, next);

    expect(UsageRecord.findOneAndUpdate).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
    expect(res.locals?.quotaRefundGuard).toBeDefined();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it("should block request and rollback increment when user exceeds limit", async () => {
    // Mock UsageRecord.findOneAndUpdate to return count = 6 (limit is 5)
    (UsageRecord.findOneAndUpdate as jest.Mock).mockResolvedValue({
      count: 6,
    });
    // Mock rollback updateOne
    (UsageRecord.updateOne as jest.Mock).mockResolvedValue({});

    const middleware = enforceQuota("story_generate");
    await middleware(req as Request, res as Response, next);

    expect(UsageRecord.findOneAndUpdate).toHaveBeenCalled();
    expect(UsageRecord.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-123", action: "story_generate" }),
      { $inc: { count: -1 } }
    );
    expect(statusMock).toHaveBeenCalledWith(httpStatus.TOO_MANY_REQUESTS);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "QUOTA_EXCEEDED",
        plan: "free",
        limit: 5,
        used: 5,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should skip limit enforcement entirely if limit is Infinity (e.g. premium)", async () => {
    req.user.subscriptionType = "premium";

    const middleware = enforceQuota("story_generate");
    await middleware(req as Request, res as Response, next);

    expect(UsageRecord.findOneAndUpdate).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it("should block requests with 401 if req.user is missing", async () => {
    delete req.user;

    const middleware = enforceQuota("story_generate");
    await middleware(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
