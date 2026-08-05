export interface ForeshadowingItem {
  id: number;
  hint: string;
  relatedEvent: string;
  status: "Strong" | "Weak" | "Unresolved";
  suggestion: string;
}

export function analyzeStoryForeshadowing(
  story: string
): ForeshadowingItem[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      hint: "A mysterious old key appears in Chapter 1.",
      relatedEvent: "Unlocks the hidden chamber in Chapter 8.",
      status: "Strong",
      suggestion:
        "Maintain this connection as it creates satisfying payoff.",
    },
    {
      id: 2,
      hint: "A brief mention of dark clouds before the journey.",
      relatedEvent: "Major battle during a storm.",
      status: "Weak",
      suggestion:
        "Expand the hint slightly to build anticipation.",
    },
    {
      id: 3,
      hint: "The strange necklace is introduced early.",
      relatedEvent: "No later payoff found.",
      status: "Unresolved",
      suggestion:
        "Either remove the hint or connect it to a later plot event.",
    },
  ];
}

export function refreshForeshadowingAnalysis(
  story: string
) {
  return analyzeStoryForeshadowing(story);
}