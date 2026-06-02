import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";
import sendResponse from "../shared/send_response";

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

const parseRawStoryText = (text: string) => {
  return {
    storySegment: text || "The story continues into the unknown...",
    choices: [
      "Explore the surroundings",
      "Search for another way",
      "Wait and see what happens"
    ]
  };
};

export const StoryBranchingController = {
  createBranchingStory: async (req: Request, res: Response) => {
    try {
      const { storyContext, selectedChoice, genre } = req.body;

      // Calculate segmentIndex based on the number of selection steps in storyContext
      const segmentIndex = (storyContext.match(/\[Player chose:/g) || []).length + 1;

      // Build prompt to request JSON structure
      const prompt = `
You are an interactive fiction writer. Generate the next segment of a branching story.
Genre: ${genre || "general"}
Story so far: ${storyContext || "This is the start of the story."}
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

      const result = await generateStory(prompt);

      let parsed: { storySegment: string; choices: string[] };
      try {
        const cleaned = sanitizeJsonText(result.story);
        parsed = JSON.parse(cleaned);

        // Ensure storySegment and choices exist
        if (!parsed.storySegment || !Array.isArray(parsed.choices)) {
          throw new Error("Missing required fields in parsed JSON");
        }
      } catch (e) {
        console.warn("[Branching] JSON parsing failed, attempting fallback parsing. Error:", e);

        // Try regex-based extraction as a secondary backup
        const jsonMatch = result.story.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(sanitizeJsonText(jsonMatch[0]));
            if (!parsed.storySegment || !Array.isArray(parsed.choices)) {
              throw new Error("Invalid structure inside regex match");
            }
          } catch (innerError) {
            parsed = parseRawStoryText(result.story);
          }
        } else {
          parsed = parseRawStoryText(result.story);
        }
      }

      // Ensure we have exactly 3 choices
      if (!parsed.choices || parsed.choices.length === 0) {
        parsed.choices = [
          "Explore the surroundings",
          "Search for another way",
          "Wait and see what happens"
        ];
      } else if (parsed.choices.length < 3) {
        while (parsed.choices.length < 3) {
          parsed.choices.push(`Option ${parsed.choices.length + 1}`);
        }
      } else if (parsed.choices.length > 3) {
        parsed.choices = parsed.choices.slice(0, 3);
      }

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Story generated successfully",
        data: {
          storySegment: parsed.storySegment,
          choices: parsed.choices,
          segmentIndex,
        },
      });
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : String(error);

      console.error("[StoryBranching] generation error:", detail);

      sendResponse(res, {
        success: false,
        statusCode: 503,
        message:
          "Story generation is temporarily unavailable. Please try again later.",
        data: null,
      });
    }
  },
};