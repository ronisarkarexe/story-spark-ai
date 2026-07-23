export interface CharacterIssue {
  id: number;
  character: string;
  category:
    | "Personality"
    | "Appearance"
    | "Ability"
    | "Relationship"
    | "Motivation";
  severity: "Low" | "Medium" | "High";
  description: string;
  suggestion: string;
}

export function analyzeCharacterConsistency(
  story: string
): CharacterIssue[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      character: "Main Character",
      category: "Personality",
      severity: "Medium",
      description:
        "The character appears calm in early scenes but reacts aggressively later without clear justification.",
      suggestion:
        "Add a transition or event explaining the personality shift.",
    },
    {
      id: 2,
      character: "Supporting Character",
      category: "Relationship",
      severity: "Low",
      description:
        "Relationship dynamics change abruptly between chapters.",
      suggestion:
        "Include additional dialogue to strengthen the relationship development.",
    },
  ];
}

export function getConsistencyScore(
  issues: CharacterIssue[]
): number {
  return Math.max(100 - issues.length * 15, 0);
}