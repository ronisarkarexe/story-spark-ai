import { z } from "zod";

const detectSchema = z.object({
  body: z.object({
    title: z.string().optional().default("Untitled"),
    content: z
      .string({ required_error: "Story content is required." })
      .trim()
      .min(1, "Story content cannot be empty.")
      .max(50000, "Content cannot exceed 50000 characters"),
  }),
});

export const PlotHoleValidator = {
  detectSchema,
};
