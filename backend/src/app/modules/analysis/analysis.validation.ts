import { z } from "zod";

const analyzeStorySchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: "Story content is required for analysis." })
      .trim()
      .min(1, "Story content cannot be empty."),
  }),
});

export const AnalysisValidator = {
  analyzeStorySchema,
};
