import { describe, it, expect } from "vitest";
import { validateTokenPayload } from "../auth-validator";

const makePayload = (overrides: Record<string, unknown> = {}) => ({
  userId: "user-123",
  email: "alice@example.com",
  role: "user",
  subscriptionType: "free",
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000) - 10,
  ...overrides,
});

describe("validateTokenPayload", () => {
  it("accepts a valid token payload", () => {
    expect(() => validateTokenPayload(makePayload())).not.toThrow();
  });

  it("throws when payload is null", () => {
    expect(() => validateTokenPayload(null)).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("throws when payload is an array", () => {
    expect(() => validateTokenPayload([])).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("throws when payload is a primitive", () => {
    expect(() => validateTokenPayload("string" as unknown as Record<string, unknown>)).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("throws when userId, _id, and sub are all missing", () => {
    const payload = makePayload({ userId: undefined, _id: undefined, sub: undefined });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid user identifier"
    );
  });

  it("accepts userId as identifier", () => {
    expect(() => validateTokenPayload(makePayload())).not.toThrow();
  });

  it("accepts _id as identifier", () => {
    const payload = makePayload({ userId: undefined, _id: "user-456" });
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("accepts sub as identifier", () => {
    const payload = makePayload({ userId: undefined, sub: "user-789" });
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("throws when userId is an empty string", () => {
    const payload = makePayload({ userId: "  " });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid user identifier"
    );
  });

  it("throws when email is missing", () => {
    const payload = makePayload({ email: undefined });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'email' claim"
    );
  });

  it("throws when email is an empty string", () => {
    const payload = makePayload({ email: "  " });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'email' claim"
    );
  });

  it("throws when email is not a valid format", () => {
    const payload = makePayload({ email: "not-an-email" });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'email' claim is not a valid email address"
    );
  });

  it("throws when email has no domain", () => {
    const payload = makePayload({ email: "user@" });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'email' claim is not a valid email address"
    );
  });

  it("accepts email with plus addressing", () => {
    const payload = makePayload({ email: "user+tag@example.com" });
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("throws when role is missing", () => {
    const payload = makePayload({ role: undefined });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'role' claim"
    );
  });

  it("throws when role is an empty string", () => {
    const payload = makePayload({ role: "  " });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'role' claim"
    );
  });

  it("accepts all valid roles", () => {
    const validRoles = ["admin", "super_admin", "user", "writer", "guest"];
    validRoles.forEach((role) => {
      expect(() => validateTokenPayload(makePayload({ role }))).not.toThrow();
    });
  });

  it("throws when subscriptionType is missing", () => {
    const payload = makePayload({ subscriptionType: undefined });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid 'subscriptionType' claim"
    );
  });

  it("accepts all valid subscription types", () => {
    const validTypes = ["free", "pro", "premium"];
    validTypes.forEach((type) => {
      expect(() => validateTokenPayload(makePayload({ subscriptionType: type }))).not.toThrow();
    });
  });

  it("throws when exp is missing", () => {
    const payload = makePayload({ exp: undefined });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim"
    );
  });

  it("throws when exp is a string", () => {
    const payload = makePayload({ exp: "12345" as unknown as number });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim"
    );
  });

  it("throws when exp is NaN", () => {
    const payload = makePayload({ exp: NaN });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim"
    );
  });

  it("throws when token is expired", () => {
    const payload = makePayload({ exp: Math.floor(Date.now() / 1000) - 7200 });
    expect(() => validateTokenPayload(payload)).toThrow("Token has expired");
  });

  it("accepts token within clock skew tolerance", () => {
    // Set exp just within the 60s clock skew window, with iat well before exp
    const exp = Math.floor(Date.now() / 1000) - 30;
    const iat = exp - 120;
    const payload = makePayload({ exp, iat });
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("throws when iat is missing", () => {
    const payload = makePayload({ iat: undefined });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'iat' claim"
    );
  });

  it("throws when iat is greater than or equal to exp", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = makePayload({ exp, iat: exp + 10 });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'iat' must be before 'exp'"
    );
  });

  it("accepts optional name claim when present and valid", () => {
    const payload = makePayload({ name: "Alice" });
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("throws when name claim is not a string", () => {
    const payload = makePayload({ name: 42 });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'name' claim must be a string"
    );
  });

  it("accepts optional postsCount claim when present and valid", () => {
    const payload = makePayload({ postsCount: 10 });
    expect(() => validateTokenPayload(payload)).not.toThrow();
  });

  it("throws when postsCount claim is not a number", () => {
    const payload = makePayload({ postsCount: "10" });
    expect(() => validateTokenPayload(payload)).toThrow(
      "Token 'postsCount' claim must be a number"
    );
  });
});
