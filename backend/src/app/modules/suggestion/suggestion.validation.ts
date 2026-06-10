import { z } from "zod";

const generateSuggestion = z.object({
  body: z.object({
    storyId: z.string().optional(),
    suggestionType: z.enum([
      "plot",
      "character",
      "dialogue",
      "scene",
      "structure",
      "tone",
      "conflict",
    ]),
    originalText: z.string().optional(),
    storyContext: z.string({ required_error: "storyContext is required" }).min(5, "Story context must be at least 5 characters long"),
    additionalInstructions: z.string().optional(),
  }),
});

const handleSuggestionStatus = z.object({
  params: z.object({
    id: z.string({ required_error: "Suggestion ID is required" }),
  }),
});

export const SuggestionValidator = {
  generateSuggestion,
  handleSuggestionStatus,
};
