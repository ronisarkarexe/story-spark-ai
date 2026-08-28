export interface ReadingStats {
  words: number;
  paragraphs: number;
  chapters: number;
  sentences: number;
  averageSentenceLength: number;
  readingTime: number;
}

export function calculateReadingStats(text: string): ReadingStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  if (words === 0) {
    return {
      words: 0,
      paragraphs: 0,
      chapters: 0,
      sentences: 0,
      averageSentenceLength: 0,
      readingTime: 0,
    };
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim() !== "").length;

  const chapters = Math.max(
    1,
    (text.match(/chapter/gi) || []).length
  );

  const sentences = text
    .split(/[.!?]+/)
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