import { z } from "zod";

const contactFeedbackTypes = [
  "bug-report",
  "feature-request",
  "general-feedback",
] as const;

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}, z.string().optional());

const optionalEmail = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}, z.string().email("Invalid email address").optional());

const requiredTrimmedString = (label: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    return value.trim();
  }, z.string().min(1, `${label} is required`));

const contactValidationSchema = z.object({
  body: z.object({
    fullname: optionalTrimmedString,
    email: optionalEmail,
    feedbackType: z.enum(contactFeedbackTypes),
    subject: requiredTrimmedString("Subject"),
    message: requiredTrimmedString("Message"),
  }),
});

export const ContactValidation = {
  contactValidationSchema,
};
