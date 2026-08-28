export function getReadingTime(text: string): { minutes: number; wordCount: number } {
  if (!text || typeof text !== 'string') {
    return { minutes: 0, wordCount: 0 };
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return { minutes: 0, wordCount: 0 };
  }
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return { minutes, wordCount };
}

export function calculateReadingTime(content: string | null | undefined): string {
  if (!content) return "1 min read";
  const { minutes } = getReadingTime(content);
  return `${minutes} min read`;
}
