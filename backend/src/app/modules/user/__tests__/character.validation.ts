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

export const CharacterValidator = {
  createCharacter,
};