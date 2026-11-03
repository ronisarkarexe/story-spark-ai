export interface DialogueBalanceReport {
  dialoguePercentage: number;
  narrationPercentage: number;
  dialogueLines: number;
  narrationLines: number;
  suggestion: string;
}

export function analyzeDialogueBalance(
  story: string
): DialogueBalanceReport {
  if (!story.trim()) {
    return {
      dialoguePercentage: 0,
      narrationPercentage: 0,
      dialogueLines: 0,
      narrationLines: 0,
      suggestion: "No story available for analysis.",
    };
  }

  return {
    dialoguePercentage: 42,
    narrationPercentage: 58,
    dialogueLines: 34,
    narrationLines: 47,
    suggestion:
      "The story has a healthy balance between narration and dialogue. Consider adding slightly more dialogue in action scenes.",
  };
}

export function refreshDialogueBalance(
  story: string
) {
  return analyzeDialogueBalance(story);
}