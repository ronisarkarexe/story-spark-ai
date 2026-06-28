import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";
import sendResponse from "../shared/send_response";
import { storyQueue } from "../services/storyRequestQueue";
import { compressContext, serializeLore } from "../utils/contextCompressor";
import { Post } from "../app/modules/post/post.model";
import { Types } from "mongoose";
import { verifyPostAccess } from "../app/modules/post/post.utils";
import httpStatus from "http-status";
import ApiError from "../errors/api_error";

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
    try {
      const { storyContext, selectedChoice, genre } = req.body;

      const segmentIndex =
        (storyContext.match(/\[Player chose:/g) || []).length + 1;

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
        const padded = [...finalChoices];
        while (padded.length < 3) {
          padded.push(`Option ${padded.length + 1}`);
        }
        finalChoices = padded;
      } else if (finalChoices.length > 3) {
        finalChoices = finalChoices.slice(0, 3);
      }
      parsed.choices = finalChoices;

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Story generated successfully",
        data: { storySegment: parsed.storySegment, choices: parsed.choices, segmentIndex },
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error("[StoryBranching] generation error:", detail);
      sendResponse(res, {
        success: false,
        statusCode: 503,
        message: "Story generation is temporarily unavailable. Please try again later.",
        data: null,
      });
    }
  },

  getStoryTree: async (req: Request, res: Response) => {
    try {
      const { rootStoryId } = req.params;
      if (!Types.ObjectId.isValid(rootStoryId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid rootStoryId provided");
      }

      const rootStory = await Post.findById(rootStoryId);
      if (!rootStory) {
        throw new ApiError(httpStatus.NOT_FOUND, "Root story not found");
      }

      verifyPostAccess(rootStory, req.user);

      const stories = await Post.find({
        rootStoryId: new Types.ObjectId(rootStoryId),
        isDeleted: { $ne: true }
      }).populate("author", "name email");

      const nodes = stories.map(story => ({
        id: story._id.toString(),
        title: story.title,
        parentStoryId: story.parentStoryId ? story.parentStoryId.toString() : null,
        branchDepth: story.branchDepth ?? 0,
        createdAt: story.createdAt,
      }));

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Story tree retrieved successfully",
        data: { nodes },
      });
    } catch (error: any) {
      const statusCode = (error && typeof error === "object" && "statusCode" in error) ? error.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
      const message = (error && typeof error === "object" && "message" in error) ? error.message : "Internal server error";
      sendResponse(res, {
        statusCode,
        success: false,
        message,
        data: null,
      });
    }
  },
};
