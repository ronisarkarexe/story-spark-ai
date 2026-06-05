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

const requiredTrimmedString = (label: string) =>
  z.preprocess((value: unknown) => {
    if (typeof value !== "string") {
      return value;
    }

    return value.trim();
  }, z.string().min(1, `${label} is required`));

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
    subject: requiredTrimmedString("Subject").max(
      200,
      "Subject must not exceed 200 characters"
    ),
    message: requiredTrimmedString("Message").max(
      5000,
      "Message must not exceed 5000 characters"
    ),
  }),
});

export const ContactValidation = {
  contactValidationSchema,
};
