import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { timeoutLimit } from "../../../utils/timeout_limit";
import { User } from "../user/user.model";
import { IAIModel, IAlternateEndingPayload } from "./ai_model.interface";
import { generateWithGeminiStories, generateAlternateEndingsWithGemini } from "./ai_model.utils";
import httpStatus from "http-status";
import { REQUEST_LIMITS } from "../../../interfaces/ai_model_request_limit";


const aiModelGenerate = async (payload: IAIModel, token: ITokenPayload) => {
  const { email } = token;
  const { prompt, wordLength, numStories } = payload;

  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // Idempotent monthly reset
  if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
    await User.updateOne(
      { email: email, lastRequestDate: { $lt: firstDayOfMonth } },
      { $set: { requestsThisMonth: 0, lastRequestDate: currentDate } }
    );
  }

  const requestLimit =
    REQUEST_LIMITS[user.subscriptionType as keyof typeof REQUEST_LIMITS] || REQUEST_LIMITS.free;

  // Atomic quota reservation
  const updatedUser = await User.findOneAndUpdate(
    {
      email: email,
      requestsThisMonth: { $lt: requestLimit },
    },
    {
      $inc: { requestsThisMonth: 1 },
      $set: { lastRequestDate: currentDate },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(httpStatus.CONFLICT, "Monthly request limit exceeded!");
  }

  try {
    const result = await Promise.race([
      timeoutLimit(60000),
      generateWithGeminiStories(prompt, wordLength, numStories),
    ]);

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Generation failed or returned empty results.");
    }
    return result;
  } catch (error) {
    // Rollback quota
    await User.updateOne(
      { email: email, requestsThisMonth: { $gt: 0 } },
      { $inc: { requestsThisMonth: -1 } }
    );
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Generation failed!");
  }
};

const aiFreeModelGenerate = async (payload: IAIModel) => {
  try {
    const { prompt } = payload;
    const result = await Promise.race([
      timeoutLimit(10000),
      generateWithGeminiStories(prompt, 150),
    ]);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
  }
};

const aiModelAlternateEndings = async (
  payload: IAlternateEndingPayload,
  token: ITokenPayload
) => {
  try {
    const { email } = token;
    const { title, content, tag } = payload;
    const result = await Promise.race([
      timeoutLimit(60000),
      generateAlternateEndingsWithGemini(title, content, tag),
    ]);

    if (result) {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
      }

      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
        user.requestsThisMonth = 0;
        user.lastRequestDate = currentDate;
      }

      user.requestsThisMonth += 1;
      user.lastRequestDate = currentDate;
      await user.save();
    }
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
  }
};

const aiFreeModelAlternateEndings = async (payload: IAlternateEndingPayload) => {
  try {
    const { title, content, tag } = payload;
    const result = await Promise.race([
      timeoutLimit(60000),
      generateAlternateEndingsWithGemini(title, content, tag),
    ]);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
  }
};

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
};

