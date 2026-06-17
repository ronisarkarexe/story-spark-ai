import { Request, Response, NextFunction } from "express";
import { sanitizeObjectStrings, sanitizeText } from "../../utils/sanitize.util";

/**
 * Middleware that sanitizes all string fields in req.body
 * to prevent XSS attacks at the HTTP layer.
 */
export const sanitizeBodyMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObjectStrings(req.body, sanitizeText);
  }
  next();
};

/**
 * Middleware that sanitizes all string fields in req.query
 * to prevent XSS through URL parameters.
 */
export const sanitizeQueryMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = sanitizeObjectStrings(req.query as Record<string, any>, sanitizeText);
    req.query = sanitizedQuery as any;
  }
  next();
};

/**
 * Combined middleware that sanitizes both body and query.
 * Apply this globally to all routes.
 */
export const sanitizeAllMiddleware = [
  sanitizeQueryMiddleware,
  sanitizeBodyMiddleware,
];