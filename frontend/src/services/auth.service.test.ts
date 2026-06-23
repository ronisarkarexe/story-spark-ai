import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getValidDecodedToken,
  isLoggedIn,
  removeUserInfo,
  storeUserInfo,
  getToken,
} from "./auth.service";
import * as authToken from "./auth.token";
import * as jwtUtils from "../utils/jwt";

vi.mock("./auth.token", () => ({
  clearAccessToken: vi.fn(),
  getAccessToken: vi.fn(),
  setAccessToken: vi.fn(),
}));

vi.mock("../utils/jwt", () => ({
  decodedToken: vi.fn(),
}));

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores the token in memory", () => {
    storeUserInfo({ accessToken: "token-123" });
    expect(authToken.setAccessToken).toHaveBeenCalledWith("token-123");
  });

  it("returns decoded user info for a valid token", () => {
    vi.mocked(authToken.getAccessToken).mockReturnValue("valid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue({
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      name: "Test User",
      postsCount: 5,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000) - 60,
    } as any);

    const result = getValidDecodedToken();

    expect(result?.userId).toBe("user-123");
    expect(result?.email).toBe("test@example.com");
    expect(result?.role).toBe("user");
    expect(result?.subscriptionType).toBe("free");
    expect(result?.name).toBe("Test User");
    expect(result?.postsCount).toBe(5);
  });

  it("clears expired tokens", () => {
    vi.mocked(authToken.getAccessToken).mockReturnValue("expired.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue({
      _id: "user-123",
      email: "test@example.com",
      role: "user",
      subscriptionType: "free",
      exp: Math.floor(Date.now() / 1000) - 10,
      iat: Math.floor(Date.now() / 1000) - 3600,
    } as any);

    const result = getValidDecodedToken();

    expect(result).toBeNull();
    expect(authToken.clearAccessToken).toHaveBeenCalled();
  });

  it("reports login state from the in-memory token", () => {
    vi.mocked(authToken.getAccessToken).mockReturnValue("valid.token.here");
    vi.mocked(jwtUtils.decodedToken).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
    } as any);

    expect(isLoggedIn()).toBe(true);
    expect(getToken()).toBe("valid.token.here");
  });

  it("clears the token on logout", () => {
    removeUserInfo();
    expect(authToken.clearAccessToken).toHaveBeenCalled();
  });
});
