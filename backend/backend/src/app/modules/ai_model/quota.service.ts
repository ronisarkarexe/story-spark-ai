import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { REQUEST_LIMITS } from "../../../interfaces/ai_model_request_limit";
import { User } from "../user/user.model";
import { GuestUsage } from "./guest_usage.model";

export const FREE_GUEST_LIMIT = 3;

export const getFirstDayOfMonth = (referenceDate: Date = new Date()): Date =>
  new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);

export const effectiveRequestCount = (
  requestsThisMonth: number,
  lastRequestDate: Date | null | undefined,
  firstDayOfMonth: Date
): number => {
  if (!lastRequestDate || lastRequestDate < firstDayOfMonth) {
    return 0;
  }
  return requestsThisMonth;
};

/** MongoDB expression: effective monthly usage (handles month rollover). */
export const effectiveCountExpression = (firstDayOfMonth: Date) => ({
  $cond: {
    if: {
      $or: [
        { $eq: [{ $ifNull: ["$lastRequestDate", null] }, null] },
        { $lt: ["$lastRequestDate", firstDayOfMonth] },
      ],
    },
    then: 0,
    else: "$requestsThisMonth",
  },
});

/** MongoDB expression: tier limit read from the same document in one atomic update. */
export const subscriptionLimitExpression = () => ({
  $switch: {
    branches: [
      {
        case: { $eq: ["$subscriptionType", "pro"] },
        then: REQUEST_LIMITS.pro,
      },
      {
        case: { $eq: ["$subscriptionType", "premium"] },
        then: REQUEST_LIMITS.premium,
      },
    ],
    default: REQUEST_LIMITS.free,
  },
});

/**
 * Atomically reserves one monthly request slot.
 * Tier limit and usage count are evaluated from the document in a single findOneAndUpdate.
 */
export const reserveUserQuota = async (email: string): Promise<void> => {
  const firstDayOfMonth = getFirstDayOfMonth();
  const now = new Date();
  const effectiveCount = effectiveCountExpression(firstDayOfMonth);

  const reserved = await User.findOneAndUpdate(
    {
      email,
      $expr: {
        $lt: [effectiveCount, subscriptionLimitExpression()],
      },
    },
    [
      {
        $set: {
          requestsThisMonth: { $add: [effectiveCount, 1] },
          lastRequestDate: now,
        },
      },
    ],
    { new: true }
  );

  if (!reserved) {
    const userExists = await User.exists({ email });
    if (!userExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
    }
    throw new ApiError(
      httpStatus.CONFLICT,
      "Monthly request limit exceeded!"
    );
  }
};

/**
 * Refunds a previously reserved slot (idempotent when paired with QuotaRefundGuard).
 */
export const refundUserQuota = async (email: string): Promise<void> => {
  await User.findOneAndUpdate(
    { email, requestsThisMonth: { $gt: 0 } },
    [
      {
        $set: {
          requestsThisMonth: {
            $max: [0, { $subtract: ["$requestsThisMonth", 1] }],
          },
        },
      },
    ]
  );
};

/**
 * Atomically reserves one guest free-generation slot (persisted in MongoDB).
 */
export const reserveGuestQuota = async (guestId: string): Promise<void> => {
  const reserved = await GuestUsage.findOneAndUpdate(
    { guestId, requestCount: { $lt: FREE_GUEST_LIMIT } },
    {
      $inc: { requestCount: 1 },
      $set: { lastRequestAt: new Date() },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (!reserved) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You have reached the maximum limit of 3 story generations."
    );
  }
};

export const refundGuestQuota = async (guestId: string): Promise<void> => {
  await GuestUsage.findOneAndUpdate(
    { guestId, requestCount: { $gt: 0 } },
    [
      {
        $set: {
          requestCount: {
            $max: [0, { $subtract: ["$requestCount", 1] }],
          },
        },
      },
    ]
  );
};

export const isSuccessfulGeneration = (
  result: unknown
): result is unknown[] => Array.isArray(result) && result.length > 0;
