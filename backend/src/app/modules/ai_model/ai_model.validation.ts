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
      .min(3, "Prompt must be at least 3 characters!")
      .max(1000, "Prompt must not exceed 1000 characters.")
      .refine((val) => {
        const stripped = val.replace(/^\[Genre:.*?\]\s*/, "").trim();
        return stripped.length > 0;
      }, { message: "Prompt must contain actual story content, not just a genre." }),

    wordLength: z
      .number()
      .int("wordLength must be a whole number.")
      .min(50, "wordLength must be at least 50.")
      .max(1000, "wordLength must not exceed 1000.")
      .optional(),

    numStories: z
      .number()
      .int("numStories must be a whole number.")
      .min(1, "numStories must be at least 1.")
      .max(5, "numStories must not exceed 5.")
      .optional(),

    language: z.string().optional(),

    tone: z
      .enum(VALID_TONES, {
        errorMap: () => ({
          message: `Tone must be one of: ${VALID_TONES.join(", ")}`,
        }),
      })
      .optional(),

    characters: z
      .array(
        z.object({
          name: z.string({ required_error: "Name is required" }).trim().min(1),
          role: z.string({ required_error: "Role is required" }).trim().min(1),
          personality: z.string({ required_error: "Personality/Traits are required" }).trim().min(1),
        })
      )
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
    message: z
      .string({ required_error: "Message is required!" })
      .min(1, "Message cannot be empty.")
      .max(2000, "Message must not exceed 2000 characters."),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "model"]),
          parts: z
            .string()
            .max(2000, "Each history message must not exceed 2000 characters."),
        })
      )
      .max(20, "Chat history must not exceed 20 messages.")
      .optional(),
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
    targetLanguage: z.string({ required_error: "Target language is required!" }).min(1).max(50),
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