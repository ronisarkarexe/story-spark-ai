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
  ITranslatePayload,
} from "./ai_model.interface";
import {
  generateAlternateEndingsWithGemini,
  generateWithGeminiStories,
  generateRemixWithGemini,
  translateStoryWithGemini,
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
const TRANSLATION_FAILED_MESSAGE =
  "Story translation failed. Your request quota has been restored.";
const FREE_TRANSLATION_FAILED_MESSAGE =
  "Story translation failed. Your free generation quota has been restored.";

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

const executeGeneration = async <T>(
  generationFn: () => Promise<T>,
  timeout: number,
  errorMessage: string
): Promise<T> => {
  try {
    return await raceGenerationWithTimeout(
      () => generationFn(),
      timeout
    );
  } catch (error) {
    mapGenerationError(error, errorMessage);
    throw error;
  }
};

const generateWithQuota = async <T>(
  quotaFn: () => Promise<unknown>,
  generationFn: () => Promise<T>,
  timeout: number,
  errorMessage: string
): Promise<T> => {
  await quotaFn();
  return executeGeneration(generationFn, timeout, errorMessage);
};

const noopQuota = async (): Promise<void> => {};

const enforceMonthlyRequestLimit = async (email: string): Promise<any> => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
    await User.updateOne(
      { email, lastRequestDate: { $lt: firstDayOfMonth } },
      { $set: { requestsThisMonth: 0, lastRequestDate: currentDate } }
    );
  }

  const requestLimit =
    REQUEST_LIMITS[user.subscriptionType as keyof typeof REQUEST_LIMITS] || REQUEST_LIMITS.free;

  const updatedUser = await User.findOneAndUpdate(
    { email, requestsThisMonth: { $lt: requestLimit } },
    { $inc: { requestsThisMonth: 1 }, $set: { lastRequestDate: currentDate } },
    { new: true }
  );

  if (!updatedUser) throw new ApiError(httpStatus.CONFLICT, "Monthly request limit exceeded!");

  return updatedUser;
};

const aiModelGenerate = async (payload: IAIModel, token: ITokenPayload) => {
  const { prompt, wordLength, numStories, language } = normalizeStoryPayload(payload);
  const { email } = token;

  const stories = await generateWithQuota(
    () => enforceMonthlyRequestLimit(email),
    () => generateWithGeminiStories(prompt, wordLength, numStories, language),
    AUTHENTICATED_GENERATION_TIMEOUT_MS,
    GENERATION_FAILED_MESSAGE
  );

  assertSuccessfulGeneration(stories, GENERATION_FAILED_MESSAGE);
  return stories;
};

const aiFreeModelGenerate = async (payload: IAIModel) => {
  const { prompt, wordLength, numStories, language } = normalizeStoryPayload(payload);

  const stories = await generateWithQuota(
    noopQuota,
    () => generateWithGeminiStories(prompt, wordLength, numStories, language),
    FREE_GENERATION_TIMEOUT_MS,
    FREE_GENERATION_FAILED_MESSAGE
  );

  assertSuccessfulGeneration(stories, FREE_GENERATION_FAILED_MESSAGE);
  return stories;
};

const aiModelAlternateEndings = async (
  payload: IAlternateEndingPayload,
  token: ITokenPayload
) => {
  const { email } = token;
  const { title, content, tag, language = "English" } = payload;

  return generateWithQuota(
    () => enforceMonthlyRequestLimit(email),
    () => generateAlternateEndingsWithGemini(title, content, tag, language),
    AUTHENTICATED_GENERATION_TIMEOUT_MS,
    ALTERNATE_ENDING_FAILED_MESSAGE
  );
};

const aiFreeModelAlternateEndings = async (payload: IAlternateEndingPayload) => {
  const { title, content, tag, language = "English" } = payload;

  return generateWithQuota(
    noopQuota,
    () => generateAlternateEndingsWithGemini(title, content, tag, language),
    FREE_GENERATION_TIMEOUT_MS,
    FREE_ALTERNATE_ENDING_FAILED_MESSAGE
  );
};

const aiModelRemix = async (
  payload: IRemixPayload,
  _token: ITokenPayload
) => {
  const {
    title,
    content,
    tag,
    remixType,
    remixOption = "",
    language = "English",
  } = payload;

  return generateWithQuota(
    noopQuota,
    () =>
      generateRemixWithGemini(
        title,
        content,
        tag,
        remixType,
        remixOption,
        language
      ),
    AUTHENTICATED_GENERATION_TIMEOUT_MS,
    "Remix generation failed."
  );
};

const aiFreeModelRemix = async (payload: IRemixPayload) => {
  const {
    title,
    content,
    tag,
    remixType,
    remixOption = "",
    language = "English",
  } = payload;

  return generateWithQuota(
    noopQuota,
    () =>
      generateRemixWithGemini(
        title,
        content,
        tag,
        remixType,
        remixOption,
        language
      ),
    FREE_GENERATION_TIMEOUT_MS,
    "Remix generation failed."
  );
};

const aiModelTranslate = async (payload: ITranslatePayload, _token: ITokenPayload) => {
  const { title, content, targetLanguage } = payload;

  return generateWithQuota(
    noopQuota,
    () => translateStoryWithGemini(title, content, targetLanguage),
    AUTHENTICATED_GENERATION_TIMEOUT_MS,
    TRANSLATION_FAILED_MESSAGE
  );
};

const aiFreeModelTranslate = async (payload: ITranslatePayload) => {
  const { title, content, targetLanguage } = payload;

  return generateWithQuota(
    noopQuota,
    () => translateStoryWithGemini(title, content, targetLanguage),
    FREE_GENERATION_TIMEOUT_MS,
    FREE_TRANSLATION_FAILED_MESSAGE
  );
};

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
  aiModelRemix,
  aiFreeModelRemix,
  aiModelTranslate,
  aiFreeModelTranslate,
};
