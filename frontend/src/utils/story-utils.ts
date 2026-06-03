export const getWordCount = (str: string | undefined): number => {
  if (typeof str !== "string" || !str.trim()) {
    return 0;
  }
  return str.trim().split(/\s+/).length;
};

export const calculateReadingTime = (content: string | undefined): number => {
  if (!content) return 1;
  const words = getWordCount(content);
  return Math.max(1, Math.ceil(words / 200));
};

export const formatReadingStats = (content: string | undefined): string => {
  const words = getWordCount(content);
  const time = calculateReadingTime(content);
  return `${time} min read • ${words} words`;
};
