export interface VocabularyStats {
  totalWords: number;
  uniqueWords: number;
  diversityScore: number;
  overusedWords: {
    word: string;
    count: number;
    alternatives: string[];
  }[];
  growthHistory: {
    story: string;
    uniqueWords: number;
  }[];
}

const STOP_WORDS = [
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "is",
  "was",
];

const ALTERNATIVES: Record<string, string[]> = {
  good: ["excellent", "remarkable", "outstanding"],
  bad: ["poor", "unpleasant", "terrible"],
  big: ["massive", "enormous", "vast"],
  small: ["tiny", "compact", "miniature"],
};

export function analyzeVocabulary(
  story: string
): VocabularyStats {
  if (!story.trim()) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      diversityScore: 0,
      overusedWords: [],
      growthHistory: [],
    };
  }

  const words = story
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word && !STOP_WORDS.includes(word)
    );

  const frequency = new Map<string, number>();

  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  const overusedWords = [...frequency.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({
      word,
      count,
      alternatives: ALTERNATIVES[word] || [],
    }));

  return {
    totalWords: words.length,
    uniqueWords: frequency.size,
    diversityScore:
      words.length > 0
        ? Math.round((frequency.size / words.length) * 100)
        : 0,
    overusedWords,
    growthHistory: [
      {
        story: "Story 1",
        uniqueWords: 120,
      },
      {
        story: "Story 2",
        uniqueWords: 155,
      },
      {
        story: "Current",
        uniqueWords: frequency.size,
      },
    ],
  };
}

export function refreshVocabularyAnalysis(
  story: string
) {
  return analyzeVocabulary(story);
}