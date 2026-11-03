import type { Response } from "express";

describe("cookie.util.ts", () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("in development environment", () => {
    let cookieOptions: any;
    let setRefreshTokenCookie: any;
    let clearRefreshTokenCookie: any;
    let setGuestUserIdCookie: any;

    beforeEach(() => {
      jest.resetModules();
      process.env.NODE_ENV = "development";
      
      // Import after setting environment
      const module = require("../cookie.util");
      cookieOptions = module.cookieOptions;
      setRefreshTokenCookie = module.setRefreshTokenCookie;
      clearRefreshTokenCookie = module.clearRefreshTokenCookie;
      setGuestUserIdCookie = module.setGuestUserIdCookie;
    });

    describe("cookieOptions", () => {
      it("should have httpOnly set to true", () => {
        expect(cookieOptions.httpOnly).toBe(true);
      });

      it("should have path set to '/'", () => {
        expect(cookieOptions.path).toBe("/");
      });

      it("should have secure set to false and sameSite set to 'lax'", () => {
        expect(cookieOptions.secure).toBe(false);
        expect(cookieOptions.sameSite).toBe("lax");
      });
    });

    describe("setRefreshTokenCookie", () => {
      it("should call res.cookie with the correct name, token, and options", () => {
        const testToken = "test-refresh-token-123";
        setRefreshTokenCookie(mockRes as Response, testToken);

        expect(mockRes.cookie).toHaveBeenCalledTimes(1);
        expect(mockRes.cookie).toHaveBeenCalledWith(
          "refreshToken",
          testToken,
          expect.objectContaining({
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          })
        );
      });
    });

    describe("clearRefreshTokenCookie", () => {
      it("should call res.clearCookie with the correct name and options", () => {
        clearRefreshTokenCookie(mockRes as Response);

        expect(mockRes.clearCookie).toHaveBeenCalledTimes(1);
        expect(mockRes.clearCookie).toHaveBeenCalledWith(
          "refreshToken",
          cookieOptions
        );
      });
    });

    describe("setGuestUserIdCookie", () => {
      it("should call res.cookie with the correct name, userId, and options", () => {
        const testUserId = "test-guest-user-456";
        setGuestUserIdCookie(mockRes as Response, testUserId);

        expect(mockRes.cookie).toHaveBeenCalledTimes(1);
        expect(mockRes.cookie).toHaveBeenCalledWith(
          "userId",
          testUserId,
          expect.objectContaining({
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          })
        );
      });
    });
  });

  describe("in production environment", () => {
    let cookieOptions: any;
    let setRefreshTokenCookie: any;
    let clearRefreshTokenCookie: any;
    let setGuestUserIdCookie: any;

    beforeEach(() => {
      jest.resetModules();
      process.env.NODE_ENV = "production";
      
      // Import after setting environment
      const module = require("../cookie.util");
      cookieOptions = module.cookieOptions;
      setRefreshTokenCookie = module.setRefreshTokenCookie;
      clearRefreshTokenCookie = module.clearRefreshTokenCookie;
      setGuestUserIdCookie = module.setGuestUserIdCookie;
    });

    afterAll(() => {
      process.env.NODE_ENV = "development";
    });

    describe("cookieOptions", () => {
      it("should have httpOnly set to true", () => {
        expect(cookieOptions.httpOnly).toBe(true);
      });

      it("should have path set to '/'", () => {
        expect(cookieOptions.path).toBe("/");
      });

      it("should have secure set to true and sameSite set to 'none'", () => {
        expect(cookieOptions.secure).toBe(true);
        expect(cookieOptions.sameSite).toBe("none");
      });
    });
  });
});
