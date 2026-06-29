import { describe, it, expect } from "vitest";
import { validateTokenPayload } from "../auth-validator";

const validPayload = {
  _id: "user-123",
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

  it("should accept payload with userId instead of _id", () => {
    const payload = { ...validPayload, _id: undefined, userId: "user-456" };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should accept payload with sub instead of _id or userId", () => {
    const payload = { ...validPayload, _id: undefined, sub: "user-789" };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should accept valid roles: admin, super_admin, user, writer, guest", () => {
    const roles = ["admin", "super_admin", "user", "writer", "guest"];
    for (const role of roles) {
      const payload = { ...validPayload, role };
      expect(() => validateTokenPayload(payload)).not.toThrow();
    }
  });

  it("should accept valid subscriptionTypes: free, pro, premium", () => {
    const subs = ["free", "pro", "premium"];
    for (const sub of subs) {
      const payload = { ...validPayload, subscriptionType: sub };
      expect(() => validateTokenPayload(payload)).not.toThrow();
    }
  });

  it("should accept optional name claim", () => {
    const payload = { ...validPayload, name: "Test User" };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should accept optional postsCount claim", () => {
    const payload = { ...validPayload, postsCount: 10 };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should throw when payload is null", () => {
    expect(() => validateTokenPayload(null)).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("should throw when payload is undefined", () => {
    expect(() => validateTokenPayload(undefined)).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("should throw when payload is not an object", () => {
    expect(() => validateTokenPayload("string" as unknown as object)).toThrow(
      "Token payload is not a valid object."
    );
    expect(() => validateTokenPayload(123 as unknown as object)).toThrow(
      "Token payload is not a valid object."
    );
    expect(() => validateTokenPayload([] as unknown as object)).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("should throw when userId, _id, and sub are all missing", () => {
    const payload = { ...validPayload, _id: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid user identifier ('userId', '_id', or 'sub')."
    );
  });

  it("should throw when userId is an empty string", () => {
    const payload = { ...validPayload, userId: "", _id: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid user identifier ('userId', '_id', or 'sub')."
    );
  });

  it("should throw when userId is whitespace-only", () => {
    const payload = { ...validPayload, userId: "   ", _id: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid user identifier ('userId', '_id', or 'sub')."
    );
  });

  it("should throw when email is missing", () => {
    const payload = { ...validPayload, email: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'email' claim."
    );
  });

  it("should throw when email is an empty string", () => {
    const payload = { ...validPayload, email: "" };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'email' claim."
    );
  });

  it("should throw when email is not a valid format", () => {
    const invalidEmails = [
      "notanemail",
      "missing@domain",
      "@nodomain.com",
      "spaces in@email.com",
      "email@",
    ];
    for (const email of invalidEmails) {
      const payload = { ...validPayload, email };
      expect(() => validateTokenPayload(payload)).toThrow(
        "Token 'email' claim is not a valid email address."
      );
    }
  });

  it("should throw when role is missing", () => {
    const payload: Record<string, unknown> = { ...validPayload, role: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'role' claim."
    );
  });

  it("should throw when role is empty string", () => {
    const payload = { ...validPayload, role: "" };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'role' claim."
    );
  });

  it("should throw when role is not a valid role", () => {
    const invalidRoles = ["admin2", "superuser", "reader", "editor", "moderator"];
    for (const role of invalidRoles) {
      const payload = { ...validPayload, role };
      expect(() => validateTokenPayload(payload)).toThrow(
        `Token 'role' claim must be one of: admin, super_admin, user, writer, guest`
      );
    }
  });

  it("should throw when subscriptionType is missing", () => {
    const payload: Record<string, unknown> = { ...validPayload, subscriptionType: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'subscriptionType' claim."
    );
  });

  it("should throw when subscriptionType is empty string", () => {
    const payload = { ...validPayload, subscriptionType: "" };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'subscriptionType' claim."
    );
  });

  it("should throw when subscriptionType is not valid", () => {
    const invalidSubs = ["basic", "enterprise", "trial", "vip"];
    for (const sub of invalidSubs) {
      const payload = { ...validPayload, subscriptionType: sub };
      expect(() => validateTokenPayload(payload)).toThrow(
        `Token 'subscriptionType' claim must be one of: free, pro, premium`
      );
    }
  });

  it("should throw when exp is missing", () => {
    const payload: Record<string, unknown> = { ...validPayload, exp: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim."
    );
  });

  it("should throw when exp is not a number", () => {
    const payload: Record<string, unknown> = { ...validPayload, exp: "12345" };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim."
    );
  });

  it("should throw when exp is NaN", () => {
    const payload = { ...validPayload, exp: NaN };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim."
    );
  });

  it("should throw when iat is missing", () => {
    const payload: Record<string, unknown> = { ...validPayload, iat: undefined };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'iat' claim."
    );
  });

  it("should throw when iat is not a number", () => {
    const payload: Record<string, unknown> = { ...validPayload, iat: "12345" };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'iat' claim."
    );
  });

  it("should throw when iat is NaN", () => {
    const payload = { ...validPayload, iat: NaN };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'iat' claim."
    );
  });

  it("should throw when optional name is not a string", () => {
    const payload: Record<string, unknown> = { ...validPayload, name: 123 };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'name' claim must be a string."
    );
  });

  it("should throw when optional postsCount is not a number", () => {
    const payload: Record<string, unknown> = { ...validPayload, postsCount: "10" };
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'postsCount' claim must be a number."
    );
  });

  it("should accept zero as a valid postsCount", () => {
    const payload = { ...validPayload, postsCount: 0 };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("should accept negative exp values", () => {
    // Negative timestamps are still technically valid numbers
    const payload = { ...validPayload, exp: -1 };
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });
});
