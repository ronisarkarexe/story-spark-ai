export interface CharacterConflict {
  character: string;
  attribute: string;
  previous: string;
  current: string;
}

// All supported hair color keywords (including fantasy colors)
const HAIR_COLOR_SET = new Set([
  "silver", "silvery", "black", "brown", "blonde", "red",
  "grey", "gray", "white", "ginger", "auburn",
  "purple", "blue", "pink", "golden", "dark", "light",
]);

// Pattern 1: "silver hair", "silvery hair", "silver-colored hair"
const COLOR_THEN_HAIR =
  /(silver|silvery|black|brown|blonde|red|grey|gray|white|ginger|auburn|purple|blue|pink|golden|dark|light)(?:-colored)?\s+hair/gi;

// Pattern 2: "hair was silver", "hair is gray", "hair: auburn"
// Captures the word after hair + optional verb, then we validate it's a color
const HAIR_THEN_COLOR = /hair\s+(?:(?:was|is|were|color[:]?)\s+)?(\w+)/gi;

/**
 * Extracts hair color from a sentence, trying both
 * "COLOR hair" and "hair COLOR" orderings.
 */
function extractHairColor(sentence: string): string | null {
  COLOR_THEN_HAIR.lastIndex = 0;
  HAIR_THEN_COLOR.lastIndex = 0;

  const m1 = COLOR_THEN_HAIR.exec(sentence);
  if (m1) return m1[1].toLowerCase();

  const m2 = HAIR_THEN_COLOR.exec(sentence);
  if (m2) {
    const word = m2[1].toLowerCase();
    if (HAIR_COLOR_SET.has(word)) return word;
  }

  return null;
}

/**
 * Returns the first capitalized word in a sentence that
 * looks like a character name (Title-case, length > 1).
 */
function extractCharacterName(sentence: string): string | null {
  const match = sentence.match(/\b([A-Z][a-z]{1,})\b/);
  return match ? match[1] : null;
}

export const checkCharacterConsistency = (
  chapters: { content: string }[]
): CharacterConflict[] => {
  const conflicts: CharacterConflict[] = [];

  const characterMemory: Record<string, { hair?: string }> = {};

  chapters.forEach((chapter) => {
    // Split into sentences so name + color stay in the same context
    const sentences = chapter.content.split(/(?<=[.!?])\s+|(?<=\n)/);

    for (const sentence of sentences) {
      const hairColor = extractHairColor(sentence);
      if (!hairColor) continue;

      const character = extractCharacterName(sentence);
      if (!character) continue;

      if (!characterMemory[character]) {
        characterMemory[character] = {};
      }

      const previousHair = characterMemory[character].hair;

      if (previousHair && previousHair !== hairColor) {
        conflicts.push({
          character,
          attribute: "hair color",
          previous: previousHair,
          current: hairColor,
        });
      } else {
        characterMemory[character].hair = hairColor;
      }
    }
  });

  return conflicts;
};