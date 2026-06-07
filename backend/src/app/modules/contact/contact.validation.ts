import { z } from "zod";

const contactFeedbackTypes = [
  "bug-report",
  "feature-request",
  "general-feedback",
] as const;

const optionalTrimmedString = z.preprocess((value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}, z.string().optional());

const optionalEmail = z.preprocess((value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}, z.string().email("Invalid email address").optional());

const requiredTrimmedString = (label: string, max?: number) =>
  z.preprocess(
    (value: unknown) => {
      if (typeof value !== "string") {
        return value;
      }

      return value.trim();
    },
    max
      ? z
        .string()
        .min(1, `${label} is required`)
        .max(max, `${label} must not exceed ${max} characters`)
      : z.string().min(1, `${label} is required`)
  );

const contactValidationSchema = z.object({
  body: z.object({
    fullname: z
      .string({ required_error: "Full name is required" })
      .trim()
      .min(1, "Full name is required")
      .max(100, "Full name must not exceed 100 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email address")
      .max(100, "Email must not exceed 100 characters"),
    feedbackType: z.enum(contactFeedbackTypes),
    subject: requiredTrimmedString("Subject", 200),
    message: requiredTrimmedString("Message", 5000),
  }),
});

export const ContactValidation = {
  contactValidationSchema,
};
