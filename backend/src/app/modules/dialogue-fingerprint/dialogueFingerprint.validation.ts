import { z } from "zod";

const generateFingerprintSchema = z.object({
  params: z.object({
    storyId: z
      .string({
        required_error: "Story ID is required!",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Story ID format!"),
  }),
});

export const DialogueFingerprintValidator = {
  generateFingerprintSchema,
};
