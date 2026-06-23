export interface CharacterConflict {
  character: string;
  attribute: string;
  previous: string;
  current: string;
}

// Extended list of common hair colors
const HAIR_COLORS = [
  "silver", "black", "brown", "blonde", "red", "ginger",
  "grey", "gray", "white", "auburn", "golden", "chestnut",
];

const hairColorPattern = HAIR_COLORS.join("|");

export const checkCharacterConsistency = (
  chapters: { content: string }[]
): CharacterConflict[] => {
  const conflicts: CharacterConflict[] = [];

  const characterMemory: Record<string, { hair?: string }> = {};

  chapters.forEach((chapter) => {
    // Collect all character/hair pairs found in this chapter before processing
    const chapterHair: Array<{ character: string; hairColor: string }> = [];

    // --- Pattern 1: "Character ... COLOR hair" ---
    // e.g., "Elena had silver hair" or "Arthur has red hair"
    const colorHairRegex = new RegExp(
      `([A-Z][a-z]+).*?(${hairColorPattern})\\s+hair`,
      "gi"
    );
    let match = colorHairRegex.exec(chapter.content);
    while (match) {
      chapterHair.push({ character: match[1], hairColor: match[2].toLowerCase() });
      match = colorHairRegex.exec(chapter.content);
    }

    // --- Pattern 2: "[Character]'s hair was COLOR" ---
    // e.g., "Eleanor's hair was silver" or "Merlin's hair turned gold"
    const possHairRegex = new RegExp(
      `([A-Z][a-z]+)'s hair\\s+(?:was|became|turned|changed to)\\s+(${hairColorPattern})`,
      "gi"
    );
    match = possHairRegex.exec(chapter.content);
    while (match) {
      chapterHair.push({ character: match[1], hairColor: match[2].toLowerCase() });
      match = possHairRegex.exec(chapter.content);
    }

    // Deduplicate within this chapter (same character + color)
    const seen = new Set<string>();
    chapterHair.forEach(({ character, hairColor }) => {
      const key = `${character}:${hairColor}`;
      if (seen.has(key)) return;
      seen.add(key);

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
    });
  });

  return conflicts;
};
