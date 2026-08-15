export interface RepetitionItem {
  phrase: string;
  count: number;
  positions: number[];
}

/**
 * Detects repeated words or short phrases within a story.
 * Ignores common stop words to reduce false positives.
 */
function detectRepetitions(story: string): RepetitionItem[] {
  if (!story || typeof story !== "string" || story.trim().length === 0) {
    return [];
  }

  const words = story.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "it", "its", "this", "that", "these", "those", "he", "she", "they",
    "we", "you", "i", "me", "him", "her", "us", "them", "my", "your",
    "his", "her", "their", "our", "who", "which", "what", "when", "where",
    "why", "how", "all", "each", "every", "both", "few", "more", "most",
    "other", "some", "such", "no", "nor", "not", "only", "own", "same",
    "so", "than", "too", "very", "just", "also", "now", "here", "there",
  ]);

  const wordCounts: Record<string, number[]> = {};
  words.forEach((word, index) => {
    const cleaned = word.replace(/[^a-z0-9]/g, "");
    if (cleaned.length < 4 || stopWords.has(cleaned)) return;

    if (!wordCounts[cleaned]) {
      wordCounts[cleaned] = [];
    }
    wordCounts[cleaned].push(index);
  });

  return Object.entries(wordCounts)
    .filter(([, positions]) => positions.length >= 3)
    .map(([phrase, positions]) => ({
      phrase,
      count: positions.length,
      positions,
    }))
    .sort((a, b) => b.count - a.count);
}

export function useRepetitionAnalysis(story: string): RepetitionItem[] {
  return detectRepetitions(story);
}
