export interface CharacterDensityAnalysis {
  characterCount: number;
  castSizeCategory: string;
}

export function calculateStoryCharacterDensity(text: string): CharacterDensityAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      characterCount: 0,
      castSizeCategory: 'Solo / Minimal',
    };
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return {
      characterCount: 0,
      castSizeCategory: 'Solo / Minimal',
    };
  }

  const properNouns = new Set<string>();
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (cleanWord.length > 2 && /^[A-Z][a-z]+$/.test(cleanWord) && index > 0) {
      const prev = words[index - 1];
      if (!/[.!?]$/.test(prev)) {
        properNouns.add(cleanWord);
      }
    }
  });

  const count = properNouns.size;
  let category = 'Small Cast';
  if (count >= 5) category = 'Ensemble Cast';
  else if (count <= 1) category = 'Solo / Minimal';

  return {
    characterCount: count,
    castSizeCategory: category,
  };
}
