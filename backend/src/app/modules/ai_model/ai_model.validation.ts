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
    prompt: z
      .string({ required_error: "Prompt is required!" })
      .trim()
      .min(1, "Prompt cannot be empty or whitespace only!")
      .max(2000, "Prompt must not exceed 2000 characters"),
    language: z.string().max(50).optional(),
    tone: z
      .enum(VALID_TONES, {
        errorMap: () => ({
          message: `Tone must be one of: ${VALID_TONES.join(", ")}`,
        }),
      })
      .optional(),
  }),
});

const aiStoryContinuation = z.object({
  body: z.object({
    prompt: z
      .string({ required_error: "Prompt is required!" })
      .min(10, "Prompt must be at least 10 characters long.")
      .max(5000, "Prompt must not exceed 5000 characters."),
    language: z.string().optional(),
  }),
});

const aiAlternateEndings = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required!" })
      .max(200, "Title must not exceed 200 characters"),
    content: z
      .string({ required_error: "Content is required!" })
      .max(10000, "Content must not exceed 10000 characters"),
    tag: z
      .string({ required_error: "Tag is required!" })
      .max(50, "Tag must not exceed 50 characters"),
    language: z.string().max(50).optional(),
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

const REMIX_TYPES = ["genre_shift", "tone_shift", "perspective_shift"] as const;

const aiRemix = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required!" }),
    content: z.string().min(10).max(10000),
    tag: z.string({ required_error: "Tag is required!" }),
    remixType: z.enum(REMIX_TYPES, { required_error: "Remix type is required!" }),
    remixOption: z.string().max(200).optional(),
    language: z.string().max(50).optional(),
  }),
});

const aiTranslate = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required!" }),
    content: z.string().min(10).max(10000),
    language: z.string({ required_error: "Language is required!" }),
  }),
});

export const AIModelValidator = {
  aiModel,
  aiAlternateEndings,
  aiStoryContinuation,
  aiChat,
  aiRemix,
  aiTranslate,
};