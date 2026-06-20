import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/api_error";
import { JwtHelpers } from "../../utils/jwt.helper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { reserveUserQuota } from "../modules/ai_model/quota.service";
import { createUserQuotaGuard } from "../modules/ai_model/quota.lifecycle";

const resolveAuthToken = (req: Request): string | null => {
  const authHeader = (req.headers.authorization || "") as string;
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  const bearerToken = authHeader.trim();
  if (bearerToken) {
    return bearerToken;
  }

  const cookieToken = (req as any).cookies?.accessToken || (req as any).cookies?.token;
  return cookieToken ?? null;
};

// Note: Actual quota/limit enforcement is handled by reserveUserQuota
// to allow for atomic MongoDB operations and rollback on failure.
// This middleware ensures the user is authenticated, reserves the quota atomically,
// and binds the QuotaRefundGuard to res.locals.quotaRefundGuard.
const checkRequestLimit =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userEmail: string | undefined = (req as any).user?.email;

      if (!userEmail) {
        const token = resolveAuthToken(req);
        if (!token) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized to access"
          );
        }

        const verifiedUser = JwtHelpers.verifyToken(
          token,
          config.jwt.secret as Secret
        );
        userEmail = (verifiedUser as any).email;
      }

      if (!userEmail) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Unable to resolve authenticated user email"
        );
      }

      await reserveUserQuota(userEmail);
      res.locals.quotaRefundGuard = createUserQuotaGuard(userEmail);

      next();
    } catch (err) {
      next(err);
    }
  };

export default checkRequestLimit;
