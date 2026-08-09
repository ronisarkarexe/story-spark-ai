import { generateStoryboardImage } from "./storyboard_image_generation";

export interface CharacterPortraitInput {
  name: string;
  role?: string;
  age?: number;
  personality?: string;
  appearance?: string;
  background?: string;
  traits?: string[];
}

export const buildCharacterPortraitPrompt = (
  character: CharacterPortraitInput
): string => {
  const details = [
    character.role ? `Role: ${character.role}` : undefined,
    character.age !== undefined ? `Age: ${character.age}` : undefined,
    character.appearance
      ? `Appearance: ${character.appearance}`
      : undefined,
    character.personality
      ? `Personality: ${character.personality}`
      : undefined,
    character.traits?.length
      ? `Traits: ${character.traits.join(", ")}`
      : undefined,
    character.background
      ? `Background: ${character.background}`
      : undefined,
  ].filter((detail): detail is string => Boolean(detail));

  return [
    `Create a high-quality fictional character portrait of ${character.name}.`,
    ...details,
    "Single character portrait, head-and-shoulders composition, expressive face, detailed lighting, visually consistent with the described character, no text, no watermark.",
  ].join("\n");
};

export const generateCharacterPortrait = async (
  character: CharacterPortraitInput,
  signal?: AbortSignal
): Promise<string | null> => {
  const prompt = buildCharacterPortraitPrompt(character);
  return generateStoryboardImage(prompt, signal);
};
