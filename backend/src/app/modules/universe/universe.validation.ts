import { z } from "zod";

const createUniverse = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Universe name is required!" })
      .trim()
      .min(1, "Universe name cannot be empty.")
      .max(200, "Universe name must not exceed 200 characters."),
    description: z
      .string({ required_error: "Universe description is required!" })
      .trim()
      .min(1, "Universe description cannot be empty.")
      .max(2000, "Universe description must not exceed 2000 characters."),
    stories: z.array(z.string()).optional(),
  }),
});

const updateUniverse = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Universe name cannot be empty.")
      .max(200, "Universe name must not exceed 200 characters.")
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, "Universe description cannot be empty.")
      .max(2000, "Universe description must not exceed 2000 characters.")
      .optional(),
    stories: z.array(z.string()).optional(),
  }),
});

const createMemory = z.object({
  body: z.object({
    type: z.enum(
      [
        "character",
        "relationship",
        "location",
        "event",
        "rule",
        "magic_system",
        "object",
        "other",
      ],
      { required_error: "Memory type is required!" }
    ),
    title: z
      .string({ required_error: "Memory title is required!" })
      .trim()
      .min(1, "Memory title cannot be empty.")
      .max(200, "Memory title must not exceed 200 characters."),
    content: z
      .string({ required_error: "Memory content is required!" })
      .trim()
      .min(1, "Memory content cannot be empty.")
      .max(10000, "Memory content must not exceed 10000 characters."),
    attributes: z.record(z.any()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateMemory = z.object({
  body: z.object({
    type: z
      .enum([
        "character",
        "relationship",
        "location",
        "event",
        "rule",
        "magic_system",
        "object",
        "other",
      ])
      .optional(),
    title: z
      .string()
      .trim()
      .min(1, "Memory title cannot be empty.")
      .max(200, "Memory title must not exceed 200 characters.")
      .optional(),
    content: z
      .string()
      .trim()
      .min(1, "Memory content cannot be empty.")
      .max(10000, "Memory content must not exceed 10000 characters.")
      .optional(),
    attributes: z.record(z.any()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const UniverseValidation = {
  createUniverse,
  updateUniverse,
  createMemory,
  updateMemory,
};
