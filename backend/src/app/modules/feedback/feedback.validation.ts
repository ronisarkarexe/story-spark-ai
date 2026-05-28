import { z } from "zod";

const feedbackValidationSchema = z.object({
  body: z.object({
    fullname: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    type: z.enum(["bug", "feature", "general"], { required_error: "Feedback type is required" }),
    subject: z.string({ required_error: "Subject is required" }).min(3, "Subject is too short"),
    message: z.string({ required_error: "Message is required" }).min(10, "Message is too short"),
  }),
});

export const FeedbackValidation = {
  feedbackValidationSchema,
};
