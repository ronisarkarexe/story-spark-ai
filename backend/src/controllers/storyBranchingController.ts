import { Request, Response } from "express";
import { generateStory } from "../services/ai.service";

export const StoryBranchingController = {
  createBranchingStory: async (req: Request, res: Response) => {
    try {
      const { storyContext, selectedChoice, genre } = req.body;

      // Build prompt from existing fields
      const prompt = `
        Genre: ${genre || "general"}
        Story so far: ${storyContext}
        The user chose: ${selectedChoice}
        Continue the story based on this choice.
      `;

      const result = await generateStory(prompt);

      return res.status(200).json({
        story:        result.story,
        provider:     result.provider,
        fallbackUsed: result.fallbackUsed,
      });

    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Unexpected error during story generation";

      return res.status(503).json({ message });
    }
  }
};