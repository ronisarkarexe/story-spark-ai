export interface ReadabilityScoreResult {
  score: number;
  level: 'Easy' | 'Moderate' | 'Complex';
}

export function calculateReadabilityScore(text: string): ReadabilityScoreResult {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { score: 100, level: 'Easy' };
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { score: 100, level: 'Easy' };

  const totalChars = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = totalChars / words.length;

  let score = Math.max(0, Math.min(100, Math.round(100 - (avgWordLength - 4) * 15)));
  if (isNaN(score)) score = 100;

  let level: 'Easy' | 'Moderate' | 'Complex' = 'Easy';
  if (score < 50) {
    level = 'Complex';
  } else if (score < 80) {
    level = 'Moderate';
  }

  return { score, level };
}
