import { z } from "zod";

const createComment = z.object({
  body: z.object({
    postId: z.string({ required_error: "PostId is required!" }),
    parentCommentId: z.string().optional(),
    comment: z
      .string({ required_error: "Comment is required!" })
      .min(1, "Comment cannot be empty")
      .max(5000, "Comment cannot exceed 5000 characters"),
  }),
});

export const CommentValidator = {
  createComment,
};
