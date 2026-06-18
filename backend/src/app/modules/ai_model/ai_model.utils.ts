import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { fetchImageURL } from "../../../utils/image_generation";
import { generateStoryboardImage } from "../../../utils/storyboard_image_generation";
import { GenerationAbortedError } from "../../../utils/generation_timeout";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { IAlternateEnding, ICharacter } from "./ai_model.interface";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import type {
  IStoryVisualizerPayload,
  IStoryVisualizerResult,
} from "../story_visualizer/story_visualizer.interface";

const geminiApiKey = config.gemini_api_key?.trim() ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);
const MISSING_GEMINI_API_KEY_MESSAGE =
  "Gemini API key is not configured. Set GEMINI_API_KEY before using Gemini generation features.";

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const fallbackModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-8b",
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
      MISSING_GEMINI_API_KEY_MESSAGE,
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

// NEW: Map each tone label to a precise writing instruction injected into the AI prompt.
// Keeping these as concrete directives (not vague adjectives) gives Gemini clear stylistic targets.
const TONE_INSTRUCTIONS: Record<string, string> = {
  Dark: "Write in a dark, gritty, and emotionally heavy tone. Explore themes of shadow, loss, moral ambiguity, and consequence. Avoid happy resolutions — let tension linger.",
  Humorous:
    "Write in a light-hearted, witty, and comedic tone. Include clever wordplay, funny observations, and absurd situations. Keep the mood playful throughout.",
  Romantic:
    "Write in a warm, tender, and emotionally rich tone. Focus on connection, longing, vulnerability, and heartfelt moments between characters.",
  Epic: "Write in a grand, dramatic, and heroic tone. Use vivid, sweeping imagery, high stakes, and bold character actions. Every sentence should feel consequential.",
  Mysterious:
    "Write in a suspenseful, atmospheric, and unsettling tone. Leave things deliberately unsaid. Build intrigue through detail and implication rather than exposition.",
  "Children's":
    "Write in a simple, wholesome, imaginative, and age-appropriate tone. Use short sentences, gentle humour, and a sense of wonder. Suitable for readers aged 5–10.",
};

/**
 * Returns the tone instruction string for injection into the prompt,
 * or an empty string if no tone (or an unrecognised tone) is supplied.
 */
const GENRE_MODIFIER_INSTRUCTIONS: Record<string, string> = {
  fantasy:
    "Write in the style of epic fantasy fiction. Include vivid world-building, magic, and heroic themes.",
  horror:
    "Write in the style of psychological horror. Build dread slowly, use dark imagery, and leave an unsettling feeling.",
  romance:
    "Write in the style of contemporary romance. Focus on emotional tension, character chemistry, and satisfying resolution.",
  scifi:
    "Write in the style of science fiction. Ground the story in plausible technology or speculative concepts.",
  mystery:
    "Write in the style of a mystery thriller. Plant subtle clues, build suspense, and deliver a reveal.",
  childrens:
    "Write in the style of a children's picture book. Use simple language, a warm tone, and a clear moral.",
};

const buildGenreInstruction = (genre?: string): string => {
  if (!genre) return "";
  const instruction = GENRE_MODIFIER_INSTRUCTIONS[genre];
  if (!instruction) return "";
  return `Genre & Style Directive: ${instruction}\n\n`;
};

const buildToneInstruction = (tone?: string): string => {
  if (!tone) return "";
  const instruction = TONE_INSTRUCTIONS[tone];
  if (!instruction) return "";
  return `Tone & Style Directive: ${instruction}\n\n`;
};

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

const buildCharactersInstruction = (characters?: ICharacter[]): string => {
  if (!characters || characters.length === 0) return "";
  const charsString = characters
    .map(
      (c) =>
        `- Name: ${c.name}, Role: ${c.role}, Personality/Traits: ${c.personality}`,
    )
    .join("\n");
  return `Cast of Characters (You MUST incorporate these characters into all generated stories and maintain their roles, relationship dynamics, and traits consistently):\n${charsString}\n\n`;
};

import { GenerativeModel } from "@google/generative-ai";

const executeWithRetryAndFallback = async <T>(
  operation: (activeModel: GenerativeModel) => Promise<T>,
  signal?: AbortSignal,
): Promise<T> => {
  const maxRetries = 2;
  const baseDelayMs = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      throwIfAborted(signal);
      return await operation(model);
    } catch (error: any) {
      if (
        signal?.aborted ||
        error instanceof GenerationAbortedError ||
        error?.name === "AbortError"
      ) {
        throw new GenerationAbortedError();
      }

      const status = error?.status || error?.response?.status;
      const isRetryable =
        status >= 500 ||
        status === 429 ||
        error?.message?.includes("fetch failed");

      if (!isRetryable || attempt === maxRetries) {
        break; // Break to try fallback
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  // Fallback to the smaller model
  try {
    throwIfAborted(signal);
    return await operation(fallbackModel);
  } catch (fallbackError: any) {
    if (
      signal?.aborted ||
      fallbackError instanceof GenerationAbortedError ||
      fallbackError?.name === "AbortError"
    ) {
      throw new GenerationAbortedError();
    }
    throw fallbackError;
  }
};

export async function generateWithGeminiStories(
  prompt: string,
  wordLength: number = 250,
  numStories: number = 2,
  language: string = "English",
  signal?: AbortSignal,
  tone?: string, // NEW: optional tone parameter
  genre?: string, // NEW: optional genre parameter
  characters?: ICharacter[],
): Promise<Story[]> {
  throwIfAborted(signal);

  assertGeminiApiKeyConfigured();

  try {
    const genreInstruction = buildGenreInstruction(genre);
    const toneInstruction = buildToneInstruction(tone);
    const charactersInstruction = buildCharactersInstruction(characters);

    const response = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      return chatSession.sendMessage(
        `${buildGenreInstruction(genre)}${buildToneInstruction(tone)}${buildCharactersInstruction(characters)}You are an expert storyteller and emotion analyst. The user provided the following base prompt: "${prompt}".
        First, enhance this prompt to be more emotionally engaging and context-sensitive (e.g., add suspense, joy, or mystery).
        Then, generate ${numStories} different short stories based on this ENHANCED prompt.
        The stories MUST be written entirely in the ${language} language.
        For each story, also analyze and detect the primary emotional tones (e.g., ["Joy", "Suspense", "Motivation"]) and the specific genre.
        Each story should be in JSON format with fields: "title", "content", "tag" (the main topic), "emotions" (an array of strings), "genre" (a string), and "enhancedPrompt" (the improved prompt).
        Ensure each story is approximately ${wordLength} words long.
        Return only valid JSON array output.`,
        { signal },
      );
    }, signal);

    throwIfAborted(signal);

    const text = response.response.text();
    const parsed = JSON.parse(sanitizeJsonText(text));
    const stories: Story[] = Array.isArray(parsed) ? parsed : parsed?.stories;

    if (!Array.isArray(stories) || stories.length === 0) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: Expected a non-empty story array.",
      );
    }

    // Fetch images for stories concurrently
    const imagePromises = stories.map(async (story) => {
      try {
        const imageResponse = await fetchImageURL(
          String(story?.tag ?? story?.title ?? ""),
          signal,
        );
        return imageResponse?.imageUrl || "";
      } catch (e) {
        return "";
      }
    });

    // Fetch cover images for stories sequentially
    const coverImages: string[] = [];
    for (const story of stories) {
      try {
        const promptTitle = story?.title
          ? story.title
          : story?.tag
            ? story.tag
            : "Untitled";
        const promptTag = story?.tag || "General";
        const generated = await generateStoryboardImage(
          `Cover illustration for a book titled: ${promptTitle}. Theme: ${promptTag}. Style: cinematic, detailed`,
          signal,
        );
        if (generated) {
          coverImages.push(generated);
          continue;
        }
        const imageResponse = await fetchImageURL(
          String(story?.title ?? story?.tag ?? ""),
          signal,
        );
        coverImages.push(imageResponse?.imageUrl || "");
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        const logTitle = story?.title || story?.tag || "Unknown Story";
        console.error(
          `[AI] Failed to generate cover image for "${logTitle}": ${errorMsg}`,
        );
        coverImages.push("");
      }
    }

    const imageUrls = await Promise.all(imagePromises);

    return stories.map((story, index) => ({
      ...story,
      language,
      imageURL: imageUrls[index],
      coverImage: coverImages[index],
      uuid: uuidv4(),
    }));
  } catch (error: unknown) {
    if (error instanceof ApiError || error instanceof GenerationAbortedError) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI story generation failed: ${errorMsg}`,
    );
  }
}

export async function generateAlternateEndingsWithGemini(
  title: string,
  content: string,
  tag: string,
  language: string = "English",
  signal?: AbortSignal,
): Promise<IAlternateEnding[]> {
  throwIfAborted(signal);
  assertGeminiApiKeyConfigured();

  try {
    const response = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });
      return chatSession.sendMessage(
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
        - "fullStory": The complete rewritten story with this new ending seamlessly integrated. The new ending should replace the original ending of the story, preserving the original story's context.
        
        Return the output as a JSON array of objects with the fields: "style", "ending", and "fullStory".`,
        { signal },
      );
    }, signal);
    throwIfAborted(signal);
    const text = response.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(sanitizeJsonText(text));
    } catch (parseError: unknown) {
      const parseErrorMsg =
        parseError instanceof Error ? parseError.message : String(parseError);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Gemini returned invalid JSON for alternate endings: ${parseErrorMsg}`,
      );
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid AI response: Expected a non-empty JSON array.",
      );
    }

    const isValid = parsed.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as Record<string, unknown>).style === "string" &&
        typeof (item as Record<string, unknown>).ending === "string" &&
        typeof (item as Record<string, unknown>).fullStory === "string",
    );

    if (!isValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid AI response: Alternate endings are malformed.",
      );
    }

    return parsed as IAlternateEnding[];
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI generation of alternate endings failed: ${errorMsg}`,
    );
  }
}

export async function generateWithGeminiStoriesStream(
  prompt: string,
  wordLength: number = 250,
  numStories: number = 2,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) {
    throw new GenerationAbortedError();
  }

  const streamingConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  try {
    const result = await executeWithRetryAndFallback(async (activeModel) => {
      return activeModel.generateContentStream(
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate ${numStories} different short stories based on the following prompt: "${prompt}".
                Each story should be in JSON format with fields: "title", "content", and "tag".
                Ensure each story is approximately ${wordLength} words long.
                Return the output as a JSON array.`,
                },
              ],
            },
          ],
          generationConfig: streamingConfig,
          safetySettings,
        },
        { signal },
      );
    }, signal);

    for await (const chunk of result.stream) {
      if (signal?.aborted) {
        throw new GenerationAbortedError();
      }
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error: unknown) {
    if (error instanceof ApiError || error instanceof GenerationAbortedError) {
      throw error;
    }
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI streaming generation failed: ${errorMsg}`,
    );
  }
}
export async function generateRemixWithGemini(
  title: string,
  content: string,
  tag: string,
  remixType: string,
  remixOption: string,
  language: string = "English",
  signal?: AbortSignal,
): Promise<{ title: string; content: string; tag: string }> {
  throwIfAborted(signal);
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
    const result = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 4096,
        },
        safetySettings,
        history: [],
      });
      return chatSession.sendMessage(prompt, { signal });
    }, signal);
    const rawText = result.response.text();
    const cleanText = sanitizeJsonText(rawText);
    const parsed = JSON.parse(cleanText);

    if (!parsed.title || !parsed.content) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid remix response from AI.",
      );
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI remix generation failed: ${errorMsg}`,
    );
  }
}

export async function generateStoryContinuationWithGemini(
  storyContext: string,
  language: string = "English",
  signal?: AbortSignal,
): Promise<{ continuation: string }> {
  throwIfAborted(signal);
  assertGeminiApiKeyConfigured();

  try {
    const response = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 2048,
        },
        safetySettings,
        history: [],
      });

      return chatSession.sendMessage(
        `You are an expert storyteller. The user has written the following story so far:

"${storyContext}"

Continue this story naturally with 2-4 paragraphs that maintain the same tone, style, and narrative direction. The continuation MUST be written entirely in ${language}.

Return only valid JSON with this exact structure:
{
  "continuation": "your continuation text here"
}`,
        { signal },
      );
    }, signal);

    throwIfAborted(signal);

    const text = response.response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(sanitizeJsonText(text));
    } catch (parseError: unknown) {
      const parseErrorMsg =
        parseError instanceof Error ? parseError.message : String(parseError);
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        `Invalid AI response: failed to parse JSON (${parseErrorMsg})`,
      );
    }

    if (!parsed.continuation || typeof parsed.continuation !== "string") {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: Expected a continuation string.",
      );
    }

    return { continuation: parsed.continuation };
  } catch (error: unknown) {
    if (error instanceof ApiError || error instanceof GenerationAbortedError) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI story continuation failed: ${errorMsg}`,
    );
  }
}

export async function translateStoryWithGemini(
  title: string,
  content: string,
  targetLanguage: string,
  signal?: AbortSignal,
): Promise<{ title: string; content: string }> {
  throwIfAborted(signal);
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
    const result = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 4096,
        },
        safetySettings,
        history: [],
      });
      return chatSession.sendMessage(prompt, { signal });
    }, signal);
    const rawText = result.response.text();
    const cleanText = sanitizeJsonText(rawText);
    const parsed = JSON.parse(cleanText);

    if (!parsed.title || !parsed.content) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid translation response from AI.",
      );
    }

    return parsed;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI translation failed: ${errorMsg}`,
    );
  }
}

export async function generateStoryboardWithGemini(
  payload: IStoryVisualizerPayload,
  signal?: AbortSignal,
): Promise<IStoryVisualizerResult> {
  throwIfAborted(signal);
  assertGeminiApiKeyConfigured();

  const { title, content, genre = "General", language = "English" } = payload;

  const prompt = `You are a storyboard director for narrative visualization.

Analyze the story below and extract 4 to 8 key visual scenes that represent the story's beginning, major turning points, climax, and ending.

Title: ${title}
Genre: ${genre}
Language: ${language}
Story:
${content}

Return only a valid JSON object with this exact structure:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "caption": "brief scene caption in ${language}",
      "imagePrompt": "detailed visual prompt for a future image generator in ${language}"
    }
  ],
  "styleGuide": "shared character, setting, mood, color palette, lighting, and visual style guide in ${language}"
}

Rules:
- Include between 4 and 8 scenes.
- Number scenes sequentially starting at 1.
- Keep captions concise.
- Image prompts must describe visible action, characters, setting, mood, camera framing, and important visual details.
- The styleGuide must keep recurring characters, locations, wardrobe, atmosphere, and art direction consistent across future images.
- Do not generate images or image URLs.`;

  try {
    const result = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 4096,
        },
        safetySettings,
        history: [],
      });
      return chatSession.sendMessage(prompt, { signal });
    }, signal);
    const parsed = JSON.parse(sanitizeJsonText(result.response.text()));

    const scenes = parsed?.scenes;

    if (!Array.isArray(scenes) || scenes.length < 4 || scenes.length > 8) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: Expected 4 to 8 storyboard scenes.",
      );
    }

    const normalizedScenes = scenes.map((scene: any, index: number) => {
      if (
        !scene ||
        typeof scene !== "object" ||
        typeof scene.caption !== "string" ||
        typeof scene.imagePrompt !== "string"
      ) {
        throw new ApiError(
          httpStatus.BAD_GATEWAY,
          "Invalid AI response: Storyboard scenes are malformed.",
        );
      }

      return {
        sceneNumber: index + 1,
        caption: scene.caption.trim(),
        imagePrompt: scene.imagePrompt.trim(),
      };
    });

    if (typeof parsed?.styleGuide !== "string" || !parsed.styleGuide.trim()) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Invalid AI response: Style guide is missing.",
      );
    }

    return {
      scenes: normalizedScenes,
      styleGuide: parsed.styleGuide.trim(),
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);

    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `AI storyboard generation failed: ${errorMsg}`,
    );
  }
}

export async function chatWithGemini(
  message: string,
  history: { role: string; parts: { text: string }[] }[] = [],
  signal?: AbortSignal,
): Promise<string> {
  throwIfAborted(signal);
  assertGeminiApiKeyConfigured();

  try {
    const result = await executeWithRetryAndFallback(async (activeModel) => {
      const chatSession = activeModel.startChat({
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 4096,
          responseMimeType: "text/plain",
        },
        safetySettings,
        history,
      });
      return chatSession.sendMessage(message, { signal });
    }, signal);

    return result.response.text();
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI chat failed: ${errorMsg}`,
    );
  }
}