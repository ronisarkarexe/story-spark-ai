export interface CharacterConflict {
  character: string;
  attribute: string;
  previous: string;
  current: string;
}

const HAIR_COLORS = [
  "silver", "silvery", "black", "brown", "blonde", "red", "ginger",
  "grey", "gray", "white", "auburn", "golden", "chestnut", "purple", "blue", "pink"
];

const hairColorPattern = HAIR_COLORS.join("|");

export const checkCharacterConsistency = (
  chapters: { content: string }[]
): CharacterConflict[] => {
  const conflicts: CharacterConflict[] = [];
  const characterMemory: Record<string, { hair?: string }> = {};

  chapters.forEach((chapter) => {
    const chapterHair: Array<{ character: string; hairColor: string }> = [];

    // --- Pattern 1: "Character ... COLOR hair" ---
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
    const possHairRegex = new RegExp(
      `([A-Z][a-z]+)'s hair\\s+(?:was|became|turned|changed to|is|were)\\s+(${hairColorPattern})`,
      "gi"
    );
    match = possHairRegex.exec(chapter.content);
    while (match) {
      chapterHair.push({ character: match[1], hairColor: match[2].toLowerCase() });
      match = possHairRegex.exec(chapter.content);
    }

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

export interface CharacterIssue {
  id: string;
  character: string;
  category: string;
  severity: string;
  description: string;
  suggestion: string;
}

export const analyzeCharacterConsistency = (story: string): CharacterIssue[] => {
  const conflicts = checkCharacterConsistency([{ content: story || "" }]);
  return conflicts.map((conflict, idx) => ({
    id: `issue-${idx}`,
    character: conflict.character,
    category: "Appearance",
    severity: "Medium",
    description: `Inconsistent ${conflict.attribute}: was '${conflict.previous}', now '${conflict.current}'`,
    suggestion: `Ensure ${conflict.character}'s ${conflict.attribute} is consistent across chapters or explain the change.`,
  }));
};

export const getConsistencyScore = (issues: CharacterIssue[] | unknown[]): number => {
  if (!issues || issues.length === 0) return 100;
  const score = 100 - issues.length * 15;
  return Math.max(0, score);
};
