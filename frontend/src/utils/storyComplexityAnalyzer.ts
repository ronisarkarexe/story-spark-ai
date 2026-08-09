export interface ComplexityAnalysis {
  score: number;
  level: "Simple" | "Moderate" | "Advanced";
  vocabularyScore: number;
  sentenceScore: number;
  narrativeScore: number;
  plotScore: number;
  suggestions: string[];
}

export function analyzeStoryComplexity(
  story: string
): ComplexityAnalysis {
  const words = story.trim().split(/\s+/);
  const sentences = story
    .split(/[.!?]+/)
    .filter(Boolean);

  const avgSentenceLength =
    sentences.length > 0
      ? words.length / sentences.length
      : 0;

  let score = 60;

  if (avgSentenceLength > 10) score += 10;
  if (words.length > 300) score += 10;
  if (words.length > 800) score += 10;
  if (avgSentenceLength > 18) score += 10;

  const level =
    score < 70
      ? "Simple"
      : score < 90
      ? "Moderate"
      : "Advanced";

  return {
    score,
    level,
    vocabularyScore: 82,
    sentenceScore: Math.round(avgSentenceLength * 4),
    narrativeScore: 85,
    plotScore: 84,
    suggestions: [
      "Use varied vocabulary.",
      "Balance sentence lengths.",
      "Improve narrative depth.",
      "Strengthen plot transitions.",
    ],
  };
}

export function refreshComplexityAnalysis(
  story: string
) {
  return analyzeStoryComplexity(story);
}