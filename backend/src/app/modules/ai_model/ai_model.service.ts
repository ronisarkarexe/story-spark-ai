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
  IRemixPayload,
  ITranslatePayload,
  IChatPayload,
} from "./ai_model.interface";
import {
  generateAlternateEndingsWithGemini,
  generateWithGeminiStories,
  generateRemixWithGemini,
  generateStoryContinuationWithGemini,
  translateStoryWithGemini,
  chatWithGemini,
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
  tone: payload.tone ?? undefined,
  genre: payload.genre ?? undefined,
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

// Bug fix 1: quota.lifecycle owns rollback — no manual User.updateOne needed.
// Bug fix 2: _token kept as unused param (quota handled upstream by middleware).
const aiModelGenerate = async (payload: IAIModel, _token?: ITokenPayload) => {
  const { prompt, wordLength, numStories, language, tone, genre } =
    normalizeStoryPayload(payload);

  try {
    const result = await raceGenerationWithTimeout(
      (signal) =>
        generateWithGeminiStories(
          prompt,
          wordLength,
          numStories,
          language,
          signal,
          tone,
          genre,
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
  const { prompt, wordLength, numStories, language, tone, genre } =
    normalizeStoryPayload(payload);

  try {
    const result = await raceGenerationWithTimeout(
      (signal) =>
        generateWithGeminiStories(
          prompt,
          wordLength,
          numStories,
          language,
          signal,
          tone,
          genre,
        ),
      FREE_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, FREE_GENERATION_FAILED_MESSAGE);
    return result;
  } catch (error) {
    mapGenerationError(error, FREE_GENERATION_FAILED_MESSAGE);
  }
};

// Bug fix 3: migrated from old inline quota pattern to quota.lifecycle,
// consistent with aiModelGenerate and all other authenticated functions.
const aiModelAlternateEndings = async (
  payload: IAlternateEndingPayload,
  _token?: ITokenPayload
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

const aiModelRemix = async (payload: IRemixPayload, _token?: ITokenPayload) => {
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

const aiModelTranslate = async (payload: ITranslatePayload, _token?: ITokenPayload) => {
  const { title, content, targetLanguage } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      () => translateStoryWithGemini(title, content, targetLanguage),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Translation failed.");
  }
};

const aiFreeModelTranslate = async (payload: ITranslatePayload) => {
  const { title, content, targetLanguage } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      () => translateStoryWithGemini(title, content, targetLanguage),
      FREE_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Translation failed.");
  }
};

const aiFreeStoryContinuation = async (payload: { prompt: string; language?: string }) => {
  const { prompt, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (signal) => generateStoryContinuationWithGemini(prompt, language, signal),
      FREE_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Story continuation failed.");
  }
};

const aiModelChat = async (payload: IChatPayload, _token?: ITokenPayload) => {
  const { message, history = [] } = payload;

  try {
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const result = await raceGenerationWithTimeout(
      () => chatWithGemini(message, formattedHistory),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "AI chat failed.");
  }
};

const aiFreeModelChat = async (payload: IChatPayload) => {
  const { message, history = [] } = payload;

  try {
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const result = await raceGenerationWithTimeout(
      () => chatWithGemini(message, formattedHistory),
      FREE_GENERATION_TIMEOUT_MS
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "AI chat failed.");
  }
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
  aiFreeStoryContinuation,
  aiModelChat,
  aiFreeModelChat,
};
