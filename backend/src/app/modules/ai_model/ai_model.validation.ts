import { z } from "zod";

const aiModel = z.object({
  body: z.object({
    prompt: z.string({ required_error: "Prompt is required!" }),
  }),
});

const aiAlternateEndings = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required!" }),
    content: z.string({ required_error: "Content is required!" }),
    tag: z.string({ required_error: "Tag is required!" }),
  }),
});

export const AIModelValidator = {
  aiModel,
  aiAlternateEndings,
};

