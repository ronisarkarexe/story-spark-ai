/**
 * Estimate reading time for a given text content.
 * Average reading speed: ~200 words per minute.
 * Returns formatted string like "3 min read" or "1 min read".
 */

interface ReadTimeResult {
  minutes: number;
  text: string;
  words: number;
}

const WORDS_PER_MINUTE = 200;

export function estimateReadTime(content: string): ReadTimeResult {
  if (!content || content.trim().length === 0) {
    return { minutes: 0, text: "0 min read", words: 0 };
  }

  // Remove code blocks (they take longer to read)
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  const codeLineCount = codeBlocks.reduce(
    (acc, block) => acc + block.split("
").length,
    0
  );

  // Remove code blocks from content for word counting
  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "");
  const words = contentWithoutCode.trim().split(/\s+/).filter(Boolean).length;

  // Code lines take ~3x longer to read than regular text
  const codeTime = codeLineCount / 50; // ~50 lines per minute for code
  const textTime = words / WORDS_PER_MINUTE;
  const totalMinutes = Math.ceil(textTime + codeTime);

  return {
    minutes: totalMinutes,
    text: totalMinutes <= 1 ? "1 min read" : `${totalMinutes} min read`,
    words,
  };
}

/**
 * Format read time for display in story cards.
 * Short format for cards: "3m", long format for details: "3 min read"
 */
export function formatReadTime(minutes: number, format: "short" | "long" = "long"): string {
  if (minutes <= 0) return format === "short" ? "0m" : "0 min read";
  if (minutes <= 1) return format === "short" ? "1m" : "1 min read";
  return format === "short" ? `${minutes}m` : `${minutes} min read`;
}
