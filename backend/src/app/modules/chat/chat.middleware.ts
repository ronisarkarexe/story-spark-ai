import { Request, Response, NextFunction } from "express";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { JwtHelpers } from "../../../utils/jwt.helper";
import chatRateLimiter from "../../middleware/chat.rate-limiter";

export const flexibleChatRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;

  const bearerToken =
    authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

  const cookieToken =
    (req as any).cookies?.accessToken ||
    (req as any).cookies?.token;

  const token = bearerToken || cookieToken;

  if (token) {
    try {
      const verifiedUser = JwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      if (verifiedUser) {
        req.user = verifiedUser;
        return next();
      }
    } catch {
      // Invalid token -> guest limiter
    }
  }

  return chatRateLimiter(req, res, next);
};