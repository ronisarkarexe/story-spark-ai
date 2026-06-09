import { z } from "zod";

const createBugReport = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    category: z.string({ required_error: "Category is required" }),
    severity: z.string({ required_error: "Severity is required" }),
    description: z.string({ required_error: "Description is required" }),
    steps: z.string({ required_error: "Steps are required" }),
    expected: z.string({ required_error: "Expected behavior is required" }),
    actual: z.string({ required_error: "Actual behavior is required" }),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    screenshotUrl: z.string().optional(), 
  }),
});

export const BugReportValidation = {
  createBugReport,
};
