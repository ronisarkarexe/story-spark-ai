import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { REQUEST_LIMITS } from "../../../interfaces/ai_model_request_limit";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../utils/generation_timeout";
import {
  IAIModel,
  IAlternateEndingPayload,
  IRemixPayload,
} from "./ai_model.interface";
import {
  generateAlternateEndingsWithGemini,
  generateWithGeminiStories,
  generateRemixWithGemini,
} from "./ai_model.utils";
import { assertSuccessfulGeneration } from "./quota.lifecycle";

const AUTHENTICATED_GENERATION_TIMEOUT_MS = 60000;
const FREE_GENERATION_TIMEOUT_MS = 60000;

const GENERATION_FAILED_MESSAGE =
  "Story generation failed. Your request quota has been restored.";
const FREE_GENERATION_FAILED_MESSAGE =
  "Story generation failed. Your free generation quota has been restored.";
const ALTERNATE_ENDING_FAILED_MESSAGE =
  "Alternate ending generation failed. Your request quota has been restored.";
const FREE_ALTERNATE_ENDING_FAILED_MESSAGE =
  "Alternate ending generation failed. Your free generation quota has been restored.";

const normalizeStoryPayload = (payload: IAIModel) => ({
  prompt: payload.prompt,
  wordLength: payload.wordLength ?? 250,
  numStories: payload.numStories ?? 2,
  language: payload.language ?? "English",
});

const mapGenerationError = (error: unknown, message: string): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof GenerationTimeoutError) {
    throw new ApiError(
      httpStatus.GATEWAY_TIMEOUT,
      "AI generation timed out. Please try again."
    );
  }

  const errorMsg = error instanceof Error ? error.message : String(error);
  throw new ApiError(httpStatus.BAD_GATEWAY, `${message} (${errorMsg})`);
};

const aiModelGenerate = async (payload: IAIModel, token: ITokenPayload) => {
  const { email } = token;
  const { prompt, wordLength, numStories, language } = normalizeStoryPayload(payload);

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
    await User.updateOne(
      { email: email, lastRequestDate: { $lt: firstDayOfMonth } },
      { $set: { requestsThisMonth: 0, lastRequestDate: currentDate } }
    );
  }

  const requestLimit = REQUEST_LIMITS[user.subscriptionType as keyof typeof REQUEST_LIMITS] || REQUEST_LIMITS.free;

  const updatedUser = await User.findOneAndUpdate(
    { email: email, requestsThisMonth: { $lt: requestLimit } },
    { $inc: { requestsThisMonth: 1 }, $set: { lastRequestDate: currentDate } },
    { new: true }
  );

  if (!updatedUser) throw new ApiError(httpStatus.CONFLICT, "Monthly request limit exceeded!");

  try {
    const result = await raceGenerationWithTimeout(
      (signal) =>
        generateWithGeminiStories(
          prompt,
          wordLength,
          numStories,
          language,
          signal
        ),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, GENERATION_FAILED_MESSAGE);
    return result;
  } catch (error) {
    await User.updateOne({ email: email, requestsThisMonth: { $gt: 0 } }, { $inc: { requestsThisMonth: -1 } });
    mapGenerationError(error, GENERATION_FAILED_MESSAGE);
  }
};

const aiFreeModelGenerate = async (payload: IAIModel) => {
  const { prompt, wordLength, numStories, language } = normalizeStoryPayload(payload);

  try {
    const result = await raceGenerationWithTimeout(
      (signal) =>
        generateWithGeminiStories(
          prompt,
          wordLength,
          numStories,
          language,
          signal
        ),
      FREE_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, FREE_GENERATION_FAILED_MESSAGE);
    return result;
  } catch (error) {
    mapGenerationError(error, FREE_GENERATION_FAILED_MESSAGE);
  }
};

const aiModelAlternateEndings = async (
  payload: IAlternateEndingPayload,
  token: ITokenPayload
) => {
  const { email } = token;
  const { title, content, tag, language = "English" } = payload;

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
    await User.updateOne(
      { email: email, lastRequestDate: { $lt: firstDayOfMonth } },
      { $set: { requestsThisMonth: 0, lastRequestDate: currentDate } }
    );
  }

  const requestLimit = REQUEST_LIMITS[user.subscriptionType as keyof typeof REQUEST_LIMITS] || REQUEST_LIMITS.free;
  const updatedUser = await User.findOneAndUpdate(
    { email: email, requestsThisMonth: { $lt: requestLimit } },
    { $inc: { requestsThisMonth: 1 }, $set: { lastRequestDate: currentDate } },
    { new: true }
  );

  if (!updatedUser) throw new ApiError(httpStatus.CONFLICT, "Monthly request limit exceeded!");

  try {
    const result = await raceGenerationWithTimeout(
      () => generateAlternateEndingsWithGemini(title, content, tag, language),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    await User.updateOne({ email: email, requestsThisMonth: { $gt: 0 } }, { $inc: { requestsThisMonth: -1 } });
    mapGenerationError(error, ALTERNATE_ENDING_FAILED_MESSAGE);
  }
};

const aiFreeModelAlternateEndings = async (payload: IAlternateEndingPayload) => {
  const { title, content, tag, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      () => generateAlternateEndingsWithGemini(title, content, tag, language),
      FREE_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    mapGenerationError(error, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
  }
};

const aiModelRemix = async (payload: IRemixPayload, _token: ITokenPayload) => {
  const { title, content, tag, remixType, remixOption = "", language = "English" } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      () => generateRemixWithGemini(title, content, tag, remixType, remixOption, language),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Remix generation failed.");
  }
};

const aiFreeModelRemix = async (payload: IRemixPayload) => {
  const { title, content, tag, remixType, remixOption = "", language = "English" } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      () => generateRemixWithGemini(title, content, tag, remixType, remixOption, language),
      FREE_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Remix generation failed.");
  }
};

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
  aiModelRemix,
  aiFreeModelRemix,
};
