import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
 main
import httpStatus from "http-status";

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

const AI_TIMEOUT_MS = 60000;
const AI_FREE_TIMEOUT_MS = 10000;

const aiModelGenerate = async (payload: IAIModel, token: ITokenPayload) => {
  const { prompt, wordLength, numStories, language } = payload;

 main

  try {
    const result = await raceGenerationWithTimeout(
      () => generateAlternateEndingsWithGemini(title, content, tag, language),
      AUTHENTICATED_GENERATION_TIMEOUT_MS
    );
    assertSuccessfulGeneration(result, ALTERNATE_ENDING_FAILED_MESSAGE);
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
 main
    );
  }
};

export const AiModelService = {
  aiModelGenerate,
  aiFreeModelGenerate,
  aiModelAlternateEndings,
  aiFreeModelAlternateEndings,
};
