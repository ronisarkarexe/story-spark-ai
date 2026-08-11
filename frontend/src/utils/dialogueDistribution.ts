export interface CharacterDialogue {
  name: string;
  lines: number;
  percentage: number;
}

/**
 * Analyzes dialogue distribution across characters in a story.
 * Extracts all dialogue lines per character and computes their relative percentages.
 */
export function getDialogueDistribution(story: string): CharacterDialogue[] {
  if (!story || !story.trim()) {
    return [];
  }

  // Extract character names and count their dialogue lines
  // Matches patterns like "CharacterName: dialogue" or "CharacterName - dialogue"
  const linePattern = /^([A-Z][a-zA-Z]+)\s*:[-]\s*/gm;
  const charLineCounts = new Map<string, number>();
  let match;

  while ((match = linePattern.exec(story)) !== null) {
    const name = match[1];
    charLineCounts.set(name, (charLineCounts.get(name) || 0) + 1);
  }

  if (charLineCounts.size === 0) {
    return [];
  }

  const total = [...charLineCounts.values()].reduce((sum, count) => sum + count, 0);

  return [...charLineCounts.entries()]
    .map(([name, lines]) => ({
      name,
      lines,
      percentage: Math.round((lines / total) * 100),
    }))
    .sort((a, b) => b.lines - a.lines);
}
