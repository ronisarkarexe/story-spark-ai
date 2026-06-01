"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGuestUserIdCookie = exports.clearRefreshTokenCookie = exports.setRefreshTokenCookie = exports.cookieOptions = void 0;
const config_1 = __importDefault(require("../config"));
const isProd = config_1.default.env === "production";
/**
 * Shared cookie options used across all res.cookie() calls.
 * - sameSite "none" is required for cross-origin requests (frontend on Vercel, backend on separate domain)
 * - sameSite "none" MUST be paired with secure: true (browsers reject it otherwise)
 * - In development, we use "lax" + secure: false so localhost works without HTTPS
 */
exports.cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax"),
    path: "/",
};
/**
 * Sets both the refreshToken cookie on the response.
 */
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, Object.assign(Object.assign({}, exports.cookieOptions), { maxAge: 7 * 24 * 60 * 60 * 1000 }));
};
exports.setRefreshTokenCookie = setRefreshTokenCookie;
/**
 * Clears the refreshToken cookie. Options must match those used to set it.
 */
const clearRefreshTokenCookie = (res) => {
    res.clearCookie("refreshToken", exports.cookieOptions);
};
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
/**
 * Sets the guest userId tracking cookie.
 */
const setGuestUserIdCookie = (res, userId) => {
    res.cookie("userId", userId, Object.assign(Object.assign({}, exports.cookieOptions), { maxAge: 30 * 24 * 60 * 60 * 1000 }));
};
exports.setGuestUserIdCookie = setGuestUserIdCookie;
