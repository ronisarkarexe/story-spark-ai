import { z } from "zod";

/**
 * Validation for branch choice
 */
export const BranchChoiceSchema = z.object({
  id: z.string().min(1, "Choice ID is required").max(50, "Choice ID too long").optional(),
  text: z.string().min(1, "Choice text is required").max(500, "Choice text too long"),
  nextSegmentId: z.string().optional(),
});

/**
 * Validation for creating a new branching story
 */
export const CreateBranchingStorySchema = z.object({
  storyId: z.string().min(1, "Story ID is required"),
  initialContent: z.string().min(1, "Initial content is required").max(10000, "Content too long"),
  choices: z
    .array(BranchChoiceSchema)
    .min(1, "At least one choice is required")
    .max(5, "Maximum 5 choices allowed"),
  genre: z.string().optional(),
});

/**
 * Validation for creating a branch segment
 */
export const CreateSegmentSchema = z.object({
  storyId: z.string().min(1, "Story ID is required"),
  parentSegmentId: z.string().min(1, "Parent segment ID is required"),
  content: z.string().min(1, "Segment content is required").max(10000, "Content too long"),
  choices: z
    .array(BranchChoiceSchema)
    .min(1, "At least one choice is required")
    .max(5, "Maximum 5 choices allowed"),
});

/**
 * Validation for recording user choice
 */
export const RecordChoiceSchema = z.object({
  storyId: z.string().min(1, "Story ID is required"),
  currentSegmentId: z.string().min(1, "Current segment ID is required"),
  choiceId: z.string().min(1, "Choice ID is required"),
  choiceText: z.string().min(1, "Choice text is required"),
});

/**
 * Validation for retrieving branch tree
 */
export const GetBranchTreeSchema = z.object({
  storyId: z.string().min(1, "Story ID is required"),
  maxDepth: z.number().int().min(1).max(100).optional(),
});

/**
 * Validation for branch validation
 */
export const ValidateBranchSchema = z.object({
  storyId: z.string().min(1, "Story ID is required"),
  checkCircular: z.boolean().optional().default(true),
  checkOrphaned: z.boolean().optional().default(true),
});

export type CreateBranchingStoryInput = z.infer<typeof CreateBranchingStorySchema>;
export type CreateSegmentInput = z.infer<typeof CreateSegmentSchema>;
export type RecordChoiceInput = z.infer<typeof RecordChoiceSchema>;
export type GetBranchTreeInput = z.infer<typeof GetBranchTreeSchema>;
export type ValidateBranchInput = z.infer<typeof ValidateBranchSchema>;
