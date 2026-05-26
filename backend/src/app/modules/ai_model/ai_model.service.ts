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
import httpStatus from "http-status";

const AUTHENTICATED_GENERATION_TIMEOUT_MS = 60000;
const FREE_GENERATION_TIMEOUT_MS = 10000;

const GENERATION_FAILED_MESSAGE =
  "Story generation failed. Your request quota has been restored.";
const FREE_GENERATION_FAILED_MESSAGE =
  "Story generation failed. Your free generation quota has been restored.";
const ALTERNATE_ENDING_FAILED_MESSAGE =
  "Alternate ending generation failed. Your request quota has been restored.";
const FREE_ALTERNATE_ENDING_FAILED_MESSAGE =
  "Alternate ending generation failed. Your free generation quota has been restored.";

const aiModelGenerate = async (payload: IAIModel, token: ITokenPayload) => {
  const { prompt, wordLength, numStories } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (signal) =>
        generateWithGeminiStories(prompt, wordLength, numStories, signal),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, GENERATION_FAILED_MESSAGE);
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof GenerationTimeoutError) {
      throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
    }
    throw new ApiError(httpStatus.BAD_GATEWAY, GENERATION_FAILED_MESSAGE);
  }
};

const aiFreeModelGenerate = async (payload: IAIModel) => {
  const { prompt } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (signal) => generateWithGeminiStories(prompt, 150, 2, signal),
      FREE_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, FREE_GENERATION_FAILED_MESSAGE);
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof GenerationTimeoutError) {
      throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
    }
    throw new ApiError(httpStatus.BAD_GATEWAY, FREE_GENERATION_FAILED_MESSAGE);
  }
};

const aiModelAlternateEndings = async (
  payload: IAlternateEndingPayload,
  _token: ITokenPayload
) => {
  const { title, content, tag } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      () => generateAlternateEndingsWithGemini(title, content, tag),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof GenerationTimeoutError) {
      throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
    }
    throw new ApiError(httpStatus.BAD_GATEWAY, ALTERNATE_ENDING_FAILED_MESSAGE);
  }
};

const aiFreeModelAlternateEndings = async (
  payload: IAlternateEndingPayload
) => {
  const { title, content, tag } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      () => generateAlternateEndingsWithGemini(title, content, tag),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof GenerationTimeoutError) {
      throw new ApiError(httpStatus.GATEWAY_TIMEOUT, "Request timed out!");
    }
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      FREE_ALTERNATE_ENDING_FAILED_MESSAGE
    );
  }
};

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
};
