import { z } from "zod";

export const PromptAnalysisValidator = {
  analyzePrompt: z.object({
    body: z.object({
      prompt: z
        .string()
        .min(10, "Prompt must be at least 10 characters")
        .max(2000, "Prompt must not exceed 2000 characters"),
      language: z
        .enum(["English", "Hindi", "Spanish", "French", "Portuguese", "German", "Japanese", "Korean", "Bengali", "Tamil", "Telugu", "Marathi"])
        .optional()
        .default("English"),
      genre: z
        .enum(["Drama", "Comedy", "Horror", "Romance", "Sci-Fi", "Fantasy", "Mystery", "Adventure"])
        .optional(),
      tone: z
        .enum(["formal", "casual", "humorous", "serious", "mysterious", "inspirational"])
        .optional(),
    }),
  }),
};
