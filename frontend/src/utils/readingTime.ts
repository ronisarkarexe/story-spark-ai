const WORDS_PER_MINUTE = 200;

export function getReadingTime(text: string): { minutes: number; wordCount: number } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { minutes: 1, wordCount: 0 };
  }

  const wordCount = trimmed.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

  return { minutes, wordCount };
}

