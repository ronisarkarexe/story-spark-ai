import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";
import sendResponse from "../shared/send_response";
import { storyQueue } from "../services/storyRequestQueue";
import { compressContext, serializeLore } from "../utils/contextCompressor";

/** Maximum number of characters allowed in storyContext before rejection. */
export const MAX_STORY_CONTEXT_LENGTH = 8000;

/** Maximum number of characters allowed in selectedChoice before rejection. */
export const MAX_CHOICE_LENGTH = 200;

/**
 * The set of genres accepted by the branching story endpoint.
 * Values are lowercase; incoming genre strings are lowercased before
 * comparison so the check is case-insensitive.
 */
export const ALLOWED_GENRES = new Set([
  "fantasy",
  "horror",
  "romance",
  "scifi",
  "mystery",
  "childrens",
]);

/** Shape of a validated + sanitized branching request. */
export interface BranchingRequestFields {
  storyContext: string;
  selectedChoice: string;
  genre?: string;
}

/** Structured validation error returned by validateBranchingRequest(). */
export interface BranchingValidationError {
  valid: false;
  status: 400;
  message: string;
}

/** Successful validation result returned by validateBranchingRequest(). */
export interface BranchingValidationSuccess {
  valid: true;
  fields: BranchingRequestFields;
}

export type BranchingValidationResult =
  | BranchingValidationError
  | BranchingValidationSuccess;

/**
 * Pure validation helper — no side effects.
 *
 * Checks that:
 * - `storyContext` is a non-empty string within MAX_STORY_CONTEXT_LENGTH chars
 * - `selectedChoice` is a non-empty string within MAX_CHOICE_LENGTH chars
 * - `genre`, when provided, is a string whose lowercased value is in ALLOWED_GENRES
 *
 * Returns a discriminated union so callers can narrow on `result.valid`.
 */
export function validateBranchingRequest(body: Record<string, unknown>): BranchingValidationResult {
  const { storyContext, selectedChoice, genre } = body;

  // --- storyContext ---
  if (typeof storyContext !== "string") {
    return { valid: false, status: 400, message: "storyContext must be a string." };
  }
  const trimmedContext = storyContext.trim();
  if (trimmedContext.length === 0) {
    return { valid: false, status: 400, message: "storyContext cannot be empty." };
  }
  if (trimmedContext.length > MAX_STORY_CONTEXT_LENGTH) {
    return {
      valid: false,
      status: 400,
      message: `storyContext must not exceed ${MAX_STORY_CONTEXT_LENGTH} characters.`,
    };
  }

  // --- selectedChoice ---
  if (typeof selectedChoice !== "string") {
    return { valid: false, status: 400, message: "selectedChoice must be a string." };
  }
  const trimmedChoice = selectedChoice.trim();
  if (trimmedChoice.length === 0) {
    return { valid: false, status: 400, message: "selectedChoice cannot be empty." };
  }
  if (trimmedChoice.length > MAX_CHOICE_LENGTH) {
    return {
      valid: false,
      status: 400,
      message: `selectedChoice must not exceed ${MAX_CHOICE_LENGTH} characters.`,
    };
  }

  // --- genre (optional) ---
  let sanitizedGenre: string | undefined;
  if (genre !== undefined && genre !== null) {
    if (typeof genre !== "string") {
      return {
        valid: false,
        status: 400,
        message: "genre must be a string.",
      };
    }
    sanitizedGenre = genre.trim().toLowerCase();
    if (sanitizedGenre.length > 0 && !ALLOWED_GENRES.has(sanitizedGenre)) {
      return {
        valid: false,
        status: 400,
        message: `Unknown genre "${genre}". Valid genres are: ${[...ALLOWED_GENRES].join(", ")}.`,
      };
    }
    // If genre was provided but trims to empty, treat it as absent
    if (sanitizedGenre.length === 0) {
      sanitizedGenre = undefined;
    }
  }

  return {
    valid: true,
    fields: {
      storyContext: trimmedContext,
      selectedChoice: trimmedChoice,
      genre: sanitizedGenre,
    },
  };
}

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
    .split(/(?=\[Player chose:)/g)
    .map((chunk, i) => ({ id: `seg-${i}`, text: chunk.trim() }));
  const { lore, window: contextWindow } = compressContext(rawNodes);
  return `${serializeLore(lore)}\n\n${contextWindow.map((n) => n.text).join("\n")}`;
};

export const StoryBranchingController = {
  createBranchingStory: async (req: Request, res: Response) => {
    // --- Input validation ---
    const validation = validateBranchingRequest(req.body as Record<string, unknown>);
    if (!validation.valid) {
      return sendResponse(res, {
        success: false,
        statusCode: validation.status,
        message: validation.message,
        data: null,
      });
    }

    const { storyContext, selectedChoice, genre } = validation.fields;

    try {
      const segmentIndex =
        (storyContext.match(/\[Player chose:/g) || []).length + 1;

      const compressedContext = buildCompressedContext(storyContext);
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

      if (!parsed.choices || parsed.choices.length === 0) {
        parsed.choices = [
          "Explore the surroundings",
          "Search for another way",
          "Wait and see what happens",
        ];
      } else if (parsed.choices.length < 3) {
        while (parsed.choices.length < 3) {
          parsed.choices.push(`Option ${parsed.choices.length + 1}`);
        }
      } else if (parsed.choices.length > 3) {
        parsed.choices = parsed.choices.slice(0, 3);
      }

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
