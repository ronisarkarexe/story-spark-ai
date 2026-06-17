import { z } from "zod";

const TopicSchema = z.object({
  title: z.string({ required_error: "Topic title is required!" }).max(50),
  color: z.string({ required_error: "Topic color is required!" }).max(50),
  selected: z.boolean({
    required_error: "Topic selection status is required!",
  }),
});

const createPost = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required!" })
      .min(3, "Title must be at least 3 characters long")
      .max(200, "Title cannot exceed 200 characters"),
    content: z
      .string({ required_error: "Content is required!" })
      .min(10, "Content must be at least 10 characters long")
      .max(50000, "Content cannot exceed 50000 characters"),
    tag: z.string({ required_error: "Tag is required!" }).max(50),
    imageURL: z
      .string({ required_error: "Image URL is required!" })
      .url("Invalid image URL format")
      .max(2000),
    topic: z
      .array(TopicSchema)
      .min(2, { message: "At least two topics are required!" })
      .max(20),
    language: z.string().max(50).optional(),
  }),
});

const updatePost = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(10).max(50000).optional(),
    tag: z.string().max(50).optional(),
    imageURL: z.string().url().max(2000).optional(),
    topic: z.array(TopicSchema).min(2).max(20).optional(),
    language: z.string().max(50).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const PostValidator = {
  createPost,
  updatePost,
};
