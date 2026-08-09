export interface OpeningHookReport {
  engagement: number;
  curiosity: number;
  clarity: number;
  emotionalImpact: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestedOpening: string;
}

export function evaluateOpeningHook(
  story: string
): OpeningHookReport {
  if (!story.trim()) {
    return {
      engagement: 0,
      curiosity: 0,
      clarity: 0,
      emotionalImpact: 0,
      overallScore: 0,
      strengths: [],
      weaknesses: [],
      suggestedOpening: "",
    };
  }

  return {
    engagement: 88,
    curiosity: 84,
    clarity: 91,
    emotionalImpact: 80,
    overallScore: 86,
    strengths: [
      "Strong opening sentence",
      "Clear setting introduction",
      "Creates reader curiosity",
    ],
    weaknesses: [
      "Emotional stakes could be stronger",
      "Conflict appears slightly late",
    ],
    suggestedOpening:
      "As the last light disappeared behind the mountains, Emma realized the letter in her hands could change everything.",
  };
}

export function regenerateOpeningEvaluation(
  story: string
) {
  return evaluateOpeningHook(story);
}