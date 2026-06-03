import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { refundGuestQuota, refundUserQuota } from "./quota.service";

/**
 * Ensures quota is refunded at most once per request (controller finally + service paths).
 */
export class QuotaRefundGuard {
  private refunded = false;

  constructor(private readonly refund: () => Promise<void>) {}

  async refundOnce(): Promise<void> {
    if (this.refunded) {
      return;
    }
    this.refunded = true;
    await this.refund();
  }

  get hasRefunded(): boolean {
    return this.refunded;
  }
}

export const createUserQuotaGuard = (email: string): QuotaRefundGuard =>
  new QuotaRefundGuard(() => refundUserQuota(email));

export const createGuestQuotaGuard = (guestId: string): QuotaRefundGuard =>
  new QuotaRefundGuard(() => refundGuestQuota(guestId));

/**
 * Runs an operation and refunds reserved quota in `finally` when it does not complete successfully.
 */

export const runWithQuotaCleanup = async <T>(
    guard: QuotaRefundGuard,
    operation: () => Promise<T>
): Promise<T> => {
    try {
        return await operation();
    } catch (error) {
        await guard.refundOnce();
        throw error;
    }
};


export const assertSuccessfulGeneration = (
  result: unknown,
  message: string
): void => {
  if (!Array.isArray(result) || result.length === 0) {
    throw new ApiError(httpStatus.BAD_GATEWAY, message);
  }
};
