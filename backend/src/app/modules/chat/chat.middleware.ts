import { Request, Response, NextFunction } from "express";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { JwtHelpers } from "../../../utils/jwt.helper";
import chatRateLimiter from "../../middleware/chat.rate-limiter";

export const flexibleChatRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      // Try to verify token. If successful, bypass guest rate limiting.
      const verifiedUser = JwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      if (verifiedUser) {
        req.user = verifiedUser; // Attach verified user to request
        return next();
      }
    } catch (err) {
      // Token is invalid/expired. Fallback to guest rate limiting.
    }
  }

  // Guest or invalid token: apply guest rate limiting
  return chatRateLimiter(req, res, next);
};
