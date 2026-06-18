export interface CharacterConflict {
  character: string;
  attribute: string;
  previous: string;
  current: string;
}

export const checkCharacterConsistency = (
  chapters: { content: string }[]
): CharacterConflict[] => {
  const conflicts: CharacterConflict[] = [];

  const characterMemory: Record<
    string,
    {
      hair?: string;
    }
  > = {};

  chapters.forEach((chapter) => {
    const matches = chapter.content.matchAll(
      /([A-Z][a-z]+).*?(silver|black|brown|blonde|red)\s+hair/gi
    );

    for (const match of matches) {
      const character = match[1];
      const hairColor = match[2].toLowerCase();

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