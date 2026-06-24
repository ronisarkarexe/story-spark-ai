export function getReadingTime(text: string): { minutes: number; wordCount: number } {
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return { minutes, wordCount };
}