import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { REQUEST_LIMITS } from "../../../../interfaces/ai_model_request_limit";
import { User } from "../../user/user.model";
import { GuestUsage } from "../guest_usage.model";
import {
  FREE_GUEST_LIMIT,
  reserveGuestQuota,
  reserveUserQuota,
} from "../quota.service";
import { ENUM_USER_ROLE } from "../../../../enums/user";
import { SUBSCRIPTION_TYPE } from "../../../../enums/subscription_type";
import { USER_STATUS } from "../../../../enums/user_status";

describe("quota integration (mongodb-memory-server)", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await GuestUsage.deleteMany({});
  });

  const createUser = async (
    email: string,
    subscriptionType: string,
    requestsThisMonth: number
  ) =>
    User.create({
      email,
      subscriptionType,
      requestsThisMonth,
      lastRequestDate: new Date(),
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

  it("allows exactly one parallel reserve at the free-tier boundary", async () => {
    const email = "boundary-free@test.com";
    await createUser(
      email,
      SUBSCRIPTION_TYPE.FREE,
      REQUEST_LIMITS.free - 1
    );

    const attempts = 8;
    const results = await Promise.allSettled(
      Array.from({ length: attempts }, () => reserveUserQuota(email))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    expect(succeeded).toBe(1);
    expect(failed).toBe(attempts - 1);

    const user = await User.findOne({ email });
    expect(user?.requestsThisMonth).toBe(REQUEST_LIMITS.free);
  });

  it("never exceeds pro tier limit under parallel load", async () => {
    const email = "boundary-pro@test.com";
    await createUser(
      email,
      SUBSCRIPTION_TYPE.PRO,
      REQUEST_LIMITS.pro - 1
    );

    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () => reserveUserQuota(email))
    );

    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);

    const user = await User.findOne({ email });
    expect(user?.requestsThisMonth).toBeLessThanOrEqual(REQUEST_LIMITS.pro);
    expect(user?.requestsThisMonth).toBe(REQUEST_LIMITS.pro);
  });

  it("uses subscription tier from DB atomically when upgrading effective limit", async () => {
    const email = "tier@test.com";
    await createUser(email, SUBSCRIPTION_TYPE.PREMIUM, 0);

    await reserveUserQuota(email);

    const user = await User.findOne({ email });
    expect(user?.requestsThisMonth).toBe(1);
    expect(user?.subscriptionType).toBe(SUBSCRIPTION_TYPE.PREMIUM);
  });

  it("caps guest reserves at FREE_GUEST_LIMIT under parallel load", async () => {
    const guestId = "guest-boundary";
    await GuestUsage.create({ guestId, requestCount: 0 });

    const results = await Promise.allSettled(
      Array.from({ length: 8 }, () => reserveGuestQuota(guestId))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    expect(succeeded).toBe(FREE_GUEST_LIMIT);

    const usage = await GuestUsage.findOne({ guestId });
    expect(usage?.requestCount).toBe(FREE_GUEST_LIMIT);
  });
});
