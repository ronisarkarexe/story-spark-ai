import { z } from "zod";

const createReview = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    role: z.string({
      required_error: "Role is required!",
    }),
    feedback: z
      .string({
        required_error: "Feedback is required!",
      })
      .min(10, "Feedback must be at least 10 characters long"),

    imgSrc: z.string().optional(),

    rating: z.number().min(1).max(5).optional(),
  }),
});

export const ReviewValidator = {
  createReview,
};
