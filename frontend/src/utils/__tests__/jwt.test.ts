import { describe, it, expect } from "vitest";
import { isJwtTokenFormat, decodedToken } from "../jwt";

describe("jwt utility", () => {
  describe("isJwtTokenFormat", () => {
    it("returns true for a valid 3-part JWT token", () => {
      expect(isJwtTokenFormat("abc.def.ghi")).toBe(true);
      expect(isJwtTokenFormat("header.payload.signature")).toBe(true);
    });

    it("returns false for non-string input", () => {
      expect(isJwtTokenFormat(null as any)).toBe(false);
      expect(isJwtTokenFormat(undefined as any)).toBe(false);
      expect(isJwtTokenFormat(123 as any)).toBe(false);
      expect(isJwtTokenFormat({} as any)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isJwtTokenFormat("")).toBe(false);
    });

    it("returns false for tokens with wrong number of parts", () => {
      expect(isJwtTokenFormat("abc.def")).toBe(false);
      expect(isJwtTokenFormat("abc")).toBe(false);
      expect(isJwtTokenFormat("")).toBe(false);
      expect(isJwtTokenFormat("a.b.c.d")).toBe(false);
    });

    it("returns false for whitespace-only string", () => {
      expect(isJwtTokenFormat("   ")).toBe(false);
    });
  });

  describe("decodedToken", () => {
    // Helper to build a minimal valid JWT without a library
    const buildToken = (payload: Record<string, any>): string => {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payloadB64 = btoa(JSON.stringify(payload));
      const sig = btoa("sig");
      return `${header}.${payloadB64}.${sig}`;
    };

    const now = Math.floor(Date.now() / 1000);

    it("decodes a valid token with all required claims", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
      });
      const decoded = decodedToken(token);
      expect(decoded.userId).toBe("user123");
      expect(decoded.email).toBe("test@example.com");
      expect(decoded.role).toBe("user");
      expect(decoded.subscriptionType).toBe("free");
    });

    it("accepts _id instead of userId", () => {
      const token = buildToken({
        _id: "user456",
        email: "test@example.com",
        role: "admin",
        subscriptionType: "pro",
        exp: now + 3600,
        iat: now,
      });
      const decoded = decodedToken(token);
      expect(decoded._id).toBe("user456");
    });

    it("throws when token format is invalid", () => {
      expect(() => decodedToken("not-a-jwt")).toThrow("Token format is invalid");
      expect(() => decodedToken("")).toThrow("Token format is invalid");
      expect(() => decodedToken("one.two")).toThrow("Token format is invalid");
    });

    it("throws when userId and _id are both missing", () => {
      const token = buildToken({
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("missing a valid 'userId' or '_id' claim");
    });

    it("throws when email claim is missing", () => {
      const token = buildToken({
        userId: "user123",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("missing a valid 'email' claim");
    });

    it("throws when email claim is not a valid format", () => {
      const token = buildToken({
        userId: "user123",
        email: "not-an-email",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("not a valid email address");
    });

    it("throws when role claim is missing", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("missing a valid 'role' claim");
    });

    it("throws when role claim is not a valid role", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "invalid_role",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("must be one of");
    });

    it("throws when subscriptionType claim is missing", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("missing a valid 'subscriptionType' claim");
    });

    it("throws when subscriptionType claim is not valid", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "enterprise",
        exp: now + 3600,
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("must be one of");
    });

    it("throws when exp claim is missing or not a number", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        iat: now,
      });
      expect(() => decodedToken(token)).toThrow("missing a valid numeric 'exp' claim");

      const token2 = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: "invalid",
        iat: now,
      });
      expect(() => decodedToken(token2)).toThrow("missing a valid numeric 'exp' claim");
    });

    it("throws when token has expired", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now - 3600,
        iat: now - 7200,
      });
      expect(() => decodedToken(token)).toThrow("Token has expired");
    });

    it("throws when iat claim is missing or not a number", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
      });
      expect(() => decodedToken(token)).toThrow("missing a valid numeric 'iat' claim");
    });

    it("accepts optional name claim when present as string", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
        name: "Test User",
      });
      const decoded = decodedToken(token);
      expect(decoded.name).toBe("Test User");
    });

    it("throws when optional name claim is not a string", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
        name: 123,
      });
      expect(() => decodedToken(token)).toThrow("'name' claim must be a string");
    });

    it("accepts optional postsCount claim when present as number", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
        postsCount: 42,
      });
      const decoded = decodedToken(token);
      expect(decoded.postsCount).toBe(42);
    });

    it("throws when optional postsCount claim is not a number", () => {
      const token = buildToken({
        userId: "user123",
        email: "test@example.com",
        role: "user",
        subscriptionType: "free",
        exp: now + 3600,
        iat: now,
        postsCount: "many",
      });
      expect(() => decodedToken(token)).toThrow("'postsCount' claim must be a number");
    });
  });
});
