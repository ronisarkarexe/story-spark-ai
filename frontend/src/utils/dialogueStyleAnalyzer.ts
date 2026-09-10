import { CharacterDialogueAnalysis } from "../types/dialogue";

export function analyzeDialogue(story: string): CharacterDialogueAnalysis[] {

  const characters = ["Alice", "John", "King"];

  return characters.map((name, index) => {

    let score = Math.floor(Math.random() * 35) + 65;

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