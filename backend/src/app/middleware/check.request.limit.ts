import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/api_error";
import { JwtHalers } from "../../utils/jwt.helper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { reserveUserQuota } from "../modules/ai_model/quota.service";
import { createUserQuotaGuard } from "../modules/ai_model/quota.lifecycle";
import { User } from "../modules/user/user.model";

// Note: Actual quota/limit enforcement is handled by reserveUserQuota
// to allow for atomic MongoDB operations and rollback on failure.
// This middleware ensures the user is authenticated, reserves the quota atomically,
// and binds the QuotaRefundGuard to res.locals.quotaRefundGuard.
const checkRequestLimit =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access"
        );
      }
      const verifiedUser = JwtHalers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      // Validate JWT tokenVersion against DB
      const user = await User.findById(verifiedUser._id);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      if (verifiedUser.tokenVersion === undefined || verifiedUser.tokenVersion !== user.tokenVersion) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Session expired, please login again"
        );
      }

      // Atomically reserve the monthly quota for the user
      await reserveUserQuota(userEmail);

      // Create and attach the quota refund guard to res.locals
      res.locals.quotaRefundGuard = createUserQuotaGuard(userEmail);

      next();
    } catch (err) {
      next(err);
    }
  };

export default checkRequestLimit;
