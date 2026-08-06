export interface ParagraphDensityAnalysis {
  densityScore: number;
  densityLevel: string;
}

export function calculateParagraphDensityScore(text: string): ParagraphDensityAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      densityScore: 100,
      densityLevel: 'Optimal',
    };
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return {
      densityScore: 100,
      densityLevel: 'Optimal',
    };
  }

  const totalWords = text.trim().split(/\s+/).filter(Boolean).length;
  const avgWordsPerPara = totalWords / paragraphs.length;

  if (avgWordsPerPara > 150) {
    return {
      densityScore: 65,
      densityLevel: 'Dense',
    };
  } else if (avgWordsPerPara < 20) {
    return {
      densityScore: 80,
      densityLevel: 'Light',
    };
  }

  return {
    densityScore: 90,
    densityLevel: 'Optimal',
  };
}
