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
  const length = title.trim().length;

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
      `${title} Chronicles`,
      `The ${title}`,
      `${title}: A New Beginning`,
    ],
  };
}

export function replaceTitle(
  title: string
) {
  return title;
}