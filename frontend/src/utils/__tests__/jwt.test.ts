/**

 * @jest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { isJwtTokenFormat, decodedToken } from "../jwt";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a minimal valid JWT payload and returns the full three-part token. */
const makeToken = (payload: Record<string, unknown>, signWith = "fakeSig"): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, "");
  const sig = btoa(signWith).replace(/=/g, "");
  return `${header}.${payloadB64}.${sig}`;
};

/** A valid payload with all required claims and a far-future expiry. */
const validPayload = (overrides: Record<string, unknown> = {}) =>
  makeToken({
    email: "alice@example.com",
    userId: "user_123",
    role: "user",
    subscriptionType: "free",
    exp: Math.floor(Date.now() / 1000) + 86400, // tomorrow
    iat: Math.floor(Date.now() / 1000) - 60,
    ...overrides,
  });

// ---------------------------------------------------------------------------
// isJwtTokenFormat
// ---------------------------------------------------------------------------

describe("isJwtTokenFormat", () => {
  it("returns false for null", () => {
    expect(isJwtTokenFormat(null as any)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isJwtTokenFormat(undefined as any)).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isJwtTokenFormat(42 as any)).toBe(false);
    expect(isJwtTokenFormat({} as any)).toBe(false);
    expect(isJwtTokenFormat([] as any)).toBe(false);
  });

  it("returns false for a string with no dots", () => {
    expect(isJwtTokenFormat("notajwt")).toBe(false);
  });

  it("returns false for a string with only two parts", () => {
    expect(isJwtTokenFormat("header.payload")).toBe(false);
  });

  it("returns false for a string with four parts", () => {
    expect(isJwtTokenFormat("a.b.c.d")).toBe(false);
  });

  // Note: isJwtTokenFormat only checks part count, not content.
  // Empty parts are accepted at this stage; decodedToken catches them.

  it("returns true for a three-part string regardless of content", () => {
    expect(isJwtTokenFormat("a.b.c")).toBe(true);
    expect(isJwtTokenFormat("part1.part2.part3")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// decodedToken
// ---------------------------------------------------------------------------

describe("decodedToken", () => {
  it("throws when token is empty or falsy", () => {
    expect(() => decodedToken("")).toThrow();
    expect(() => decodedToken("   ")).toThrow();
  });

  it("throws when token does not have three parts", () => {
    expect(() => decodedToken("not-a-jwt")).toThrow(/format/i);
    expect(() => decodedToken("a.b")).toThrow(/format/i);
  });

  it("throws when JWT payload is malformed base64 (jwtDecode throws)", () => {
    expect(() => decodedToken("!!!.!!!.!!!")).toThrow(/decode/i);
  });

  it("throws when decoded payload is not an object", () => {
    // Token with numeric payload
    const numericPayload = btoa("123").replace(/=/g, "");
    expect(() => decodedToken(`h.${numericPayload}.s`)).toThrow(/not a valid object/i);
  });

  it("throws when userId and _id are both missing", () => {
    const token = makeToken({
      email: "alice@example.com",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/userId|_id/i);
  });

  it("throws when userId is an empty string", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "  ",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/userId/i);
  });

  it("throws when email claim is missing", () => {
    const token = makeToken({
      userId: "user_123",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/email/i);
  });

  it("throws when email is an empty string", () => {
    const token = makeToken({
      email: "  ",
      userId: "user_123",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/email/i);
  });

  it("throws when email does not match the email pattern", () => {
    const token = makeToken({
      email: "not-an-email",
      userId: "user_123",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/email/i);
  });

  it("throws when role claim is missing", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/role/i);
  });

  it("throws when role is not in the allowed list", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      role: "superuser",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/role/i);
  });

  it("throws when subscriptionType claim is missing", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/subscriptionType/i);
  });

  it("throws when subscriptionType is not in the allowed list", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      role: "user",
      subscriptionType: "enterprise",
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/subscriptionType/i);
  });

  it("throws when exp claim is missing", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      role: "user",
      subscriptionType: "free",
      iat: Math.floor(Date.now() / 1000),
    });
    expect(() => decodedToken(token)).toThrow(/exp/i);
  });

  it("throws when token is expired", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) - 1, // one second ago
      iat: Math.floor(Date.now() / 1000) - 120,
    });
    expect(() => decodedToken(token)).toThrow(/expired/i);
  });

  it("throws when iat claim is missing", () => {
    const token = makeToken({
      email: "alice@example.com",
      userId: "user_123",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 86400,
    });
    expect(() => decodedToken(token)).toThrow(/iat/i);
  });

  it("returns decoded payload for a fully valid token", () => {
    const token = validPayload();
    const decoded = decodedToken(token);
    expect(decoded.email).toBe("alice@example.com");
    expect(decoded.userId).toBe("user_123");
    expect(decoded.role).toBe("user");
    expect(decoded.subscriptionType).toBe("free");
  });

  it("accepts _id as identity claim when userId is absent", () => {
    const token = validPayload({ userId: undefined, _id: "id_456" });
    const decoded = decodedToken(token);
    expect(decoded._id).toBe("id_456");
  });

  it("accepts optional name and postsCount claims when present", () => {
    const token = validPayload({ name: "Bob", postsCount: 42 });
    const decoded = decodedToken(token);
    expect(decoded.name).toBe("Bob");
    expect(decoded.postsCount).toBe(42);
  });

  it("accepts all valid role values", () => {
    const roles = ["user", "admin", "super_admin", "writer", "guest"];
    for (const role of roles) {
      const token = validPayload({ role });
      expect(decodedToken(token).role).toBe(role);
    }
  });

  it("accepts all valid subscriptionType values", () => {
    const subs = ["free", "pro", "premium"];
    for (const sub of subs) {
      const token = validPayload({ subscriptionType: sub });
      expect(decodedToken(token).subscriptionType).toBe(sub);
    }

 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { isJwtTokenFormat, decodedToken } from "../jwt";

// Mock jwtDecode
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

const { jwtDecode } = await import("jwt-decode");
const mockJwtDecode = jwtDecode as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("isJwtTokenFormat", () => {
  it("returns true for a valid 3-part JWT token", () => {
    expect(isJwtTokenFormat("header.payload.signature")).toBe(true);
  });

  it("returns true for a real-looking JWT token", () => {
    expect(
      isJwtTokenFormat(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).toBe(true);
  });

  it("returns false for a token with only 2 parts", () => {
    expect(isJwtTokenFormat("header.payload")).toBe(false);
  });

  it("returns false for a token with only 1 part", () => {
    expect(isJwtTokenFormat("header")).toBe(false);
  });

  it("returns false for a token with 4 parts", () => {
    expect(isJwtTokenFormat("a.b.c.d")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isJwtTokenFormat("")).toBe(false);
  });

  it("returns false for null input", () => {
    expect(isJwtTokenFormat(null as unknown as string)).toBe(false);
  });

  it("returns false for undefined input", () => {
    expect(isJwtTokenFormat(undefined as unknown as string)).toBe(false);
  });
});

describe("decodedToken", () => {
  it("returns decoded payload for a valid token", () => {
    mockJwtDecode.mockReturnValue({
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      name: "Test User",
      postsCount: 5,
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const result = decodedToken("valid.payload.signature");
    expect(result._id).toBe("user-123");
    expect(result.email).toBe("test@example.com");
    expect(result.role).toBe("user");
    expect(result.subscriptionType).toBe("free");
  });

  it("throws for invalid token format (not 3 parts)", () => {
    expect(() => decodedToken("invalid-token")).toThrow(
      "Token format is invalid. A JWT must consist of three dot-separated segments."
    );
  });

  it("throws when jwtDecode fails", () => {
    mockJwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Failed to decode JWT token: Invalid token"
    );
  });

  it("throws when decoded payload is not an object", () => {
    mockJwtDecode.mockReturnValue(null);
    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Token payload is not a valid object."
    );
  });

  it("throws when userId and _id are missing", () => {
    mockJwtDecode.mockReturnValue({
      email: "test@example.com",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Token is missing a valid 'userId' or '_id' claim."
    );
  });

  it("throws when email is missing", () => {
    mockJwtDecode.mockReturnValue({
      _id: "user-123",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Token is missing a valid 'email' claim."
    );
  });

  it("throws when email is not a valid format", () => {
    mockJwtDecode.mockReturnValue({
      _id: "user-123",
      email: "not-an-email",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Token 'email' claim is not a valid email address."
    );
  });

  it("uses userId when _id is missing and passes with full required claims", () => {
    mockJwtDecode.mockReturnValue({
      userId: "user-456",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const result = decodedToken("valid.payload.signature");
    expect(result.userId).toBe("user-456");
  });

  it("throws when role is missing", () => {
    mockJwtDecode.mockReturnValue({
      _id: "user-123",
      email: "test@example.com",
      subscriptionType: "free",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Token is missing a valid 'role' claim."
    );
  });

  it("throws when subscriptionType is missing", () => {
    mockJwtDecode.mockReturnValue({
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      iat: Math.floor(Date.now() / 1000) - 3600,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    expect(() => decodedToken("valid.payload.signature")).toThrow(
      "Token is missing a valid 'subscriptionType' claim."
    );

  });
});
