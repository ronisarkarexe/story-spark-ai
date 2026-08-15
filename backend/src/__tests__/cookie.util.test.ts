import type { Response } from "express";
import {
  cookieOptions,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  setGuestUserIdCookie,
  signGuestUserId,
  verifySignedGuestUserId,
  guestQuotaKeyForIp,
  getRequestClientIp,
} from "../utils/cookie.util";

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    env: "development",
    jwt: {
      secret: "test-jwt-secret",
      refresh_secret: "test-refresh-secret",
      expires_in: "15m",
      refresh_expires_in: "7d",
    },
  },
}));

function buildMockRes(): {
  res: Response & { cookie: jest.Mock; clearCookie: jest.Mock };
  cookieMock: jest.Mock;
  clearCookieMock: jest.Mock;
} {
  const cookieMock = jest.fn();
  const clearCookieMock = jest.fn();
  const res = {
    cookie: cookieMock,
    clearCookie: clearCookieMock,
  } as unknown as Response & { cookie: jest.Mock; clearCookie: jest.Mock };
  return { res, cookieMock, clearCookieMock };
}

describe("cookieOptions — development env", () => {
  it("sets httpOnly to true", () => {
    expect(cookieOptions.httpOnly).toBe(true);
  });

  it("sets secure to false in development", () => {
    expect(cookieOptions.secure).toBe(false);
  });

  it("sets sameSite to 'lax' in development", () => {
    expect(cookieOptions.sameSite).toBe("lax");
  });

  it("sets path to '/'", () => {
    expect(cookieOptions.path).toBe("/");
  });
});

describe("setRefreshTokenCookie", () => {
  it("calls res.cookie with 'refreshToken' as the cookie name", () => {
    const { res, cookieMock } = buildMockRes();
    setRefreshTokenCookie(res, "token-abc123");
    expect(cookieMock).toHaveBeenCalledTimes(1);
    const [name, value, options] = cookieMock.mock.calls[0];
    expect(name).toBe("refreshToken");
    expect(value).toBe("token-abc123");
  });

  it("passes httpOnly, secure, sameSite, path from cookieOptions", () => {
    const { res, cookieMock } = buildMockRes();
    setRefreshTokenCookie(res, "token");
    const [, , options] = cookieMock.mock.calls[0];
    expect(options.httpOnly).toBe(cookieOptions.httpOnly);
    expect(options.secure).toBe(cookieOptions.secure);
    expect(options.sameSite).toBe(cookieOptions.sameSite);
    expect(options.path).toBe(cookieOptions.path);
  });

  it("sets maxAge to 7 days in milliseconds", () => {
    const { res, cookieMock } = buildMockRes();
    setRefreshTokenCookie(res, "token");
    const [, , options] = cookieMock.mock.calls[0];
    expect(options.maxAge).toBe(7 * 24 * 60 * 60 * 1000);
  });
});

describe("clearRefreshTokenCookie", () => {
  it("calls res.clearCookie with 'refreshToken' as the cookie name", () => {
    const { res, clearCookieMock } = buildMockRes();
    clearRefreshTokenCookie(res);
    expect(clearCookieMock).toHaveBeenCalledTimes(1);
    const [name, options] = clearCookieMock.mock.calls[0];
    expect(name).toBe("refreshToken");
  });

  it("passes cookieOptions to clearCookie", () => {
    const { res, clearCookieMock } = buildMockRes();
    clearRefreshTokenCookie(res);
    const [, options] = clearCookieMock.mock.calls[0];
    expect(options.httpOnly).toBe(cookieOptions.httpOnly);
    expect(options.secure).toBe(cookieOptions.secure);
    expect(options.sameSite).toBe(cookieOptions.sameSite);
    expect(options.path).toBe(cookieOptions.path);
  });
});

describe("setGuestUserIdCookie", () => {
  it("calls res.cookie with 'userId' as the cookie name", () => {
    const { res, cookieMock } = buildMockRes();
    setGuestUserIdCookie(res, "guest-uuid-123");
    expect(cookieMock).toHaveBeenCalledTimes(1);
    const [name, value] = cookieMock.mock.calls[0];
    expect(name).toBe("userId");
    expect(typeof value).toBe("string");
    expect(value.startsWith("s:guest-uuid-123.")).toBe(true);
  });

  it("passes httpOnly, secure, sameSite, path from cookieOptions", () => {
    const { res, cookieMock } = buildMockRes();
    setGuestUserIdCookie(res, "guest-uuid");
    const [, , options] = cookieMock.mock.calls[0];
    expect(options.httpOnly).toBe(cookieOptions.httpOnly);
    expect(options.secure).toBe(cookieOptions.secure);
    expect(options.sameSite).toBe(cookieOptions.sameSite);
    expect(options.path).toBe(cookieOptions.path);
  });

  it("sets maxAge to 30 days in milliseconds", () => {
    const { res, cookieMock } = buildMockRes();
    setGuestUserIdCookie(res, "guest-uuid");
    const [, , options] = cookieMock.mock.calls[0];
    expect(options.maxAge).toBe(30 * 24 * 60 * 60 * 1000);
  });
});


describe("signed guest cookie + IP quota key", () => {
  it("round-trips a signed guest user id", () => {
    const signed = signGuestUserId("guest-uuid-123");
    expect(verifySignedGuestUserId(signed)).toBe("guest-uuid-123");
    expect(verifySignedGuestUserId("s:guest-uuid-123.deadbeef")).toBeNull();
  });

  it("builds a stable IP-bound guest quota key", () => {
    expect(guestQuotaKeyForIp("203.0.113.10")).toBe("ip:203.0.113.10");
  });

  it("reads client IP from x-forwarded-for when present", () => {
    const req = {
      headers: { "x-forwarded-for": "198.51.100.4, 10.0.0.1" },
      ip: "10.0.0.1",
    } as any;
    expect(getRequestClientIp(req)).toBe("198.51.100.4");
  });
});
