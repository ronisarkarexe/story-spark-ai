import { z } from "zod";

const generateStoryboard = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required!" }).trim().min(1, "Title is required!"),
    content: z.string({ required_error: "Content is required!" }).trim().min(50, "Content must be at least 50 characters long."),
    genre: z.string().trim().min(1, "Genre cannot be empty.").optional(),
    language: z.string().trim().min(1, "Language cannot be empty.").optional(),
  }),
});

export const StoryVisualizerValidator = {
  generateStoryboard,
};
