import { User } from "../user/user.model";
import { REQUEST_LIMITS } from "../../../interfaces/ai_model_request_limit";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { ITokenPayload } from "../../../interfaces/token";

const getMyUsage = async (token: ITokenPayload) => {
  const user = await User.findOne({
    email: token.email,
  });

  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User not found!"
    );
  }

  let limit = REQUEST_LIMITS.free;

  if (user.subscriptionType === "pro") {
    limit = REQUEST_LIMITS.pro;
  }

  if (user.subscriptionType === "premium") {
    limit = REQUEST_LIMITS.premium;
  }

  const billingPeriodStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const billingPeriodEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return {
    plan: user.subscriptionType,

    billingPeriodStart,

    billingPeriodEnd,

    actions: {
      story_generate: {
        used: user.requestsThisMonth,
        limit,
        remaining: limit - user.requestsThisMonth,
      },
    },
  };
};


export const UsageService = {
  getMyUsage,
};