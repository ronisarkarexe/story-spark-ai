export function getReadingTime(text: string): { minutes: number; wordCount: number } {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { minutes: 0, wordCount: 0 };
  }
  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return { minutes, wordCount };
}
