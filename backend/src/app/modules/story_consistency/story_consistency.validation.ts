import { z } from "zod";

const analyzeSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: "Story content is required." })
      .min(500, "Content must be at least 500 characters.")
      .max(100000, "Content cannot exceed 100,000 characters."),
    title: z.string().optional(),
    genre: z.string().optional(),
  }),
});

export const StoryConsistencyValidation = { analyzeSchema };
