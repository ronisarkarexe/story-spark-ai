export interface EndingAnalysis {
  score: number;
  quality:
    | "Excellent"
    | "Good"
    | "Needs Improvement";

  emotionalImpact: number;
  completeness: number;
  predictability: number;
  endingType:
    | "Complete"
    | "Open-ended"
    | "Abrupt";

  weaknesses: string[];
  suggestions: string[];
}

export function analyzeStoryEnding(
  story: string
): EndingAnalysis {
  if (!story.trim()) {
    return {
      score: 0,
      quality: "Needs Improvement",
      emotionalImpact: 0,
      completeness: 0,
      predictability: 0,
      endingType: "Abrupt",
      weaknesses: [],
      suggestions: [],
    };
  }

  return {
    score: 84,
    quality: "Good",
    emotionalImpact: 88,
    completeness: 82,
    predictability: 60,
    endingType: "Complete",
    weaknesses: [
      "Ending could deliver a stronger emotional payoff.",
      "Final conflict resolves quickly.",
    ],
    suggestions: [
      "Expand the final emotional moment.",
      "Add a short epilogue.",
      "Strengthen the protagonist's final decision.",
    ],
  };
}

export function regenerateEndingPrompt(
  story: string
): string {
  return `Rewrite only the ending while preserving the story's style and characters:\n\n${story}`;
}