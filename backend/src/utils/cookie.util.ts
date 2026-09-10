import { Request, Response } from "express";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import config from "../config";
import { durationToMilliseconds } from "./duration.util";

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

const guestCookieSecret = (): string =>
  process.env.COOKIE_SECRET?.trim() ||
  config.jwt.refresh_secret ||
  config.jwt.secret;

/** HMAC-signed guest cookie value (s:<uuid>.<sig>) so clients cannot forge ids. */
export const signGuestUserId = (userId: string): string => {
  const sig = createHmac("sha256", guestCookieSecret())
    .update(userId)
    .digest("base64url");
  return `s:${userId}.${sig}`;
};

export const verifySignedGuestUserId = (raw: string | undefined): string | null => {
  if (!raw || !raw.startsWith("s:")) return null;
  const payload = raw.slice(2);
  const dot = payload.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = payload.slice(0, dot);
  const sig = payload.slice(dot + 1);
  if (!userId || !sig) return null;
  const expected = createHmac("sha256", guestCookieSecret())
    .update(userId)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return userId;
  } catch {
    return null;
  }
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
      maxAge: durationToMilliseconds(config.jwt.refresh_expires_in ?? "7d"),
    });
};

/**
 * Clears the refreshToken cookie. Options must match those used to set it.
 */
export const clearRefreshTokenCookie = (res: Response): void => {
    res.clearCookie("refreshToken", cookieOptions);
};

/**
 * Sets the guest userId tracking cookie (HMAC-signed).
 * Quota is NOT keyed by this cookie alone — see resolveGuestQuotaKey.
 */
export const setGuestUserIdCookie = (
    res: Response,
    userId: string
): void => {
    res.cookie("userId", signGuestUserId(userId), {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

/** Prefer signed guest cookie; fall back to legacy unsigned UUID cookies. */
export const readGuestUserIdCookie = (req: Request): string | undefined => {
  const raw = req.cookies?.userId as string | undefined;
  const verified = verifySignedGuestUserId(raw);
  if (verified) return verified;
  // Legacy unsigned cookie (UUID-shaped) — still accepted for continuity, but
  // quota binding uses IP so clearing/forging this cannot mint a fresh bucket.
  if (raw && !raw.startsWith("s:") && /^[0-9a-f-]{36}$/i.test(raw)) {
    return raw;
  }
  return undefined;
};

/**
 * Client IP used for guest quota. Fail closed when the IP cannot be determined.
 */
export const getRequestClientIp = (req: Request): string | null => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  if (Array.isArray(forwarded) && forwarded[0]?.trim()) {
    return forwarded[0].trim();
  }
  const ip = (req.ip || req.socket?.remoteAddress || "").trim();
  if (!ip) return null;
  return ip;
};

/** Stable GuestUsage key bound to IP (not rotatable via cookie clear). */
export const guestQuotaKeyForIp = (ip: string): string => `ip:${ip}`;
