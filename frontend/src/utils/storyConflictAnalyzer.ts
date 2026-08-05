export type ConflictType =
  | "Character vs Character"
  | "Character vs Self"
  | "Character vs Society"
  | "Character vs Nature";

export interface StoryConflict {
  id: number;
  title: string;
  type: ConflictType;
  strength: number;
  section: string;
  suggestion: string;
}

export function analyzeStoryConflicts(
  story: string
): StoryConflict[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Hero confronts rival",
      type: "Character vs Character",
      strength: 92,
      section: "Chapter 2",
      suggestion:
        "Increase emotional tension before the confrontation."
    },
    {
      id: 2,
      title: "Self doubt",
      type: "Character vs Self",
      strength: 80,
      section: "Chapter 4",
      suggestion:
        "Expand the protagonist's internal thoughts."
    },
    {
      id: 3,
      title: "Village restrictions",
      type: "Character vs Society",
      strength: 74,
      section: "Chapter 5",
      suggestion:
        "Show stronger societal consequences."
    }
  ];
}

export function reanalyzeStoryConflicts(
  story: string
) {
  return analyzeStoryConflicts(story);
}