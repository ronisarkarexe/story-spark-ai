import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { fetchImageURL } from "../../../utils/image_generation";
import { GenerationAbortedError } from "../../../utils/generation_timeout";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { IAlternateEnding } from "./ai_model.interface";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);
const MISSING_GEMINI_API_KEY_MESSAGE =
  "Gemini API key is not configured. Set GEMINI_API_KEY before using Gemini generation features.";

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

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
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      MISSING_GEMINI_API_KEY_MESSAGE
    );
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

const throwIfAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) {
    throw new GenerationAbortedError();
  }
};

const sanitizeJsonText = (rawText: string): string => {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
};

// ─── GENRE SUPPORT (NEW) ────────────────────────────────────────────────────

// Genre-specific writing guidance injected into the Gemini prompt so each
// genre produces distinctly themed output (acceptance criterion 3).
export const GENRE_STYLE_GUIDES: Record<string, string> = {
  Horror:
    "Write with a dark, suspenseful tone. Build dread gradually through unsettling imagery, an ominous atmosphere, and mounting tension, leading to a frightening or unnerving climax.",
  Romance:
    "Center the narrative on emotional connection and the development of a romantic relationship between characters. Use warm, intimate, emotionally expressive language and focus on feelings, chemistry, and personal growth.",
  "Sci-Fi":
    "Set the story in a futuristic, technology-driven, or speculative world. Incorporate scientific concepts, advanced technology, or space/future settings, and explore their impact on the characters.",
  Fantasy:
    "Build a richly imagined world featuring magic, mythical creatures, or fantastical elements. Emphasize wonder, adventure, and high stakes within this magical setting.",
  Mystery:
    "Construct the narrative around an intriguing puzzle or crime. Plant clues, build suspense, and work toward a satisfying reveal or twist, using an investigative or detective tone.",
  Drama:
    "Focus on realistic, emotionally resonant character conflicts and relationships. Emphasize emotional depth, personal stakes, and meaningful character growth.",
  Comedy:
    "Use a lighthearted, humorous tone with witty dialogue, comedic situations, or absurd scenarios designed to entertain and amuse.",
  Adventure:
    "Center the story on an exciting journey or quest, filled with action, exploration, and a sense of discovery or danger.",
};

// Strips emoji and symbols (e.g. "😱 Horror" → "Horror") so genre labels
// match GENRE_STYLE_GUIDES regardless of how they were supplied by the frontend.
const normalizeGenreLabel = (value: string): string =>
  value.replace(/[^\p{L}\p{N}\- ]/gu, "").trim();

// The frontend embeds the chosen genre as a "[Genre: X]" prefix on the prompt.
// Detect it so genre-aware prompting works even without an explicit `genre` field.
const extractGenreFromPrompt = (prompt: string): string | undefined => {
  const match = prompt.match(/^\[Genre:\s*([^\]]+)\]/i);
  return match ? normalizeGenreLabel(match[1]) : undefined;
};

// Resolves an explicit genre (or one embedded in the prompt) to a concrete
// writing-style instruction. Returns undefined for unknown/missing genres.
export const resolveGenreInstruction = (
  genre: string | undefined,
  prompt: string
): string | undefined => {
  const candidate = genre
    ? normalizeGenreLabel(genre)
    : extractGenreFromPrompt(prompt);

  if (!candidate) return undefined;

  const styleGuide = GENRE_STYLE_GUIDES[candidate];
  if (!styleGuide) return undefined;

  return `The story must clearly fit the "${candidate}" genre. ${styleGuide}`;
};

// ─── STORY GENERATION ───────────────────────────────────────────────────────

export async function generateWithGeminiStories(
  prompt: string,
  wordLength: number = 250,
  numStories: number = 2,
  language: string = "English",
  genre?: string,        // ← ADDED
  signal?: AbortSignal
): Promise<Story[]> {
  throwIfAborted(signal);

  assertGeminiApiKeyConfigured();

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // Build optional genre instruction line injected into the prompt
    const genreInstruction = resolveGenreInstruction(genre, prompt);
    const genreInstructionLine = genreInstruction
      ? `\n        ${genreInstruction}`
      : "";

    const response = await chatSession.sendMessage(
      `You are an expert storyteller and emotion analyst. The user provided the following base prompt: "${prompt}".
        First, enhance this prompt to be more emotionally engaging and context-sensitive (e.g., add suspense, joy, or mystery).
        Then, generate ${numStories} different short stories based on this ENHANCED prompt.
        The stories MUST be written entirely in the ${language} language.${genreInstructionLine}
        For each story, also analyze and detect the primary emotional tones (e.g., ["Joy", "Suspense", "Motivation"]) and the specific genre.
        Each story should be in JSON format with fields: "title", "content", "tag" (the main topic), "emotions" (an array of strings), "genre" (a string), and "enhancedPrompt" (the improved prompt used).
        Ensure each story is approximately ${wordLength} words long.
        Return only valid JSON array output.`
    );

    throwIfAborted(signal);

    const text = response.response.text();
    const parsed = JSON.parse(sanitizeJsonText(text));
    const stories: Story[] = Array.isArray(parsed) ? parsed : parsed?.stories;

    if (!Array.isArray(stories) || stories.length === 0) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: Expected a non-empty story array."
      );
    }

    // Fetch images for stories concurrently
    const imagePromises = stories.map(async (story) => {
      try {
        const imageResponse = await fetchImageURL(String(story?.tag ?? story?.title ?? ""));
        return imageResponse?.imageUrl || "";
      } catch (e) {
        return "";
      }
    });

    const imageUrls = await Promise.all(imagePromises);

    return stories.map((story, index) => ({
      ...story,
      language,
      imageURL: imageUrls[index],
      uuid: uuidv4(),
    }));
  } catch (error: unknown) {
    if (error instanceof ApiError || error instanceof GenerationAbortedError) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI story generation failed: ${errorMsg}`
    );
  }
}

// ─── ALTERNATE ENDINGS (UNCHANGED) ──────────────────────────────────────────

export async function generateAlternateEndingsWithGemini(
  title: string,
  content: string,
  tag: string,
  language: string = "English"
): Promise<IAlternateEnding[]> {
  assertGeminiApiKeyConfigured();

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
    const response = await chatSession.sendMessage(
      `You are a professional narrative editor. Analyze the following story (Title: "${title}", Genre/Tag: "${tag}", Language: "${language}"):
      Story Content:
      "${content}"
      
      Generate 5 alternate endings for this story corresponding to the following styles:
      1. "Happy Ending"
      2. "Dark Ending"
      3. "Plot Twist Ending"
      4. "Open Ending"
      5. "Cliffhanger Ending"
      
      The generated alternate endings and the rewritten stories MUST be written entirely in the ${language} language.
      For each alternate ending, provide:
      - "style": The style name exactly as listed above.
      - "ending": A short paragraph or two describing the alternate ending scene itself.
      - "fullStory": The complete rewritten story with this new ending seamlessly integrated. The new ending should replace the original ending of the story, preserving the original story's context, setup, character names, and writing tone.
      
      Return the output as a JSON array of objects with the fields: "style", "ending", and "fullStory".`
    );
    const text = response.response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(sanitizeJsonText(text));
    } catch (parseError: unknown) {
      const parseErrorMsg = parseError instanceof Error ? parseError.message : String(parseError);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Gemini returned invalid JSON for alternate endings: ${parseErrorMsg}`
      );
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid AI response: Expected a non-empty JSON array."
      );
    }

    const isValid = parsed.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.style === "string" &&
        typeof item.ending === "string" &&
        typeof item.fullStory === "string"
    );

    if (!isValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid AI response: Alternate endings are malformed."
      );
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI generation of alternate endings failed: ${errorMsg}`
    );
  }
}

// ─── REMIX (UNCHANGED) ──────────────────────────────────────────────────────

export async function generateRemixWithGemini(
  title: string,
  content: string,
  tag: string,
  remixType: string,
  remixOption: string,
  language: string = "English"
): Promise<{ title: string; content: string; tag: string }> {
  const remixPrompts: Record<string, string> = {
    setting: `Rewrite this story keeping the same plot and characters but change the setting to: ${remixOption}. Keep the same story structure.`,
    perspective: `Rewrite this story from the perspective of: ${remixOption}. Keep the same events but show them from this character's point of view.`,
    time_period: `Rewrite this story keeping the same plot but set it in: ${remixOption}. Adjust all details to fit the time period.`,
    tone: `Rewrite this story keeping the same plot but change the tone to: ${remixOption}. Adjust the writing style accordingly.`,
    gender_swap: `Rewrite this story with all characters gender-swapped. Keep the same plot and events.`,
  };

  const remixInstruction = remixPrompts[remixType] || remixPrompts.tone;

  const prompt = `You are a creative writing assistant. Here is a story:

Title: ${title}
Content: ${content}
Genre: ${tag}

Task: ${remixInstruction}

Write the remixed story in ${language}. Return a JSON object with this exact structure:
{
  "title": "remixed story title",
  "content": "full remixed story content",
  "tag": "${tag}"
}`;

  try {
    const chatSession = model.startChat({
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 4096,
      },
      safetySettings,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const rawText = result.response.text();
    const cleanText = sanitizeJsonText(rawText);
    const parsed = JSON.parse(cleanText);

    if (!parsed.title || !parsed.content) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid remix response from AI.");
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI remix generation failed: ${errorMsg}`
    );
  }
}

// ─── TRANSLATE (UNCHANGED) ──────────────────────────────────────────────────

export async function translateStoryWithGemini(
  title: string,
  content: string,
  targetLanguage: string
): Promise<{ title: string; content: string }> {
  const prompt = `You are a professional translator. Translate the following story into ${targetLanguage}.

Title: ${title}
Content: ${content}

Return a JSON object with this exact structure:
{
  "title": "translated title in ${targetLanguage}",
  "content": "translated content in ${targetLanguage}"
}

Preserve the story's tone, style and meaning. Only translate — do not modify the story.`;

  try {
    const chatSession = model.startChat({
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 4096,
      },
      safetySettings,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const rawText = result.response.text();
    const cleanText = sanitizeJsonText(rawText);
    const parsed = JSON.parse(cleanText);

    if (!parsed.title || !parsed.content) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid translation response from AI.");
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI translation failed: ${errorMsg}`
    );
  }
}