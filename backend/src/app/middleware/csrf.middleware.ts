import { createHmac, timingSafeEqual } from "crypto";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const CSRF_HEADER = "x-csrf-token";

const normalizeHeader = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
};

const getProvidedToken = (req: Request): string => {
  const headerValue =
    (req.header ? req.header(CSRF_HEADER) : undefined) ??
    (req.header ? req.header("X-CSRF-Token") : undefined) ??
    (req.get ? req.get(CSRF_HEADER) : undefined) ??
    (req.get ? req.get("X-CSRF-Token") : undefined);

  if (headerValue) {
    return normalizeHeader(headerValue);
  }

  const headers = req.headers as Record<string, string | string[] | undefined>;
  return normalizeHeader(
    headers[CSRF_HEADER] ?? headers["x-csrf-token"] ?? headers["X-CSRF-Token"]
  );
};

const getAuthorizationHeader = (req: Request): string => {
  const headerValue =
    (req.header ? req.header("authorization") : undefined) ??
    (req.get ? req.get("authorization") : undefined);

  if (headerValue) {
    return normalizeHeader(headerValue);
  }

  const headers = req.headers as Record<string, string | string[] | undefined>;
  return normalizeHeader(headers.authorization ?? headers.Authorization);
};

/**
 * SPA clients authenticate with Authorization: Bearer JWTs (not cookie sessions).
 * CSRF mainly protects cookie-based auth; skip when a Bearer token is present.
 * Cookie-session paths still require a matching x-csrf-token.
 */
export const generateCsrfToken = (userId: string | { toString(): string }): string => {
  const secret = process.env.JWT_SECRET || "test-secret";
  const hmac = createHmac("sha256", secret);
  hmac.update(String(userId));
  return hmac.digest("hex");
};

const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = getAuthorizationHeader(req);
  if (/^Bearer\s+\S+/i.test(authorization)) {
    next();
    return;
  }

  const providedToken = getProvidedToken(req);
  const userId = (req.user as { _id?: string | { toString(): string } } | undefined)?._id;

  if (!userId) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or missing CSRF token",
    });
    return;
  }

  if (!providedToken) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or missing CSRF token",
    });
    return;
  }

  const expectedToken = generateCsrfToken(userId);
  const providedBuffer = Buffer.from(providedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Invalid or missing CSRF token",
    });
    return;
  }

  next();
};

export default csrfMiddleware;
