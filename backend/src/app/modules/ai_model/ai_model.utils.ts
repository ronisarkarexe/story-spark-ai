import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
} from "@google/generative-ai";
import { fetchImageURL } from "../../../utils/image_generation";
import { generateStoryboardImage } from "../../../utils/storyboard_image_generation";
import { GenerationAbortedError } from "../../../utils/generation_timeout";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { IAlternateEnding, ICharacter } from "./ai_model.interface";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { sanitizeJsonText } from "@utils/sanitize_json";
import type {
  IStoryVisualizerPayload,
  IStoryVisualizerResult,
} from "../story_visualizer/story_visualizer.interface";
import {
  safeParseAIResponse,
  parseAIResponseOrThrow,
  GeminiStoriesWrapperSchema,
  RemixResponseSchema,
  TranslationResponseSchema,
} from "../ai";

// ... rest of your code ...
const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);
const MISSING_GEMINI_API_KEY_MESSAGE =
  "Gemini API key is not configured. Set GEMINI_API_KEY before using Gemini generation features.";

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-8b" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const assertGeminiApiKeyConfigured = (): void => {
  if (!geminiApiKey) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, MISSING_GEMINI_API_KEY_MESSAGE);
  }
};

interface Story {
  uuid?: string;
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
  language?: string;
  emotions?: string[];
  genre?: string;
  enhancedPrompt?: string;
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  Dark: "Write in a dark, gritty, and emotionally heavy tone.",
  Humorous: "Write in a light-hearted, witty, and comedic tone.",
  Romantic: "Write in a warm, tender, and emotionally rich tone.",
  Epic: "Write in a grand, dramatic, and heroic tone.",
  Mysterious: "Write in a suspenseful, atmospheric, and unsettling tone.",
  "Children's": "Write in a simple, wholesome, imaginative, and age-appropriate tone.",
};

const GENRE_MODIFIER_INSTRUCTIONS: Record<string, string> = {
  fantasy: "Write in the style of epic fantasy fiction.",
  horror: "Write in the style of psychological horror.",
  romance: "Write in the style of contemporary romance.",
  scifi: "Write in the style of science fiction.",
  mystery: "Write in the style of a mystery thriller.",
  childrens: "Write in the style of a children's picture book.",
};

const buildGenreInstruction = (genre?: string): string => {
  if (!genre || !GENRE_MODIFIER_INSTRUCTIONS[genre]) return "";
  return `Genre & Style Directive: ${GENRE_MODIFIER_INSTRUCTIONS[genre]}\n\n`;
};

const buildToneInstruction = (tone?: string): string => {
  if (!tone || !TONE_INSTRUCTIONS[tone]) return "";
  return `Tone & Style Directive: ${TONE_INSTRUCTIONS[tone]}\n\n`;
};

const throwIfAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) throw new GenerationAbortedError();
};

const buildCharactersInstruction = (characters?: ICharacter[]): string => {
  if (!characters || characters.length === 0) return "";
  const charsString = characters.map((c) => `- Name: ${c.name}, Role: ${c.role}, Traits: ${c.personality}`).join("\n");
  return `Cast of Characters:\n${charsString}\n\n`;
};

const executeWithRetryAndFallback = async <T>(
  operation: (activeModel: GenerativeModel) => Promise<T>,
  signal?: AbortSignal,
): Promise<T> => {
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      throwIfAborted(signal);
      return await operation(model);
    } catch (error: any) {
      if (signal?.aborted || error instanceof GenerationAbortedError) throw new GenerationAbortedError();
      const status = error?.status || error?.response?.status;
      if (!(status >= 500 || status === 429 || error?.message?.includes("fetch failed")) || attempt === maxRetries) break;
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
    }
  }
  try {
    throwIfAborted(signal);
    return await operation(fallbackModel);
  } catch (error: any) {
    if (signal?.aborted || error instanceof GenerationAbortedError) throw new GenerationAbortedError();
    throw error;
  }
};

// ... [Include your other functions here: generateWithGeminiStories, generateAlternateEndingsWithGemini, etc.]

export async function generateStoryboardWithGemini(
  payload: IStoryVisualizerPayload,
  signal?: AbortSignal,
): Promise<IStoryVisualizerResult> {
  throwIfAborted(signal);
  assertGeminiApiKeyConfigured();

  const { title, content, genre = "General", language = "English" } = payload;
  const prompt = `Analyze: ${title}, Genre: ${genre}. Extract 4-8 scenes. Return JSON: { "scenes": [...], "styleGuide": "..." }`;

  try {
    const result = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({ generationConfig, safetySettings });
      return chatSession.sendMessage(prompt, { signal });
    }, signal);

    const parsed = JSON.parse(sanitizeJsonText(result.response.text()));
    const scenes = parsed?.scenes;

    if (!Array.isArray(scenes) || scenes.length < 4 || scenes.length > 8) {
      throw new ApiError(httpStatus.BAD_GATEWAY, "Invalid AI response.");
    }

    const normalizedScenes = scenes.map((scene: any, index: number) => {
      if (!scene || typeof scene.caption !== "string" || typeof scene.imagePrompt !== "string") {
        throw new ApiError(httpStatus.BAD_GATEWAY, "Malformed scene.");
      }
      return {
        sceneNumber: index + 1,
        caption: scene.caption.trim(),
        imagePrompt: scene.imagePrompt.trim(),
      };
    });

    return { scenes: normalizedScenes, styleGuide: parsed.styleGuide.trim() };
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.BAD_GATEWAY, `Storyboard generation failed: ${error}`);
  }
}