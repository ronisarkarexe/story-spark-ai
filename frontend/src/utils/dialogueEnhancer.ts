export interface DialogueSuggestion {
  id: string;
  original: string;
  suggestion: string;
  reason: string;
  severity: "Low" | "Medium" | "High";
}

export interface DialogueAnalysis {
  suggestions: DialogueSuggestion[];
}

export const analyzeDialogue = (
  story: string
): DialogueAnalysis => {
  return {
    suggestions: [],
  };
};

export const refreshDialogueAnalysis = (
  story: string
): DialogueAnalysis => {
  return analyzeDialogue(story);
};

export const acceptSuggestion = (
  story: string,
  suggestionId: string
): string => {
  return story;
};

export const ignoreSuggestion = (
  suggestionId: string
) => {
  return true;
};