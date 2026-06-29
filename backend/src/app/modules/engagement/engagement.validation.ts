import { z } from "zod";

const analyzeChapter = z.object({
  body: z.object({
    chapterText: z.string({
      required_error: "chapterText is required",
    }).min(100, "Chapter text must be at least 100 characters"),
    title: z.string().optional(),
  }),
});

export const EngagementValidation = {
  analyzeChapter,
};
