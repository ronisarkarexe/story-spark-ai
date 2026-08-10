export interface CharacterCountResult {
  total: number;
  withoutSpaces: number;
}

export function countStoryCharacters(text: string): CharacterCountResult {
  if (!text || typeof text !== 'string') {
    return { total: 0, withoutSpaces: 0 };
  }

  return {
    total: text.length,
    withoutSpaces: text.replace(/\s+/g, '').length,
  };
}
