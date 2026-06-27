import { describe, it, expect } from "vitest";
import { validateTokenPayload } from "../auth-validator";

const validPayload = {
  userId: "user-123",
  email: "test@example.com",
  role: "user",
  subscriptionType: "free",
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000) - 60,
};

describe("validateTokenPayload", () => {
  it("should not throw for a valid payload", () => {
    expect(() => validateTokenPayload(validPayload)).not.toThrow();
  });

  it("should accept _id as user identifier", () => {
    const payload = { ...validPayload };
    delete payload.userId;
    payload._id = "user-from-id";
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should accept sub as user identifier", () => {
    const payload = { ...validPayload };
    delete payload.userId;
    payload.sub = "user-from-sub";
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should throw when userId, _id, and sub are all missing", () => {
    const payload = { ...validPayload };
    delete payload.userId;
    expect(() => validateTokenPayload(payload)).toThrow("Token is missing a valid user identifier");
  });

  it("should throw when email is missing", () => {
    const payload = { ...validPayload };
    delete payload.email;
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid 'email' claim");
  });

  it("should throw when email is not a valid format", () => {
    const payload = { ...validPayload, email: "not-an-email" };
    expect(() => validateTokenPayload(payload)).toThrow("not a valid email address");
  });

  it("should throw when email is empty string", () => {
    const payload = { ...validPayload, email: "" };
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid 'email' claim");
  });

  it("should throw when role is missing", () => {
    const payload = { ...validPayload };
    delete payload.role;
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid 'role' claim");
  });

  it("should throw when role is invalid", () => {
    const payload = { ...validPayload, role: "superuser" };
    expect(() => validateTokenPayload(payload)).toThrow("must be one of:");
  });

  it("should accept all valid role values", () => {
    const validRoles = ["admin", "super_admin", "user", "writer", "guest"];
    for (const role of validRoles) {
      const payload = { ...validPayload, role };
      expect(() => validateTokenPayload(payload)).not.toThrow();
    }
  });

  it("should throw when subscriptionType is missing", () => {
    const payload = { ...validPayload };
    delete payload.subscriptionType;
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid 'subscriptionType' claim");
  });

  it("should throw when subscriptionType is invalid", () => {
    const payload = { ...validPayload, subscriptionType: "enterprise" };
    expect(() => validateTokenPayload(payload)).toThrow("must be one of:");
  });

  it("should accept all valid subscriptionType values", () => {
    const validSubscriptions = ["free", "pro", "premium"];
    for (const sub of validSubscriptions) {
      const payload = { ...validPayload, subscriptionType: sub };
      expect(() => validateTokenPayload(payload)).not.toThrow();
    }
  });

  it("should throw when exp is missing", () => {
    const payload = { ...validPayload };
    delete payload.exp;
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid numeric 'exp' claim");
  });

  it("should throw when exp is not a number", () => {
    const payload = { ...validPayload, exp: "not-a-number" };
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid numeric 'exp' claim");
  });

  it("should throw when exp is NaN", () => {
    const payload = { ...validPayload, exp: NaN };
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid numeric 'exp' claim");
  });

  it("should throw when iat is missing", () => {
    const payload = { ...validPayload };
    delete payload.iat;
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid numeric 'iat' claim");
  });

  it("should throw when iat is not a number", () => {
    const payload = { ...validPayload, iat: "not-a-number" };
    expect(() => validateTokenPayload(payload)).toThrow("missing a valid numeric 'iat' claim");
  });

  it("should throw when payload is not an object", () => {
    expect(() => validateTokenPayload(null as any)).toThrow("not a valid object");
    expect(() => validateTokenPayload("string" as any)).toThrow("not a valid object");
  });

  it("should throw when payload is undefined", () => {
    expect(() => validateTokenPayload(undefined as any)).toThrow("not a valid object");
  });

  it("should allow optional name claim when present", () => {
    const payload = { ...validPayload, name: "John Doe" };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should allow optional postsCount claim when present", () => {
    const payload = { ...validPayload, postsCount: 42 };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });
});
