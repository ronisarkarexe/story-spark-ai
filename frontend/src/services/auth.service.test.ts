import { describe, it, expect, vi, beforeEach } from "vitest";
import { getValidDecodedToken } from "./auth.service";
import * as localStorageUtils from "../utils/local-storage";
import * as jwtUtils from "../utils/jwt";

vi.mock("../utils/local-storage", () => ({
  getFromLocalStorage: vi.fn(),
  removeFromLocalStorage: vi.fn(),
  setToLocalStorage: vi.fn(),
}));

vi.mock("../utils/jwt", () => ({
  decodedToken: vi.fn(),
  isJwtTokenFormat: vi.fn(() => true),
}));

describe("Auth Service - JWT Payload Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return valid user info for a valid token", () => {
    const mockPayload = {
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      name: "Test User",
      postsCount: 5,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("valid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload);

    const result = getValidDecodedToken();

    expect(result).not.toBeNull();
    expect(result?.userId).toBe("user-123");
    expect(result?.email).toBe("test@example.com");
    expect(result?.role).toBe("user");
    expect(result?.subscriptionType).toBe("free");
    expect(result?.name).toBe("Test User");
    expect(result?.postsCount).toBe(5);
    expect(localStorageUtils.removeFromLocalStorage).not.toHaveBeenCalled();
  });

  it("should return null and remove token when user ID is missing", () => {
    const mockPayload = {
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("invalid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when role is missing", () => {
    const mockPayload = {
      _id: "user-123",
      email: "test@example.com",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("invalid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when role is invalid", () => {
    const mockPayload = {
      _id: "user-123",
      email: "test@example.com",
      role: "invalid-role",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("invalid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when exp is not a number", () => {
    const mockPayload = {
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      exp: "not-a-number",
      iat: Math.floor(Date.now() / 1000) - 60,
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("invalid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload as any);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when iat is not a number", () => {
    const mockPayload = {
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: "not-a-number",
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("invalid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload as any);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when token is expired", () => {
    const mockPayload = {
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) - 10,
      iat: Math.floor(Date.now() / 1000) - 3600,
    };

    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("expired.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue(mockPayload);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when payload is empty", () => {
    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("empty.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue({});

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });

  it("should return null and remove token when decoding throws an error (malformed token)", () => {
    vi.mocked(localStorageUtils.getFromLocalStorage).mockReturnValue("malformed.token.here");
    vi.mocked(jwtUtils.decodedToken).mockImplementation(() => {
      throw new Error("Invalid token format");
    });

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(localStorageUtils.removeFromLocalStorage).toHaveBeenCalledWith("accessToken");
  });
});
