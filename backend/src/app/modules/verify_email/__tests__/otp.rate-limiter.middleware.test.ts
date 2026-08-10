import { otpRateLimiter, clearOtpAttempts } from "../otp.rate-limiter.middleware";

function buildReq(email: string) {
  return { body: { email } } as any;
}

function runMiddleware(email: string): { nextOk: boolean } {
  let nextOk = true;
  otpRateLimiter(
    buildReq(email),
    {} as any,
    (err?: unknown) => {
      if (err) nextOk = false;
    }
  );
  return { nextOk };
}

describe("otp.rate-limiter.middleware (#6534)", () => {
  it("clearOtpAttempts actually clears the store so successes do not accumulate", () => {
    const email = "user@example.com";
    // Burn 4 attempts (all allowed), clearing after each to simulate successful verifies.
    for (let i = 0; i < 10; i += 1) {
      const { nextOk } = runMiddleware(email);
      expect(nextOk).toBe(true); // never blocked because we clear on success
      clearOtpAttempts(email);
    }
  });

  it("without clearOtpAttempts, repeated attempts eventually get blocked (sanity)", () => {
    const email = "blocked@example.com";
    let blockedAtLeastOnce = false;
    for (let i = 0; i < 9; i += 1) {
      const { nextOk } = runMiddleware(email);
      if (!nextOk) blockedAtLeastOnce = true;
    }
    expect(blockedAtLeastOnce).toBe(true);
    clearOtpAttempts(email);
  });

  it("clearOtpAttempts is idempotent for unknown emails", () => {
    expect(() => clearOtpAttempts("never-seen@example.com")).not.toThrow();
  });
});
