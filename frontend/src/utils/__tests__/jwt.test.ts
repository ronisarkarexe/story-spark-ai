/**
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
