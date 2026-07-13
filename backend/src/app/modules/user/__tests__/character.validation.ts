import { z } from "zod";

const createCharacter = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(1, "Name cannot be empty"),
    age: z
      .string({ required_error: "Age is required" })
      .trim(),
    personality: z
      .string({ required_error: "Personality is required" })
      .trim(),
    appearance: z
      .string({ required_error: "Appearance is required" })
      .trim(),
    background: z
      .string({ required_error: "Background is required" })
      .trim(),
    traits: z.array(z.string()).optional(),
    notes: z.string().trim().optional(),
  }),
});

const updateCharacter = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Name cannot be empty").optional(),
      age: z.string().trim().optional(),
      personality: z.string().trim().optional(),
      appearance: z.string().trim().optional(),
      background: z.string().trim().optional(),
      traits: z.array(z.string()).optional(),
      notes: z.string().trim().optional(),
    })
    .strict(),
});

export const CharacterValidator = {
  createCharacter,
  updateCharacter,
};