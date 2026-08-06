export interface ParagraphVarietyAnalysis {
  varietyScore: number;
  hasGoodVariety: boolean;
}

export function analyzeParagraphVariety(text: string): ParagraphVarietyAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      varietyScore: 100,
      hasGoodVariety: true,
    };
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return {
      varietyScore: 100,
      hasGoodVariety: true,
    };
  }

  const wordCounts = paragraphs.map((p) => p.split(/\s+/).filter(Boolean).length);
  const minWords = Math.min(...wordCounts);
  const maxWords = Math.max(...wordCounts);
  const difference = maxWords - minWords;

  const score = Math.min(100, 60 + Math.min(40, difference * 5));

  return {
    varietyScore: score,
    hasGoodVariety: difference >= 3,
  };
}
