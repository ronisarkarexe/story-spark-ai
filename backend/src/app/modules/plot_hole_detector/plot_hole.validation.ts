import { z } from "zod";

const detectSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: "Content is required!" })
      .min(1, "Content cannot be empty")
      .max(50000, "Content cannot exceed 50000 characters"),
  }),
});

export const PlotHoleValidation = {
  detectSchema,
};
