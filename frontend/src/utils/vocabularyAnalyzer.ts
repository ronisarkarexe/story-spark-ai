export interface VocabularySuggestion {
  id: string;
  word: string;
  replacement: string;
  reason: string;
}

export interface VocabularyAnalysis {
  readabilityScore: number;
  diversityScore: number;
  repeatedWords: string[];
  suggestions: VocabularySuggestion[];
}

export const analyzeVocabulary = (
  story: string
): VocabularyAnalysis => {
  return {
    readabilityScore: 82,
    diversityScore: 74,
    repeatedWords: [],
    suggestions: [],
  };
};

export const refreshVocabularyAnalysis = (
  story: string
): VocabularyAnalysis => {
  return analyzeVocabulary(story);
};

export const getReadabilityLevel = (
  score: number
): string => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};