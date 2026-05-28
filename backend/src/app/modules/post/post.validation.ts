import { z } from "zod";

const TopicSchema = z.object({
  title: z.string({ required_error: "Topic title is required!" }),
  color: z.string({ required_error: "Topic color is required!" }),
  selected: z.boolean({
    required_error: "Topic selection status is required!",
  }),
});

const createPost = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required!" })
      .min(3, "Title must be at least 3 characters long"),
    content: z
      .string({ required_error: "Content is required!" })
      .min(10, "Content must be at least 10 characters long"),
    tag: z.string({ required_error: "Tag is required!" }),
    imageURL: z
      .string({ required_error: "Image URL is required!" })
      .url("Invalid image URL format"),
    topic: z
      .array(TopicSchema)
      .min(2, { message: "At least two topics are required!" }),
    language: z.string().optional(),
  }),
});

export const PostValidator = {
  createPost,
};
