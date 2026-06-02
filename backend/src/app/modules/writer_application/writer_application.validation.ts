import { z } from "zod";

const submitApplicationZodSchema = z.object({
  body: z.object({
    portfolioLink: z.string({
      required_error: "Portfolio link is required",
    }).url("Must be a valid URL"),
    reason: z.string({
      required_error: "Reason is required",
    }).min(10, "Reason must be at least 10 characters long"),
  }),
});

const updateApplicationStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected"], {
      required_error: "Status must be 'approved' or 'rejected'",
    }),
  }),
});

export const WriterApplicationValidation = {
  submitApplicationZodSchema,
  updateApplicationStatusZodSchema,
};
