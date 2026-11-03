export interface Keyword {
  id: number;
  word: string;
  count: number;
  category: "Keyword" | "Character" | "Location";
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
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
];

export function extractStoryKeywords(
  story: string
): Keyword[] {
  if (!story.trim()) return [];

  const words = story
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word &&
        !STOP_WORDS.includes(word)
    );

  const frequency = new Map<string, number>();

  words.forEach((word) => {
    frequency.set(
      word,
      (frequency.get(word) || 0) + 1
    );
  });

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count], index) => ({
      id: index + 1,
      word,
      count,
      category: "Keyword",
    }));
}

export function refreshKeywordCloud(
  story: string
) {
  return extractStoryKeywords(story);
}