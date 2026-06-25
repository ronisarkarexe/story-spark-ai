import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";
import sendResponse from "../shared/send_response";
import { storyQueue } from "../services/storyRequestQueue";
import { compressContext, serializeLore } from "../utils/contextCompressor";

export const MAX_STORY_CONTEXT_LENGTH = 8000;
export const MAX_CHOICE_LENGTH = 200;
export const ALLOWED_GENRES = new Set([
  "adventure",
  "childrens",
  "comedy",
  "drama",
  "fantasy",
  "general",
  "horror",
  "mystery",
  "romance",
  "sci-fi",
  "scifi",
  "thriller",
]);

const VALID_GENRES = Array.from(ALLOWED_GENRES).sort();

type BranchingRequest = {
  storyContext: string;
  selectedChoice: string;
  genre?: string;
};

type BranchingValidationResult =
  | { isValid: true; data: BranchingRequest }
  | { isValid: false; message: string; validGenres?: string[] };

export const validateBranchingRequest = (body: unknown): BranchingValidationResult => {
  if (!body || typeof body !== "object") {
    return { isValid: false, message: "Request body must be an object." };
  }

  const { storyContext, selectedChoice, genre } = body as Record<string, unknown>;

  if (typeof storyContext !== "string") {
    return { isValid: false, message: "storyContext must be a string." };
  }

  if (typeof selectedChoice !== "string") {
    return { isValid: false, message: "selectedChoice must be a string." };
  }

  if (genre !== undefined && typeof genre !== "string") {
    return { isValid: false, message: "genre must be a string." };
  }

  const sanitizedStoryContext = storyContext.trim().toLowerCase();
  const sanitizedSelectedChoice = selectedChoice.trim().toLowerCase();
  const sanitizedGenre = genre?.trim().toLowerCase();

  if (!sanitizedStoryContext) {
    return { isValid: false, message: "storyContext cannot be empty." };
  }

  if (sanitizedStoryContext.length > MAX_STORY_CONTEXT_LENGTH) {
    return {
      isValid: false,
      message: `storyContext must not exceed ${MAX_STORY_CONTEXT_LENGTH} characters.`,
    };
  }

  if (!sanitizedSelectedChoice) {
    return { isValid: false, message: "selectedChoice cannot be empty." };
  }

  if (sanitizedSelectedChoice.length > MAX_CHOICE_LENGTH) {
    return {
      isValid: false,
      message: `selectedChoice must not exceed ${MAX_CHOICE_LENGTH} characters.`,
    };
  }

  if (sanitizedGenre !== undefined) {
    if (!sanitizedGenre) {
      return { isValid: false, message: "genre cannot be empty." };
    }

    if (!ALLOWED_GENRES.has(sanitizedGenre)) {
      return {
        isValid: false,
        message: `genre must be one of: ${VALID_GENRES.join(", ")}.`,
        validGenres: VALID_GENRES,
      };
    }
  }

  return {
    isValid: true,
    data: {
      storyContext: sanitizedStoryContext,
      selectedChoice: sanitizedSelectedChoice,
      genre: sanitizedGenre,
    },
  };
};

const sanitizeJsonText = (rawText: string): string => {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
};

const parseRawStoryText = (text: string) => ({
  storySegment: text || "The story continues into the unknown...",
  choices: [
    "Explore the surroundings",
    "Search for another way",
    "Wait and see what happens",
  ],
});

const buildCompressedContext = (storyContext: string): string => {
  if (!storyContext.trim()) return "";
  const rawNodes = storyContext
    .split(/(?=\[player chose:)/gi)
    .map((chunk, i) => ({ id: `seg-${i}`, text: chunk.trim() }));
  const { lore, window: contextWindow } = compressContext(rawNodes);
  return `${serializeLore(lore)}\n\n${contextWindow.map((n) => n.text).join("\n")}`;
};

export const StoryBranchingController = {
  createBranchingStory: async (req: Request, res: Response) => {
    try {
      const validation = validateBranchingRequest(req.body);
      if (!validation.isValid) {
        return sendResponse(res, {
          success: false,
          statusCode: 400,
          message: validation.message,
          data: validation.validGenres ? { validGenres: validation.validGenres } : null,
        });
      }

      const { storyContext, selectedChoice, genre } = validation.data;

      const segmentIndex =
        (storyContext.match(/\[player chose:/gi) || []).length + 1;

      const compressedContext = buildCompressedContext(storyContext || "");
      const contextBlock = compressedContext.trim()
        ? compressedContext.trim()
        : "This is the start of the story.";

      const prompt = `
You are an interactive fiction writer. Generate the next segment of a branching story.
Genre: ${genre || "general"}
Story so far: ${contextBlock}
${selectedChoice ? `The player chose: "${selectedChoice}"` : "This is the introduction/first scene of the story."}

Task:
1. Continue the story based on the player's choice or write the introduction scene if it is the start.
2. Provide exactly three distinct and engaging choices for what the player can do next.
3. Output the response ONLY as a valid JSON object in the following format (no markdown blocks, no prefix/suffix text, just the raw JSON):
{
  "storySegment": "The next segment of the story...",
  "choices": [
    "Choice 1 description",
    "Choice 2 description",
    "Choice 3 description"
  ]
}
`;

      const rawProvider = req.headers?.["x-model-provider"];
      const provider = Array.isArray(rawProvider) ? rawProvider[0] : rawProvider;
      const result = await storyQueue.enqueue(() => generateStory(prompt, provider));

      let parsed: { storySegment: string; choices: string[] };
      try {
        const cleaned = sanitizeJsonText(result.story);
        parsed = JSON.parse(cleaned);
        if (!parsed.storySegment || !Array.isArray(parsed.choices)) {
          throw new Error("Missing required fields in parsed JSON");
        }
      } catch (e) {
        console.warn("[Branching] JSON parsing failed, attempting fallback. Error:", e);
        const jsonMatch = result.story.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(sanitizeJsonText(jsonMatch[0]));
            if (!parsed.storySegment || !Array.isArray(parsed.choices)) {
              throw new Error("Invalid structure inside regex match");
            }
          } catch {
            parsed = parseRawStoryText(result.story);
          }
        } else {
          parsed = parseRawStoryText(result.story);
        }
      }

      let finalChoices = parsed.choices;
      if (!finalChoices || finalChoices.length === 0) {
        finalChoices = [
          "Explore the surroundings",
          "Search for another way",
          "Wait and see what happens",
        ];
      } else if (finalChoices.length < 3) {
        finalChoices = [...finalChoices];
        while (finalChoices.length < 3) {
          finalChoices.push(`Option ${finalChoices.length + 1}`);
        }
      } else if (finalChoices.length > 3) {
        finalChoices = finalChoices.slice(0, 3);
      }
      parsed.choices = finalChoices;

      return sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Story generated successfully",
        data: { storySegment: parsed.storySegment, choices: parsed.choices, segmentIndex },
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error("[StoryBranching] generation error:", detail);
      return sendResponse(res, {
        success: false,
        statusCode: 503,
        message: "Story generation is temporarily unavailable. Please try again later.",
        data: null,
      });
    }
  },
};
