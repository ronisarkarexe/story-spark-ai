export interface ReadingStats {
  words: number;
  paragraphs: number;
  chapters: number;
  sentences: number;
  averageSentenceLength: number;
  readingTime: number;
}

const CHAPTER_REGEX = /chapter/gi;
const SENTENCE_REGEX = /[.!?]+/;

export function calculateReadingStats(text: string): ReadingStats {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim() !== "").length;

  const chapters = Math.max(
    1,
    (text.match(CHAPTER_REGEX) || []).length
  );

  const sentences = text
    .split(SENTENCE_REGEX)
    .filter((s) => s.trim()).length;

  const averageSentenceLength =
    sentences === 0 ? 0 : Math.round(words / sentences);

  const readingTime = Math.max(
    1,
    Math.ceil(words / 200)
  );

  return {
    words,
    paragraphs,
    chapters,
    sentences,
    averageSentenceLength,
    readingTime,
  };
}