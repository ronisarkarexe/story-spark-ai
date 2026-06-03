import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/api_error";
import { JwtHelpers } from "../../utils/jwt.helper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { UsageRecord } from "../modules/usage/usage.model";
import { PLAN_QUOTAS } from "../../config/quota.config";
import { QuotaAction } from "../modules/usage/usage.interface";
import { User } from "../modules/user/user.model";

const getFirstDayOfMonth = (referenceDate: Date = new Date()): Date =>
  new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);

const getLastDayOfMonth = (referenceDate: Date = new Date()): Date =>
  new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);

export const enforceQuota = (action: QuotaAction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization as string;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
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
      
      // Need full user document to get subscriptionType reliably
      const user = await User.findOne({ email: verifiedUser.email });
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }

      const limit = PLAN_QUOTAS[user.subscriptionType as keyof typeof PLAN_QUOTAS]?.[action] ?? 0;
      
      if (limit === Infinity) {
        return next();
      }

      const periodStart = getFirstDayOfMonth();
      
      // Atomically increment the count
      const record = await UsageRecord.findOneAndUpdate(
        { userId: user._id, action, billingPeriodStart: periodStart },
        { $inc: { count: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Check if the incremented count exceeds the limit
      if (record.count > limit) {
        // Rollback the increment since it was rejected
        await UsageRecord.updateOne(
          { userId: user._id, action, billingPeriodStart: periodStart },
          { $inc: { count: -1 } }
        );
        
        return res.status(429).json({
          success: false,
          error: "QUOTA_EXCEEDED",
          message: `You have exhausted your monthly quota for this action. Please upgrade your plan.`,
          used: record.count - 1,
          limit,
          plan: user.subscriptionType,
          resetsAt: getLastDayOfMonth(),
        });
      }
      
      // Attach info to response locals if needed downstream
      res.locals.user = user;
      
      next();
    } catch (err) {
      next(err);
    }
  };
};
