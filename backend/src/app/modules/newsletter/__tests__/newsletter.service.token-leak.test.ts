jest.mock("../../../../utils/email.util", () => ({
  sendVerificationEmail: jest.fn(),
}));

const SECRET_FIELDS = ["unsubscribeToken", "verificationToken", "verificationTokenExpires"];

// Minimal Mongoose-like document: toObject returns a shallow copy of fields.
function doc(fields: Record<string, any>): any {
  return {
    ...fields,
    toObject() {
      return { ...fields };
    },
    save: jest.fn(),
  };
}

const findOneMock = jest.fn();
const createMock = jest.fn();

jest.mock("../newsletter.model", () => ({
  __esModule: true,
  NewsletterSubscriber: { findOne: findOneMock, create: createMock },
}));

import { subscribeNewsletter, verifyNewsletter } from "../newsletter.service";

function assertNoSecretFields(subscriber: any, label: string) {
  for (const f of SECRET_FIELDS) {
    expect(subscriber).not.toHaveProperty(f, expect.any(String));
    // Stronger: field must be absent entirely, not just undefined.
    expect(f in (subscriber || {})).toBe(false);
  }
  // sanity: the public fields are still present
  expect(subscriber).toHaveProperty("email");
  expect(label).toBeTruthy(); // keep label referenced
}

describe("newsletter.service token leak (#6535)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not leak secret tokens for an already-active subscriber", async () => {
    findOneMock.mockResolvedValue(
      doc({
        email: "a@x.com",
        status: "active",
        unsubscribeToken: "SECRET-UNSUB",
        verificationToken: "SECRET-VERIFY",
        verificationTokenExpires: new Date(),
      })
    );

    const result: any = await subscribeNewsletter("a@x.com", "A", "web", undefined, "https://api.x");
    expect(result.message).toBe("Already subscribed");
    expect(result.subscriber).toBeTruthy();
    assertNoSecretFields(result.subscriber, "active");
  });

  it("does not leak secret tokens for a resubscribed (unsubscribed) subscriber", async () => {
    const existing = doc({
      email: "b@x.com",
      status: "unsubscribed",
      unsubscribeToken: "SECRET-UNSUB",
      verificationToken: "SECRET-VERIFY",
      verificationTokenExpires: new Date(),
    });
    findOneMock.mockResolvedValue(existing);

    const result: any = await subscribeNewsletter("b@x.com", undefined, undefined, undefined, "https://api.x");
    expect(result.message).toContain("Re-subscribed");
    assertNoSecretFields(result.subscriber, "resubscribe");
  });

  it("does not leak secret tokens for a brand-new subscriber", async () => {
    findOneMock.mockResolvedValue(null);
    createMock.mockResolvedValue(
      doc({
        email: "c@x.com",
        status: "pending",
        isVerified: false,
        verificationToken: "SECRET-VERIFY",
        verificationTokenExpires: new Date(),
        unsubscribeToken: "SECRET-UNSUB",
      })
    );

    const result: any = await subscribeNewsletter("c@x.com", "C", "web", undefined, "https://api.x");
    expect(result.message).toContain("Subscribed");
    assertNoSecretFields(result.subscriber, "new");
  });

  it("does not leak secret tokens in the verify response", async () => {
    const subscriber = doc({
      email: "d@x.com",
      status: "pending",
      isVerified: false,
      verificationToken: "tok",
      verificationTokenExpires: new Date(Date.now() + 60000),
      unsubscribeToken: "SECRET-UNSUB",
    });
    findOneMock.mockResolvedValue(subscriber);

    const result: any = await verifyNewsletter("tok");
    expect(result.message).toContain("verified");
    assertNoSecretFields(result.subscriber, "verify");
  });
});
