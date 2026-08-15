export interface CharacterDialogue {
  name: string;
  lines: number;
  percentage: number;
}

export function getDialogueDistribution(): CharacterDialogue[] {
  const characters = [
    { name: "Alice", lines: 42 },
    { name: "John", lines: 28 },
    { name: "Emma", lines: 18 },
    { name: "David", lines: 7 },
  ];

  const total = characters.reduce((sum, c) => sum + c.lines, 0);

  return characters.map((c) => ({
    ...c,
    percentage: total > 0 ? Math.round((c.lines / total) * 100) : 0,
  }));
}