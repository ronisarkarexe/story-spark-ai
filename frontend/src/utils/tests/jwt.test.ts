import { describe, it, expect, vi, beforeEach } from "vitest";
import { jwtDecode } from "jwt-decode";
import { isJwtTokenFormat, decodedToken } from "../jwt";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

const mockedJwtDecode = vi.mocked(jwtDecode);

const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3600;
const PAST_EXP = Math.floor(Date.now() / 1000) - 3600;
const NOW_IAT = Math.floor(Date.now() / 1000) - 10;

const VALID_PAYLOAD = {
  userId: "user-123",
  email: "alice@example.com",
  role: "user",
  subscriptionType: "free",
  exp: FUTURE_EXP,
  iat: NOW_IAT,
};

// A dummy 3-part token string; the actual payload comes from the mocked jwtDecode.
const FAKE_TOKEN = "header.payload.signature";

describe("isJwtTokenFormat", () => {
  it("returns false for null", () => {
    expect(isJwtTokenFormat(null as unknown as string)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isJwtTokenFormat(undefined as unknown as string)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isJwtTokenFormat("")).toBe(false);
  });

  it("returns false for non-string input", () => {
    expect(isJwtTokenFormat(12345 as unknown as string)).toBe(false);
  });

  it("returns false for a string with fewer than 3 parts", () => {
    expect(isJwtTokenFormat("header.payload")).toBe(false);
  });

  it("returns false for a string with more than 3 parts", () => {
    expect(isJwtTokenFormat("a.b.c.d")).toBe(false);
  });

  it("returns true for a valid 3-part JWT format", () => {
    expect(isJwtTokenFormat("header.payload.signature")).toBe(true);
  });
});

describe("decodedToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws for invalid format (not 3 parts)", () => {
    expect(() => decodedToken("not-a-jwt")).toThrow(
      "Token format is invalid. A JWT must consist of three dot-separated segments."
    );
    expect(mockedJwtDecode).not.toHaveBeenCalled();
  });

  it("throws when userId and _id are both missing or empty", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      userId: undefined,
      _id: undefined,
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token is missing a valid 'userId' or '_id' claim."
    );
  });

  it("throws when email is missing or invalid format (no @, no domain)", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      email: "not-an-email",
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token 'email' claim is not a valid email address."
    );
  });

  it("throws when email claim is missing entirely", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      email: undefined,
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token is missing a valid 'email' claim."
    );
  });

  it("throws when role is missing or invalid (not one of user/admin/super_admin/writer/guest)", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      role: "hacker",
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token 'role' claim must be one of: user, admin, super_admin, writer, guest"
    );
  });

  it("throws when role claim is missing entirely", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      role: undefined,
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token is missing a valid 'role' claim."
    );
  });

  it("throws when subscriptionType is missing or invalid (not one of free/pro/premium)", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      subscriptionType: "enterprise",
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token 'subscriptionType' claim must be one of: free, pro, premium"
    );
  });

  it("throws when exp is in the past", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      exp: PAST_EXP,
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow("Token has expired.");
  });

  it("throws when exp is not a number", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      exp: "not-a-number",
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token is missing a valid numeric 'exp' claim."
    );
  });

  it("throws when iat is not a number", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      iat: "not-a-number",
    } as any);

    expect(() => decodedToken(FAKE_TOKEN)).toThrow(
      "Token is missing a valid numeric 'iat' claim."
    );
  });

  it("returns decoded payload when all claims are valid", () => {
    mockedJwtDecode.mockReturnValue(VALID_PAYLOAD as any);

    const result = decodedToken(FAKE_TOKEN);

    expect(result).toEqual(VALID_PAYLOAD);
    expect(mockedJwtDecode).toHaveBeenCalledWith(FAKE_TOKEN);
  });

  it("accepts _id as a fallback when userId is absent", () => {
    mockedJwtDecode.mockReturnValue({
      ...VALID_PAYLOAD,
      userId: undefined,
      _id: "mongo-id-456",
    } as any);

    const result = decodedToken(FAKE_TOKEN);
    expect(result._id).toBe("mongo-id-456");
  });
});