export interface StoryParagraphAnalysis {
  totalParagraphs: number;
  averageWordsPerParagraph: number;
  longestParagraphWords: number;
}

export function analyzeStoryParagraphs(text: string): StoryParagraphAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      totalParagraphs: 0,
      averageWordsPerParagraph: 0,
      longestParagraphWords: 0,
    };
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return {
      totalParagraphs: 0,
      averageWordsPerParagraph: 0,
      longestParagraphWords: 0,
    };
  }

  let totalWords = 0;
  let maxWords = 0;

  paragraphs.forEach((p) => {
    const wordCount = p.split(/\s+/).filter(Boolean).length;
    totalWords += wordCount;
    if (wordCount > maxWords) {
      maxWords = wordCount;
    }
  });

  return {
    totalParagraphs: paragraphs.length,
    averageWordsPerParagraph: Math.round(totalWords / paragraphs.length),
    longestParagraphWords: maxWords,
  };
}
