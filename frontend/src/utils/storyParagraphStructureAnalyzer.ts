export interface ParagraphStructureAnalysis {
  avgSentencesPerParagraph: number;
  structureCategory: string;
}

export function calculateStoryParagraphStructure(text: string): ParagraphStructureAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      avgSentencesPerParagraph: 0,
      structureCategory: 'Short & Punchy',
    };
  }

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) {
    return {
      avgSentencesPerParagraph: 0,
      structureCategory: 'Short & Punchy',
    };
  }

  let totalSentences = 0;
  paragraphs.forEach((p) => {
    const sentences = p.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    totalSentences += sentences.length;
  });

  const avg = Math.round((totalSentences / paragraphs.length) * 10) / 10;
  let category = 'Well Balanced';
  if (avg > 5) category = 'Dense Block';
  else if (avg < 2) category = 'Short & Punchy';

  return {
    avgSentencesPerParagraph: avg,
    structureCategory: category,
  };
}
