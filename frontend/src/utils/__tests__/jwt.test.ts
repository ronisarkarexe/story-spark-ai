// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock jwt-decode
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

import { isJwtTokenFormat, decodeToken as decodedToken } from "../jwt";
import { jwtDecode } from "jwt-decode";

const mockJwtDecode = jwtDecode as unknown as ReturnType<typeof vi.fn>;

const validPayload = {
  userId: "user-123",
  email: "test@example.com",
  role: "user",
  subscriptionType: "free",
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000) - 60,
};

describe("isJwtTokenFormat", () => {
  it("should return true for a valid 3-part JWT", () => {
    expect(isJwtTokenFormat("part1.part2.part3")).toBe(true);
    expect(
      isJwtTokenFormat(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
      )
    ).toBe(true);
  });

  it("should return false for non-string input", () => {
    expect(isJwtTokenFormat(null as any)).toBe(false);
    expect(isJwtTokenFormat(undefined as any)).toBe(false);
    expect(isJwtTokenFormat(123 as any)).toBe(false);
    expect(isJwtTokenFormat({} as any)).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isJwtTokenFormat("")).toBe(false);
  });

  it("should return false for single dot or 2 parts", () => {
    expect(isJwtTokenFormat("nodots")).toBe(false);
    expect(isJwtTokenFormat("one.two")).toBe(false);
  });

  it("should return false for four parts", () => {
    expect(isJwtTokenFormat("one.two.three.four")).toBe(false);
  });
});

describe("decodedToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw for invalid token format", () => {
    expect(() => decodedToken("not-a-jwt")).toThrow("Token format is invalid");
  });

  it("should throw when jwtDecode throws", () => {
    mockJwtDecode.mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });
    expect(() => decodedToken("part1.part2.part3")).toThrow("Failed to decode JWT token");
  });

  it("should throw when decoded payload is not an object", () => {
    mockJwtDecode.mockReturnValueOnce(null);
    expect(() => decodedToken("part1.part2.part3")).toThrow("Token payload is not a valid object");
  });

  it("should throw when userId and _id are missing", () => {
    mockJwtDecode.mockReturnValueOnce({
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    });
    expect(() => decodedToken("part1.part2.part3")).toThrow("Token is missing a valid");
  });

  it("should throw when email is missing", () => {
    mockJwtDecode.mockReturnValueOnce({
      userId: "user-123",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    });
    expect(() => decodedToken("part1.part2.part3")).toThrow("Token is missing a valid");
  });

  it("should throw when email is invalid format", () => {
    mockJwtDecode.mockReturnValueOnce({
      ...validPayload,
      email: "not-an-email",
    });
    expect(() => decodedToken("part1.part2.part3")).toThrow("Token 'email' claim is not a valid email");
  });

  it("should return decoded payload for valid token", () => {
    mockJwtDecode.mockReturnValueOnce(validPayload);
    const result = decodedToken("part1.part2.part3");
    expect(result.userId).toBe("user-123");
    expect(mockJwtDecode).toHaveBeenCalledWith("part1.part2.part3");
  });
});
