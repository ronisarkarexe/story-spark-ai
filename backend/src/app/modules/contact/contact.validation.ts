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
}, 
  z.string()
    .max(100, "Must be at most 100 characters")
    .optional()
);

const optionalEmail = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}, z.string().email("Invalid email address").optional());

const requiredTrimmedString = (label: string, maxLength?: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }
    return value.trim();
  }, 
  maxLength 
    ? z.string().min(1, `${label} is required`).max(maxLength, `${label} is too long`) 
    : z.string().min(1, `${label} is required`)
);

const contactValidationSchema = z.object({
  body: z.object({
    fullname: optionalTrimmedString, 
    email: optionalEmail,
    feedbackType: z.enum(contactFeedbackTypes),
    subject: requiredTrimmedString("Subject", 200),
    message: requiredTrimmedString("Message", 2000),
  }),
});


export const ContactValidation = {
  contactValidationSchema,
};
