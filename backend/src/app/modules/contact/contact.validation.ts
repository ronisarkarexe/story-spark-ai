import { z } from "zod";

const contactValidationSchema = z.object({
  body: z.object({
    fullname: z.string({
      required_error: "Full name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    subject: z.string({
      required_error: "Subject is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
  }),
});

export const ContactValidation = {
  contactValidationSchema,
};
