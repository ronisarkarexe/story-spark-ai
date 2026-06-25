import { describe, it, expect } from "vitest";
import { validateTokenPayload } from "../auth-validator";

describe("validateTokenPayload", () => {
  const validPayload = {
    userId: "123",
    email: "test@example.com",
    role: "user",
    subscriptionType: "free",
    exp: 1234567890,
    iat: 1234567000,
  };

  it("should not throw for a valid payload", () => {
    expect(() => validateTokenPayload(validPayload)).not.toThrow();
  });

  it("should throw for non-object input", () => {
    expect(() => validateTokenPayload(null)).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("should throw when user identifier is missing", () => {
    const payload = { ...validPayload };
    delete (payload as any).userId;

    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid user identifier ('userId', '_id', or 'sub')."
    );
  });

  it("should throw for invalid email format", () => {
    expect(() =>
      validateTokenPayload({
        ...validPayload,
        email: "invalid-email",
      })
    ).toThrow("Token 'email' claim is not a valid email address.");
  });

  it("should throw for invalid role", () => {
    expect(() =>
      validateTokenPayload({
        ...validPayload,
        role: "hacker",
      })
    ).toThrow(
      "Token 'role' claim must be one of: admin, super_admin, user, writer, guest"
    );
  });

  it("should throw for invalid subscriptionType", () => {
    expect(() =>
      validateTokenPayload({
        ...validPayload,
        subscriptionType: "gold",
      })
    ).toThrow(
      "Token 'subscriptionType' claim must be one of: free, pro, premium"
    );
  });

  it("should throw when exp is missing", () => {
    const payload = { ...validPayload };
    delete (payload as any).exp;

    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'exp' claim."
    );
  });

  it("should throw when iat is missing", () => {
    const payload = { ...validPayload };
    delete (payload as any).iat;

    expect(() => validateTokenPayload(payload)).toThrow(
      "Token is missing a valid numeric 'iat' claim."
    );
  });

  it("should throw when exp is not numeric", () => {
    expect(() =>
      validateTokenPayload({
        ...validPayload,
        exp: "abc" as any,
      })
    ).toThrow("Token is missing a valid numeric 'exp' claim.");
  });

  it("should throw when iat is not numeric", () => {
    expect(() =>
      validateTokenPayload({
        ...validPayload,
        iat: "abc" as any,
      })
    ).toThrow("Token is missing a valid numeric 'iat' claim.");
  });
});