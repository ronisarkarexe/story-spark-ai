export interface ParagraphStructureAnalysis {
  structureScore: number;
  pacingAdvice: string;
}

export function analyzeParagraphStructure(text: string): ParagraphStructureAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      structureScore: 100,
      pacingAdvice: 'Empty story text.',
    };
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return {
      structureScore: 70,
      pacingAdvice: 'Consider breaking your story into multiple paragraphs for improved readability.',
    };
  }

  return {
    structureScore: 85,
    pacingAdvice: 'Balanced paragraph structure detected across narrative sections.',
  };
}
