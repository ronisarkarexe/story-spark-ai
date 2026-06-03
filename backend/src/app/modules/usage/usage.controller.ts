import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { UsageRecord } from "./usage.model";
import { User } from "../user/user.model";
import { PLAN_QUOTAS } from "../../../config/quota.config";

const getFirstDayOfMonth = (referenceDate: Date = new Date()): Date =>
  new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);

const getUsage = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user?.email;
  
  if (!userEmail) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not found in request",
      data: null,
    });
  }

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "User not found",
      data: null,
    });
  }

  const periodStart = getFirstDayOfMonth();

  // Fetch usage records for current month
  const usageRecords = await UsageRecord.find({
    userId: user._id,
    billingPeriodStart: periodStart,
  });

  const generateRecord = usageRecords.find(r => r.action === "story_generate");
  const continueRecord = usageRecords.find(r => r.action === "story_continue");

  const planQuotas = PLAN_QUOTAS[user.subscriptionType as keyof typeof PLAN_QUOTAS] || { story_generate: 0, story_continue: 0 };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Usage retrieved successfully",
    data: {
      plan: user.subscriptionType,
      usage: {
        story_generate: {
          used: generateRecord?.count || 0,
          limit: planQuotas.story_generate,
        },
        story_continue: {
          used: continueRecord?.count || 0,
          limit: planQuotas.story_continue,
        },
      },
      resetsAt: new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0, 23, 59, 59, 999),
    },
  });
});

export const UsageController = {
  getUsage,
};
