/**
 * Utility helpers for story word count and paragraph analysis.
 * Used by editor toolbars and status components.
 */

export interface IStoryWordCountResult {
  wordCount: number;
  characterCount: number;
  characterCountNoSpaces: number;
  sentenceCount: number;
  readingTimeMinutes: number;
}

export interface IStoryParagraphCountResult {
  paragraphCount: number;
  averageWordsPerParagraph: number;
  longestParagraphWords: number;
  shortestParagraphWords: number;
}

/**
 * Counts words, characters, sentences and reading time for a story.
 * Returns zeroed result for null, undefined or empty input.
 */
export const countStoryWords = (text: string | null | undefined): IStoryWordCountResult => {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      wordCount: 0,
      characterCount: 0,
      characterCountNoSpaces: 0,
      sentenceCount: 0,
      readingTimeMinutes: 0,
    };
  }

  const trimmed = text.trim();

  const wordCount = trimmed
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const characterCount = trimmed.length;

  const characterCountNoSpaces = trimmed.replace(/\s/g, "").length;

  const sentenceCount = (trimmed.match(/[^.!?]*[.!?]+/g) || []).length || 1;

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    characterCount,
    characterCountNoSpaces,
    sentenceCount,
    readingTimeMinutes,
  };
};

/**
 * Analyzes paragraph structure of a story.
 * Returns zeroed result for null, undefined or empty input.
 */
export const countStoryParagraphs = (text: string | null | undefined): IStoryParagraphCountResult => {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      paragraphCount: 0,
      averageWordsPerParagraph: 0,
      longestParagraphWords: 0,
      shortestParagraphWords: 0,
    };
  }

  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return {
      paragraphCount: 0,
      averageWordsPerParagraph: 0,
      longestParagraphWords: 0,
      shortestParagraphWords: 0,
    };
  }

  const wordCounts = paragraphs.map(
    (p) => p.split(/\s+/).filter((w) => w.length > 0).length
  );

  const paragraphCount = paragraphs.length;
  const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
  const averageWordsPerParagraph = Math.round(totalWords / paragraphCount);
  const longestParagraphWords = Math.max(...wordCounts);
  const shortestParagraphWords = Math.min(...wordCounts);

  return {
    paragraphCount,
    averageWordsPerParagraph,
    longestParagraphWords,
    shortestParagraphWords,
  };
};