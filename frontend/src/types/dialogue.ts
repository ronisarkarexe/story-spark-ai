export interface CharacterDialogueAnalysis {
  id: number;
  character: string;
  uniquenessScore: number;
  vocabularyStyle: string;
  speechPattern: string;
  similarTo?: string;
  suggestions: string[];
}
