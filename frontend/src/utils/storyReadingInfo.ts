export type DifficultyLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export interface ReadingInfo {
  wordCount: number;
  readingTime: number;
  difficulty: DifficultyLevel;
}

const WORDS_PER_MINUTE = 200;

export function analyzeReadingInfo(
  story: string
): ReadingInfo {
  const words = story
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  // For empty/whitespace-only text there are no words to read, so report a
  // reading time of 0 instead of 1 (caused by the Math.max(1, ...) floor).
  if (wordCount === 0) {
    return {
      wordCount: 0,
      readingTime: 0,
      difficulty: "Beginner",
    };
  }

  let difficulty: DifficultyLevel = "Beginner";

  if (wordCount > 1000) {
    difficulty = "Intermediate";
  }

  if (wordCount > 3000) {
    difficulty = "Advanced";
  }

  return {
    wordCount,
    readingTime: Math.max(
      1,
      Math.ceil(wordCount / WORDS_PER_MINUTE)
    ),
    difficulty,
  };
}