import { useMemo } from "react";
import { analyzeDialogue } from "../utils/dialogueStyleAnalyzer";

export const useDialogueAnalysis = (story: string) =>
  useMemo(() => analyzeDialogue(story), [story]);
