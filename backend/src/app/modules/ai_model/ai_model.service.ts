import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import {
  GenerationTimeoutError,
  raceGenerationWithTimeout,
} from "../../../utils/generation_timeout";
import { timeoutLimit } from "../../../utils/timeout_limit";
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
  generateStoryContinuationMultipleWithGemini,
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
  characters: payload.characters ?? undefined,
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
const aiModelGenerate = async (payload: IAIModel, _token?: ITokenPayload, signal?: AbortSignal) => {
  const { prompt, wordLength, numStories, language, tone, genre, characters } =
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
          characters,
        ),
      AUTHENTICATED_GENERATION_TIMEOUT_MS,
      signal
    );
    assertSuccessfulGeneration(result, GENERATION_FAILED_MESSAGE);
    return result;
  } catch (error) {
    mapGenerationError(error, GENERATION_FAILED_MESSAGE);
  }
};

const aiFreeModelGenerate = async (payload: IAIModel, signal?: AbortSignal) => {
  const { prompt, wordLength, numStories, language, tone, genre, characters } =
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
          characters,
        ),
      FREE_GENERATION_TIMEOUT_MS,
      signal
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
  _token?: ITokenPayload,
  signal?: AbortSignal
) => {
  const { title, content, tag, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateAlternateEndingsWithGemini(title, content, tag, language, s),
      AUTHENTICATED_GENERATION_TIMEOUT_MS,
      signal
    );
    assertSuccessfulGeneration(result, ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    mapGenerationError(error, ALTERNATE_ENDING_FAILED_MESSAGE);
  }
};

const aiFreeModelAlternateEndings = async (payload: IAlternateEndingPayload, signal?: AbortSignal) => {
  const { title, content, tag, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateAlternateEndingsWithGemini(title, content, tag, language, s),
      FREE_GENERATION_TIMEOUT_MS,
      signal
    );
    assertSuccessfulGeneration(result, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    mapGenerationError(error, FREE_ALTERNATE_ENDING_FAILED_MESSAGE);
  }
};

const aiModelRemix = async (payload: IRemixPayload, _token?: ITokenPayload, signal?: AbortSignal) => {
  const { title, content, tag, remixType, remixOption = "", language = "English" } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateRemixWithGemini(title, content, tag, remixType, remixOption, language, s),
      AUTHENTICATED_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Remix generation failed.");
  }
};

const aiFreeModelRemix = async (payload: IRemixPayload, signal?: AbortSignal) => {
  const { title, content, tag, remixType, remixOption = "", language = "English" } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateRemixWithGemini(title, content, tag, remixType, remixOption, language, s),
      FREE_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Remix generation failed.");
  }
};

const aiModelTranslate = async (payload: ITranslatePayload, _token?: ITokenPayload, signal?: AbortSignal) => {
  const { title, content, targetLanguage } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      (s) => translateStoryWithGemini(title, content, targetLanguage, s),
      AUTHENTICATED_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Translation failed.");
  }
};

const aiFreeModelTranslate = async (payload: ITranslatePayload, signal?: AbortSignal) => {
  const { title, content, targetLanguage } = payload;
  try {
    const result = await raceGenerationWithTimeout(
      (s) => translateStoryWithGemini(title, content, targetLanguage, s),
      FREE_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Translation failed.");
  }
};

const aiModelStoryContinuation = async (
  payload: { prompt: string; language?: string },
  _token?: ITokenPayload,
  signal?: AbortSignal
) => {
  const { prompt, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateStoryContinuationWithGemini(prompt, language, s),
      AUTHENTICATED_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Story continuation failed.");
  }
};

const aiFreeStoryContinuation = async (payload: { prompt: string; language?: string }, signal?: AbortSignal) => {
  const { prompt, language = "English" } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateStoryContinuationWithGemini(prompt, language, s),
      FREE_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Story continuation failed.");
  }
};

const aiFreeStoryContinuationMultiple = async (
  payload: { prompt: string; language?: string; count?: number },
  signal?: AbortSignal
) => {
  const { prompt, language = "English", count = 3 } = payload;

  try {
    const result = await raceGenerationWithTimeout(
      (s) => generateStoryContinuationMultipleWithGemini(prompt, count, language, s),
      FREE_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "Story continuation generation failed.");
  }
};

const aiModelChat = async (payload: IChatPayload, _token?: ITokenPayload, signal?: AbortSignal) => {
  const { message, history = [] } = payload;

  try {
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const result = await raceGenerationWithTimeout(
      (s) => chatWithGemini(message, formattedHistory, s),
      AUTHENTICATED_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "AI chat failed.");
  }
};

const aiFreeModelChat = async (payload: IChatPayload, signal?: AbortSignal) => {
  const { message, history = [] } = payload;

  try {
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    }));

    const result = await raceGenerationWithTimeout(
      (s) => chatWithGemini(message, formattedHistory, s),
      FREE_GENERATION_TIMEOUT_MS,
      signal
    );
    return result;
  } catch (error) {
    mapGenerationError(error, "AI chat failed.");
  }
};

const generateCharacterProfile = async (story: string) => {
  try {
    const characterPrompt = `
Analyze the following story and extract all important characters.

For each character provide:
- name
- role
- personality
- strengths
- weaknesses
- relationships

Return the response only in JSON array format.

Story:
${story}
`;

    const result = await Promise.race([
      timeoutLimit(30000),
      generateWithGeminiStories(characterPrompt, 300, 1),
    ]);

    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.GATEWAY_TIMEOUT,
      "Failed to generate character profiles!"
    );
  }
};

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  generateCharacterProfile,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
  aiModelRemix,
  aiFreeModelRemix,
  aiModelTranslate,
  aiFreeModelTranslate,
  aiModelStoryContinuation,
  aiFreeStoryContinuation,
  aiFreeStoryContinuationMultiple,
  aiModelChat,
  aiFreeModelChat,
};
