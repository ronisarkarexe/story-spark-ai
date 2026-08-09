import { z } from "zod";

export const ChapterIllustrationValidator = {
  generateIllustration: z.object({
    body: z.object({
      chapterId: z.string().min(1, "Chapter ID is required"),
      chapterTitle: z
        .string()
        .min(1, "Chapter title is required")
        .max(500, "Chapter title must not exceed 500 characters"),
      chapterContent: z
        .string()
        .min(10, "Chapter content must be at least 10 characters")
        .max(10000, "Chapter content must not exceed 10000 characters"),
      storyContext: z
        .string()
        .max(2000, "Story context must not exceed 2000 characters")
        .optional(),
      imagePrompt: z
        .string()
        .max(1000, "Image prompt must not exceed 1000 characters")
        .optional(),
      style: z
        .enum(["realistic", "illustration", "cartoon", "watercolor", "sketch"])
        .optional()
        .default("illustration"),
      quality: z.enum(["standard", "hd"]).optional().default("standard"),
    }),
  }),

  batchGenerateIllustrations: z.object({
    body: z.object({
      chapters: z.array(
        z.object({
          chapterId: z.string().min(1),
          chapterTitle: z.string().min(1),
          chapterContent: z.string().min(10),
          storyContext: z.string().optional(),
          imagePrompt: z.string().optional(),
        })
      ),
      style: z.enum(["realistic", "illustration", "cartoon", "watercolor", "sketch"]).optional(),
      quality: z.enum(["standard", "hd"]).optional(),
    }),
  }),
};
