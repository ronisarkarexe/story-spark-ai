export interface DialogueEmotion {
  id: number;
  character: string;
  dialogue: string;
  emotion:
    | "Happy"
    | "Sad"
    | "Angry"
    | "Fear"
    | "Confident"
    | "Sarcastic";
  confidence: number;
  suggestion: string;
}

export interface CharacterEmotionSummary {
  character: string;
  dominantEmotion: string;
  dialogueCount: number;
}

export function analyzeDialogueEmotion(
  story: string
): {
  dialogues: DialogueEmotion[];
  summaries: CharacterEmotionSummary[];
} {
  if (!story.trim()) {
    return {
      dialogues: [],
      summaries: [],
    };
  }

  return {
    dialogues: [
      {
        id: 1,
        character: "Emma",
        dialogue: "We finally made it!",
        emotion: "Happy",
        confidence: 95,
        suggestion: "Emotion is conveyed clearly.",
      },
      {
        id: 2,
        character: "Lucas",
        dialogue: "I don't trust this place...",
        emotion: "Fear",
        confidence: 90,
        suggestion: "Consider adding body language for stronger impact.",
      },
      {
        id: 3,
        character: "Emma",
        dialogue: "Sure... that's a brilliant idea.",
        emotion: "Sarcastic",
        confidence: 87,
        suggestion: "Add contextual cues to reinforce sarcasm.",
      },
    ],
    summaries: [
      {
        character: "Emma",
        dominantEmotion: "Happy",
        dialogueCount: 2,
      },
      {
        character: "Lucas",
        dominantEmotion: "Fear",
        dialogueCount: 1,
      },
    ],
  };
}

export function refreshDialogueEmotionAnalysis(
  story: string
) {
  return analyzeDialogueEmotion(story);
}