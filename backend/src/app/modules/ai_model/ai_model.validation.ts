import { z } from "zod";

const VALID_TONES = [
  "Dark",
  "Humorous",
  "Romantic",
  "Epic",
  "Mysterious",
  "Children's",
] as const;

const aiModel = z.object({
  body: z.object({
    prompt: z.string({ required_error: "Prompt is required!" }),
    language: z.string().optional(),
    tone: z
      .enum(VALID_TONES, {
        errorMap: () => ({
          message: `Tone must be one of: ${VALID_TONES.join(", ")}`,
        }),
      })
      .optional(),
  }),
});

const aiAlternateEndings = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required!" }),
    content: z.string({ required_error: "Content is required!" }),
    tag: z.string({ required_error: "Tag is required!" }),
    language: z.string().optional(),
  }),
});

const aiChat = z.object({
  body: z.object({
    message: z.string({ required_error: "Message is required!" }),
    history: z.array(z.object({
      role: z.enum(["user", "model"]),
      parts: z.string(),
    })).optional(),
  }),
});
export const AIModelValidator = {
  aiModel,
  aiAlternateEndings,
  aiChat,
};
