export interface CharacterDialogueAnalysis {
  id: number;
  character: string;
  uniquenessScore: number;
  vocabularyStyle: "Distinct" | "Moderately Distinct" | "Similar";
  speechPattern: string;
  similarTo?: string;
  suggestions: string[];
}
