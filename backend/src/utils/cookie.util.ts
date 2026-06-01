import { Response } from "express";
import config from "../config";

const isProd = config.env === "production";

/**
 * Shared cookie options used across all res.cookie() calls.
 * - sameSite "none" is required for cross-origin requests (frontend on Vercel, backend on separate domain)
 * - sameSite "none" MUST be paired with secure: true (browsers reject it otherwise)
 * - In development, we use "lax" + secure: false so localhost works without HTTPS
 */
export const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax" | "strict",
    path: "/",
};

/**
 * Sets both the refreshToken cookie on the response.
 */
export const setRefreshTokenCookie = (
    res: Response,
    refreshToken: string
): void => {
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

/**
 * Clears the refreshToken cookie. Options must match those used to set it.
 */
export const clearRefreshTokenCookie = (res: Response): void => {
    res.clearCookie("refreshToken", cookieOptions);
};

/**
 * Sets the guest userId tracking cookie.
 */
export const setGuestUserIdCookie = (
    res: Response,
    userId: string
): void => {
    res.cookie("userId", userId, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};