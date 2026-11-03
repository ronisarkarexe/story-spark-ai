import httpStatus from "http-status";
import ApiError from "../../../../errors/api_error";
import { REQUEST_LIMITS } from "../../../../interfaces/ai_model_request_limit";
import { User } from "../../user/user.model";
import { GuestUsage } from "../guest_usage.model";
import {
  effectiveRequestCount,
  FREE_GUEST_LIMIT,
  getFirstDayOfMonth,
  isSuccessfulGeneration,
  refundGuestQuota,
  refundUserQuota,
  reserveGuestQuota,
  reserveUserQuota,
  resolveGuestQuotaIdentity,
  subscriptionLimitExpression,
} from "../quota.service";

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    exists: jest.fn(),
  },
}));

jest.mock("../guest_usage.model", () => ({
  GuestUsage: {
    findOneAndUpdate: jest.fn(),
  },
}));

const mockedUser = User as jest.Mocked<typeof User>;
const mockedGuestUsage = GuestUsage as jest.Mocked<typeof GuestUsage>;

describe("quota.service helpers", () => {
  it("computes effective request count with month rollover", () => {
    const firstDay = getFirstDayOfMonth(new Date(2026, 4, 15));
    const lastMonth = new Date(2026, 3, 20);

    expect(effectiveRequestCount(5, lastMonth, firstDay)).toBe(0);
    expect(effectiveRequestCount(5, new Date(2026, 4, 10), firstDay)).toBe(5);
    expect(effectiveRequestCount(2, null, firstDay)).toBe(0);
  });

  it("treats only non-empty story arrays as successful generation", () => {
    expect(isSuccessfulGeneration([{ title: "A" }])).toBe(true);
    expect(isSuccessfulGeneration([])).toBe(false);
    expect(isSuccessfulGeneration(null)).toBe(false);
    expect(isSuccessfulGeneration(undefined)).toBe(false);
  });

  it("embeds tier limits in subscriptionLimitExpression", () => {
    expect(subscriptionLimitExpression()).toMatchObject({
      $switch: expect.objectContaining({
        default: REQUEST_LIMITS.free,
      }),
    });
  });
});

describe("reserveUserQuota", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws when user does not exist", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue(null);
    mockedUser.exists.mockResolvedValue(null);

    await expect(reserveUserQuota("missing@example.com")).rejects.toMatchObject({
      statusCode: httpStatus.BAD_REQUEST,
    });
    expect(mockedUser.findOne).not.toHaveBeenCalled();
  });

  it("throws conflict when atomic reservation fails", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue(null);
    mockedUser.exists.mockResolvedValue({ _id: "507f1f77bcf86cd799439011" } as never);

    await expect(reserveUserQuota("user@example.com")).rejects.toMatchObject({
      statusCode: httpStatus.CONFLICT,
    });
  });

  it("reserves quota in a single findOneAndUpdate without pre-reading subscription", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue({
      email: "user@example.com",
      requestsThisMonth: 3,
      subscriptionType: "pro",
    });

    await expect(reserveUserQuota("user@example.com")).resolves.toBeUndefined();
    expect(mockedUser.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(mockedUser.findOne).not.toHaveBeenCalled();

    const filter = mockedUser.findOneAndUpdate.mock.calls[0]?.[0] as {
      $expr: { $lt: unknown[] };
    };
    expect(filter.$expr.$lt[1]).toEqual(subscriptionLimitExpression());
  });
});

describe("refundUserQuota", () => {
  it("decrements usage without going negative", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue({
      requestsThisMonth: 0,
    });

    await refundUserQuota("user@example.com");

    expect(mockedUser.findOneAndUpdate).toHaveBeenCalledWith(
      { email: "user@example.com", requestsThisMonth: { $gt: 0 } },
      expect.any(Array)
    );
  });
});

describe("guest quota", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects when guest limit is exceeded", async () => {
    mockedGuestUsage.findOneAndUpdate.mockResolvedValue(null);

    await expect(reserveGuestQuota("guest-1")).rejects.toBeInstanceOf(ApiError);
  });

  it("rejects with 403 Forbidden when findOneAndUpdate throws a duplicate key error", async () => {
    const duplicateKeyError = new Error("Duplicate key");
    (duplicateKeyError as any).code = 11000;
    mockedGuestUsage.findOneAndUpdate.mockRejectedValue(duplicateKeyError);

    await expect(reserveGuestQuota("guest-1")).rejects.toMatchObject({
      statusCode: httpStatus.FORBIDDEN,
      message: "You have reached the maximum limit of 3 story generations.",
    });
  });

  it("refunds guest quota on rollback", async () => {
    mockedGuestUsage.findOneAndUpdate.mockResolvedValue({
      requestCount: 1,
    });

    await refundGuestQuota("guest-1");

    expect(mockedGuestUsage.findOneAndUpdate).toHaveBeenCalledWith(
      { guestId: "guest-1", requestCount: { $gt: 0 } },
      expect.any(Array)
    );
  });
});

describe("concurrency semantics", () => {
  it("uses conditional findOneAndUpdate with tier limit from document", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue({ requestsThisMonth: 7 });

    await reserveUserQuota("user@example.com");

    const updateCall = mockedUser.findOneAndUpdate.mock.calls[0];
    expect(updateCall[0]).toHaveProperty("$expr");
    expect(Array.isArray(updateCall[1])).toBe(true);
  });
});


describe("resolveGuestQuotaIdentity", () => {
  it("binds quota to IP even when the userId cookie is missing", () => {
    const req = {
      headers: { "x-forwarded-for": "203.0.113.50" },
      cookies: {},
      ip: "203.0.113.50",
    } as any;
    const cookie = jest.fn();
    const res = { cookie } as any;

    const identity = resolveGuestQuotaIdentity(req, res);
    expect(identity.quotaKey).toBe("ip:203.0.113.50");
    expect(identity.cookieUserId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(cookie).toHaveBeenCalled();
  });

  it("fails closed when client IP cannot be determined", () => {
    const req = { headers: {}, cookies: {}, ip: "", socket: {} } as any;
    const res = { cookie: jest.fn() } as any;
    expect(() => resolveGuestQuotaIdentity(req, res)).toThrow(ApiError);
  });

  it("keeps the same IP quota key after cookie clear / new UUID", () => {
    const req = {
      headers: {},
      cookies: {},
      ip: "198.51.100.9",
    } as any;
    const res = { cookie: jest.fn() } as any;
    const first = resolveGuestQuotaIdentity(req, res);
    const second = resolveGuestQuotaIdentity(
      { ...req, cookies: {} } as any,
      { cookie: jest.fn() } as any
    );
    expect(first.quotaKey).toBe(second.quotaKey);
    expect(first.cookieUserId).not.toBe(second.cookieUserId);
  });
});
