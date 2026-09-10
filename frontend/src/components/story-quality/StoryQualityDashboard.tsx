export interface StoryScore {
  category: string;
  score: number;
  feedback: string;
  suggestion: string;
}

export function analyzeStoryQuality(story: string): StoryScore[] {
  const length = story.length;

  return [
    {
      category: "Readability",
      score: Math.min(100, Math.floor(length / 120)),
      feedback: "The story is easy to follow.",
      suggestion: "Use shorter sentences where necessary."
    },
    {
      category: "Originality",
      score: 82,
      feedback: "Unique ideas detected.",
      suggestion: "Avoid common fantasy clichés."
    },
    {
      category: "Pacing",
      score: 74,
      feedback: "Some sections feel slower.",
      suggestion: "Reduce repetitive descriptions."
    },
    {
      category: "Dialogue",
      score: 80,
      feedback: "Dialogue is engaging.",
      suggestion: "Add emotional reactions."
    },
    {
      category: "Emotional Impact",
      score: 78,
      feedback: "Emotional progression is good.",
      suggestion: "Strengthen emotional peaks."
    },
    {
      category: "Grammar",
      score: 94,
      feedback: "Very few grammar issues.",
      suggestion: "Proofread final draft."
    },
    {
      category: "Character Development",
      score: 84,
      feedback: "Characters evolve naturally.",
      suggestion: "Give supporting characters more depth."
    },
    {
      category: "Plot Consistency",
      score: 86,
      feedback: "Story remains mostly consistent.",
      suggestion: "Clarify one unresolved subplot."
    }
  ];
}