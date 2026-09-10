import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { PLAN_QUOTAS } from "../../config/quota.config";
import { UsageRecord } from "../modules/ai_model/usageRecord.model";
import { QuotaRefundGuard } from "../modules/ai_model/quota.lifecycle";

export const enforceQuota = (action: "story_generate" | "story_continue") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User authentication required for this action.",
        });
      }

      const plan = user.subscriptionType || "free";
      const limitsForPlan = PLAN_QUOTAS[plan as keyof typeof PLAN_QUOTAS] || PLAN_QUOTAS.free;
      const limit = limitsForPlan[action];

      if (limit === Infinity) {
        return next();
      }

      const now = new Date();
      const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Atomic increment in MongoDB
      const record = await UsageRecord.findOneAndUpdate(
        { userId: user._id, action, billingPeriodStart },
        { $inc: { count: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (record.count > limit) {
        // Rollback the count increment since limit was exceeded
        await UsageRecord.updateOne(
          { userId: user._id, action, billingPeriodStart },
          { $inc: { count: -1 } }
        );

        return res.status(httpStatus.TOO_MANY_REQUESTS).json({
          success: false,
          error: "QUOTA_EXCEEDED",
          message: `Monthly quota exceeded for ${action.replace("_", " ")}.`,
          used: record.count - 1,
          limit,
          plan,
          resetsAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        });
      }

      // Create a refund guard. If the controller throws an error (e.g. AI generation fails),
      // the controller's catch block will invoke runWithQuotaCleanup which triggers this callback.
      res.locals.quotaRefundGuard = new QuotaRefundGuard(async () => {
        await UsageRecord.findOneAndUpdate(
          { userId: user._id, action, billingPeriodStart, count: { $gt: 0 } },
          { $inc: { count: -1 } }
        );
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
