import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../utils/generation_timeout";
import {
  IAIModel,
  IAlternateEndingPayload,
} from "./ai_model.interface";
import {
  generateAlternateEndingsWithGemini,
  generateWithGeminiStories,
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

const aiModelGenerate = async (payload: IAIModel, _token: ITokenPayload) => {
  const { prompt, wordLength, numStories, language } =
    normalizeStoryPayload(payload);

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
    mapGenerationError(error, GENERATION_FAILED_MESSAGE);
  }
};

const aiFreeModelGenerate = async (payload: IAIModel) => {
  const { prompt, wordLength, numStories, language } =
    normalizeStoryPayload(payload);

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
  _token: ITokenPayload
) => {
  const { title, content, tag, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      () => generateAlternateEndingsWithGemini(title, content, tag, language),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
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

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
};
