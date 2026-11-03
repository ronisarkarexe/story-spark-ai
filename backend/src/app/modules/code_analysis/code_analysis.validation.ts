import { z } from "zod";

export const CodeAnalysisValidator = {
  analyzeSwift: z.object({
    body: z.object({
      code: z.string().min(1, "Code snippet cannot be empty"),
    }),
  }),
};
