export interface StoryKeywordResult {
  keywords: string[];
  themes: string[];
  locations: string[];
  characters: string[];
  concepts: string[];
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of",
  "in", "on", "with", "for", "is", "was",
  "were", "it", "that", "this", "at", "by"
]);

export function extractKeywords(
  story: string
): StoryKeywordResult {
  const words = story
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        !STOP_WORDS.has(word.toLowerCase())
    );

  const unique = [...new Set(words)];

  return {
    keywords: unique.slice(0, 12),
    themes: unique.slice(0, 4),
    locations: unique.slice(4, 7),
    characters: unique.slice(7, 10),
    concepts: unique.slice(10, 14),
  };
}

export function wordFrequencyMap(
  story: string
): Map<string, number> {
  const words = story
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        !STOP_WORDS.has(word.toLowerCase())
    );

  const frequency = new Map<string, number>();

  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  return frequency;
}

export function removeKeyword(
  keywords: string[],
  keyword: string
) {
  return keywords.filter((item) => item !== keyword);
}