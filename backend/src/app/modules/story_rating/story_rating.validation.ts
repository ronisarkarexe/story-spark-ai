import { z } from "zod";

const createOrUpdateRating = z.object({
  body: z.object({
    storyId: z.string({
      required_error: "storyId is required",
    }),
    rating: z
      .number({
        required_error: "rating is required",
      })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),
    review: z
      .string()
      .max(500, "Review cannot exceed 500 characters")
      .optional(),
  }),
});

export const StoryRatingValidation = {
  createOrUpdateRating,
};
