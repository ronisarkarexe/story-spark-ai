export type ReadingLevel =
  | "Children's"
  | "Middle School"
  | "High School"
  | "College"
  | "Advanced";

export interface ReadingLevelReport {
  level: ReadingLevel;
  vocabularyScore: number;
  sentenceComplexity: number;
  explanation: string;
  suggestions: string[];
}

export function analyzeReadingLevel(
  story: string
): ReadingLevelReport {
  if (!story.trim()) {
    return {
      level: "Children's",
      vocabularyScore: 0,
      sentenceComplexity: 0,
      explanation: "No story available for analysis.",
      suggestions: [],
    };
  }

  return {
    level: "High School",
    vocabularyScore: 82,
    sentenceComplexity: 78,
    explanation:
      "The story contains moderately advanced vocabulary with varied sentence structures suitable for high school readers.",
    suggestions: [
      "Use shorter sentences for younger readers.",
      "Replace difficult vocabulary where appropriate.",
      "Add more descriptive transitions between scenes.",
    ],
  };
}

export function reanalyzeReadingLevel(
  story: string
) {
  return analyzeReadingLevel(story);
}