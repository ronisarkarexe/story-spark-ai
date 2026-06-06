import { refundUserQuota } from "../quota.service";
import {
  createUserQuotaGuard,
  runWithQuotaCleanup,
} from "../quota.lifecycle";

jest.mock("../quota.service", () => ({
  ...jest.requireActual("../quota.service"),
  refundUserQuota: jest.fn(),
}));

const mockedRefund = refundUserQuota as jest.MockedFunction<typeof refundUserQuota>;

describe("QuotaRefundGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRefund.mockResolvedValue(undefined);
  });

  it("refunds at most once when refundOnce is called multiple times", async () => {
    const guard = createUserQuotaGuard("user@example.com");
    await guard.refundOnce();
    await guard.refundOnce();

    expect(mockedRefund).toHaveBeenCalledTimes(1);
  });
});

describe("runWithQuotaCleanup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRefund.mockResolvedValue(undefined);
  });

  it("does not refund when operation succeeds", async () => {
    const guard = createUserQuotaGuard("user@example.com");

    const result = await runWithQuotaCleanup(guard, async () => "ok");

    expect(result).toBe("ok");
    expect(mockedRefund).not.toHaveBeenCalled();
  });

  it("refunds once when operation throws", async () => {
    const guard = createUserQuotaGuard("user@example.com");

    await expect(
      runWithQuotaCleanup(guard, async () => {
        throw new Error("token failure");
      })
    ).rejects.toThrow("token failure");

    expect(mockedRefund).toHaveBeenCalledTimes(1);
  });
});
