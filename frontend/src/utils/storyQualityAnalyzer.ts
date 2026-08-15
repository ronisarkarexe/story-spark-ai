export interface StoryQualityScore {
  category: string;
  score: number;
  feedback: string;
  suggestion: string;
}

export const analyzeStoryQuality = (story: string): StoryQualityScore[] => {
  const words = story.trim().split(/\s+/).filter(Boolean);
  const sentences = story.split(/[.!?]+/).filter((sentence) => sentence.trim());
  const dialogueMarks = (story.match(/"/g) ?? []).length;
  const lengthScore = Math.min(100, Math.round(words.length / 5));
  const sentenceScore = Math.min(100, sentences.length * 8);
  const dialogueScore = Math.min(100, dialogueMarks * 8);

  return [
    {
      category: "Depth",
      score: lengthScore,
      feedback: `${words.length} words analyzed.`,
      suggestion: lengthScore < 60 ? "Develop the story with more concrete detail." : "The story has useful depth.",
    },
    {
      category: "Pacing",
      score: sentenceScore,
      feedback: `${sentences.length} narrative sentences detected.`,
      suggestion: sentenceScore < 60 ? "Vary scene and sentence pacing." : "The pacing has a solid foundation.",
    },
    {
      category: "Dialogue",
      score: dialogueScore,
      feedback: `${Math.floor(dialogueMarks / 2)} dialogue passages detected.`,
      suggestion: dialogueScore < 40 ? "Consider adding character dialogue." : "Dialogue is represented in the story.",
    },
  ];
};
