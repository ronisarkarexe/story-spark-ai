export interface CharacterDialogueAnalysis {
  id: number;
  character: string;
  uniquenessScore: number;
  vocabularyStyle: string;
  speechPattern: string;
  similarTo?: string;
  suggestions: string[];
}

export function analyzeDialogue(story: string): CharacterDialogueAnalysis[] {
  const characters = ["Alice", "John", "King"];

  return characters.map((name, index) => {
    const nameCount = story
      .toLowerCase()
      .split(name.toLowerCase())
      .length - 1;

    const base = 65 + (index * 5) % 20;
    const score = Math.min(
      100,
      Math.max(65, base + nameCount * 2)
    );

    return {
      id: index + 1,
      character: name,
      uniquenessScore: score,
      vocabularyStyle:
        score > 85
          ? "Distinct"
          : "Moderately Distinct",
      speechPattern:
        score > 85
          ? "Unique tone and sentence structure"
          : "Similar wording with other characters",
      similarTo:
        score < 75
          ? "John"
          : undefined,
      suggestions: score < 75
        ? [
            "Use unique catchphrases.",
            "Vary sentence length.",
            "Adjust vocabulary.",
          ]
        : [
            "Dialogue style is consistent.",
          ],
    };
  });
}
