import { z } from "zod";

const createStoryInspirationSchema = z.object({
  body: z.object({
    intro: z
      .string({
        required_error: "Story intro is required",
      })
      .trim()
      .min(1, "Story intro cannot be empty")
      .max(1000, "Story intro must be 1000 characters or less"),
  }),
});

export const StoryInspirationValidation = {
  createStoryInspirationSchema,
};
