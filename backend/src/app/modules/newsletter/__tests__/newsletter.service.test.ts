/**
 * newsletter.service.test.ts
 * Unit tests for newsletter service functions
 */
import { Types } from "mongoose";
import { subscribeNewsletter, verifyNewsletter, unsubscribeByToken } from "../newsletter.service";
import { NewsletterSubscriber } from "../newsletter.model";

jest.mock("../newsletter.model", () => ({
  NewsletterSubscriber: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../../../utils/email.util", () => ({
  sendVerificationEmail: jest.fn(),
}));

const MockedSubscriber = NewsletterSubscriber as unknown as {
  findOne: jest.Mock;
  create: jest.Mock;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("subscribeNewsletter", () => {
  it("creates a new subscriber and sends verification email for new email", async () => {
    const newSubscriber = {
      _id: new Types.ObjectId(),
      email: "new@example.com",
      name: "New User",
      status: "pending",
      verificationToken: "abc123",
    };
    MockedSubscriber.findOne.mockResolvedValue(null);
    MockedSubscriber.create.mockResolvedValue(newSubscriber);

    const result = await subscribeNewsletter("new@example.com", "New User", "website");

    expect(result.message).toBe("Subscribed! Please verify your email.");
    expect(MockedSubscriber.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@example.com", name: "New User" })
    );
  });

  it("returns already subscribed message for active subscriber", async () => {
    const existingSubscriber = {
      email: "existing@example.com",
      status: "active",
    };
    MockedSubscriber.findOne.mockResolvedValue(existingSubscriber);

    const result = await subscribeNewsletter("existing@example.com");

    expect(result.message).toBe("Already subscribed");
    expect(MockedSubscriber.create).not.toHaveBeenCalled();
  });

  it("re-sends verification for unsubscribed email", async () => {
    const unsubscribedSubscriber = {
      email: "old@example.com",
      status: "unsubscribed",
      verificationToken: "old-token",
      unsubscribeToken: "unsub-token",
      save: jest.fn(),
    };
    MockedSubscriber.findOne.mockResolvedValue(unsubscribedSubscriber);

    const result = await subscribeNewsletter("old@example.com");

    expect(result.message).toBe("Re-subscribed. Please verify your email.");
    expect(unsubscribedSubscriber.save).toHaveBeenCalled();
  });
});

describe("verifyNewsletter", () => {
  it("verifies a valid token and activates subscriber", async () => {
    const subscriber = {
      status: "pending",
      isVerified: false,
      verificationToken: "valid-token",
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      subscribedAt: undefined,
      save: jest.fn(),
    };
    MockedSubscriber.findOne.mockResolvedValue(subscriber);

    const result = await verifyNewsletter("valid-token");

    expect(result.message).toBe("Email verified successfully.");
    expect(subscriber.isVerified).toBe(true);
    expect(subscriber.status).toBe("active");
    expect(subscriber.save).toHaveBeenCalled();
  });

  it("throws error for expired token", async () => {
    MockedSubscriber.findOne.mockResolvedValue(null);

    await expect(verifyNewsletter("expired-token")).rejects.toThrow(
      "Invalid or expired verification token."
    );
  });

  it("throws error for invalid token", async () => {
    MockedSubscriber.findOne.mockResolvedValue(null);

    await expect(verifyNewsletter("invalid-token")).rejects.toThrow(
      "Invalid or expired verification token."
    );
  });
});

describe("unsubscribeByToken", () => {
  it("unsubscribes a valid token and returns success message", async () => {
    const subscriber = {
      status: "active",
      unsubscribeToken: "valid-unsub",
      unsubscribedAt: undefined,
      save: jest.fn(),
    };
    MockedSubscriber.findOne.mockResolvedValue(subscriber);

    const result = await unsubscribeByToken("valid-unsub");

    expect(result.message).toBe("Unsubscribed successfully.");
    expect(subscriber.status).toBe("unsubscribed");
    expect(subscriber.unsubscribedAt).toBeDefined();
    expect(subscriber.save).toHaveBeenCalled();
  });

  it("throws error for invalid unsubscribe token", async () => {
    MockedSubscriber.findOne.mockResolvedValue(null);

    await expect(unsubscribeByToken("invalid-token")).rejects.toThrow(
      "Invalid unsubscribe token."
    );
  });
});

