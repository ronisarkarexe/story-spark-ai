export interface IFingerprint {
  tone: string;
  averageSentenceLength: number;
  contractionRate: number;
  frequentWords: string[];
  catchphrases: string[];
}

export interface ICharacterDialogueAnalysis {
  character: string;
  dialogues: string[];
  fingerprint: IFingerprint;
  distinctivenessScore: number;
}

export interface ISimilarityAnalysis {
  characterA: string;
  characterB: string;
  similarity: number;
  flagged: boolean;
}

export interface IRecommendation {
  character: string;
  suggestion: string;
}

export interface IDialogueFingerprintResponse {
  characters: ICharacterDialogueAnalysis[];
  similarities: ISimilarityAnalysis[];
  recommendations: IRecommendation[];
}
