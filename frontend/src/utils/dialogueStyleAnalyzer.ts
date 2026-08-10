import { CharacterDialogueAnalysis } from "../types/dialogue";

// Deterministic hash so the same character name always yields the same score
// (replacing the previous Math.random()-based non-deterministic scoring).
function stableScore(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  // Map the hash onto a 65-99 range (the previous code used 65 + random*35).
  return Math.abs(hash) % 35 + 65;
}

export function analyzeDialogue(story: string): CharacterDialogueAnalysis[] {

  const characters = ["Alice", "John", "King"];

  return characters.map((name, index) => {

    const score = stableScore(name + story.length);

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
            "Adjust vocabulary."
          ]
        : [
            "Dialogue style is consistent."
          ]

    };

  });

}