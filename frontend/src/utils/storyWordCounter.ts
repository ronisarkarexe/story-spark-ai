export interface StoryWordCountResult {
  words: number;
  paragraphs: number;
}

export function countStoryWords(text: string): StoryWordCountResult {
  if (!text || typeof text !== 'string') {
    return { words: 0, paragraphs: 0 };
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return { words: 0, paragraphs: 0 };
  }

  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  return { words, paragraphs };
}
