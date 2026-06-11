export interface IVocabularyItem {
  word: string;
  definition: string;
  example?: string;
}

export interface IThemeItem {
  theme: string;
  explanation: string;
}

export interface IReadingLevel {
  gradeLevel: string;
  ageRange: string;
  explanation: string;
}

export interface IEducationalInsights {
  vocabulary: IVocabularyItem[];
  comprehensionQuestions: string[];
  discussionQuestions: string[];
  themes: IThemeItem[];
  moralLessons: string[];
  writingPrompts: string[];
  readingLevel: IReadingLevel;
}
