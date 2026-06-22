const WORDS_PER_MINUTE = 200;

function countWords(input: string): number {
  // Replace common HTML tags with spaces so word count works for story content
  // that might include markup.
  const normalized = (input || "")
    .replace(/<[^>]*>/g, " ")
    .trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

export function getReadingTime(text: string): {
  wordCount: number;
  minutes: number; // rounded up minutes for display; 0 when < 1 minute
  lessThanOneMinute: boolean;
} {
  const wordCount = countWords(text);
  const minutesExact = wordCount / WORDS_PER_MINUTE;

  if (minutesExact < 1) {
    return { wordCount, minutes: 0, lessThanOneMinute: true };
  }

  return {
    wordCount,
    minutes: Math.ceil(minutesExact),
    lessThanOneMinute: false,
  };
}

