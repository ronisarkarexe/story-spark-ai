import { CharacterDialogueAnalysis } from "../types/dialogue";
import { analyzeDialogue } from "../utils/dialogueStyleAnalyzer";

export function useDialogueAnalysis(story: string): CharacterDialogueAnalysis[] {
  return analyzeDialogue(story);
}
