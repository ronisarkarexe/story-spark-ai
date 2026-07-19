export const getWordCount = (str: string | undefined): number => {
  if (typeof str !== "string") {
    return 0;
  }

  const normalizedText = str.replace(/[\r\n]+/g, " ").trim();
  if (!normalizedText) {
    return 0;
  }

  return normalizedText.split(/\s+/).length;
};

export const calculateReadingTime = (content: string | undefined): number => {
  if (!content) return 1;
  const words = getWordCount(content);
  return Math.max(1, Math.ceil(words / 200));
};

export const formatReadingStats = (content: string | undefined): string => {
  const words = getWordCount(content);
  const time = calculateReadingTime(content);
  return `${time} min read - ${words} words`;
};

/* ------------------------------------------------------------------ */
/*  Document Stats Dashboard (Issue #4424)                            */
/*                                                                      */
/*  NOTE on reading speed: the rest of this app (ReadingTimeBadge,      */
/*  BookOpen, StoryDisplay, etc.) uses 200 wpm via calculateReadingTime  */
/*  above. Issue #4424 specifies 238 wpm for the new stats dashboard     */
/*  specifically. Rather than silently changing the reading time shown  */
/*  elsewhere in the app, this introduces a separate, explicitly-named   */
/*  constant scoped to the dashboard. Reconciling the two speeds repo-   */
/*  wide is a larger, separate refactor — tracked as a follow-up rather  */
/*  than bundled into this feature.                                     */
/* ------------------------------------------------------------------ */

export const DASHBOARD_READING_SPEED_WPM = 238;
export const PUBLISHING_WORDS_PER_PAGE = 250;

/**
 * Tokenizes text into lowercase word tokens for vocabulary analysis.
 * Strips punctuation rather than splitting on it, so "hello," and "hello"
 * count as the same token. Single-pass regex match, O(n).
 */
export const tokenizeWords = (text: string | undefined): string[] => {
  if (typeof text !== "string") return [];
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
};

export interface DocumentStats {
  totalWords: number;
  uniqueWords: number;
  /** Type-Token Ratio, 0.0–1.0 */
  vocabularyRichness: number;
  readingTimeMin: number;
  estimatedPages: number;
}

/**
 * Computes the full Document Stats Dashboard metric set for a single
 * block of text (one chapter, or a whole story's content joined together).
 * Reuses getWordCount for the headline word count to stay consistent with
 * the rest of the app; uses tokenizeWords separately for richness, since
 * that needs normalized (lowercased, punctuation-stripped) tokens that
 * getWordCount intentionally does not produce.
 */
export const computeDocumentStats = (content: string | undefined): DocumentStats => {
  const totalWords = getWordCount(content);
  const tokens = tokenizeWords(content);
  const uniqueWords = new Set(tokens).size;

  return {
    totalWords,
    uniqueWords,
    vocabularyRichness: totalWords === 0 ? 0 : uniqueWords / totalWords,
    readingTimeMin: totalWords === 0 ? 0 : Math.ceil(totalWords / DASHBOARD_READING_SPEED_WPM),
    estimatedPages: totalWords / PUBLISHING_WORDS_PER_PAGE,
  };
};

/**
 * Maps a chapter's word count to a hue (0–360) for the chapter-length
 * heat-map: shortest chapter in the active document → blue (210),
 * longest → red (0). Pass the document's max chapter word count as
 * `maxWordCount`.
 */
export const chapterHeatHue = (wordCount: number, maxWordCount: number): number => {
  if (maxWordCount <= 0) return 210;
  const ratio = Math.min(wordCount / maxWordCount, 1);
  return Math.round(210 - ratio * 210);
};