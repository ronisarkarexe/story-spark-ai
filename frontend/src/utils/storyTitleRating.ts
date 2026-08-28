export interface TitleAnalysis {
  score: number;
  creativity: number;
  relevance: number;
  clarity: number;
  appeal: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export function analyzeTitle(
  title: string
): TitleAnalysis {
  const trimmed = title.trim();
  const length = trimmed.length;

  if (length === 0) {
    return {
      score: 0,
      creativity: 0,
      relevance: 0,
      clarity: 0,
      appeal: 0,
      strengths: [],
      weaknesses: ["The title is empty."],
      suggestions: ["Add a short, memorable title."],
    };
  }

  const score =
    length > 10 && length < 50 ? 88 : 70;

  return {
    score,
    creativity: 86,
    relevance: 90,
    clarity: 87,
    appeal: 89,

    strengths: [
      "Clear and memorable title",
      "Relevant to the story",
    ],

    weaknesses: [
      "Could be slightly more unique",
    ],

    suggestions: [
      `${trimmed} Chronicles`,
      `The ${trimmed}`,
      `${trimmed}: A New Beginning`,
    ],
  };
}

export function replaceTitle(
  title: string
) {
  return title;
}