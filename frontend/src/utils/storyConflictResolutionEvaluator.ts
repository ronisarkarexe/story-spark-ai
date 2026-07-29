export interface StoryConflict {
  id: number;
  title: string;
  type: "Primary" | "Secondary";
  resolution: "Resolved" | "Partially Resolved" | "Unresolved";
  description: string;
  suggestion: string;
}

export function analyzeConflictResolution(
  story: string
): StoryConflict[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      title: "Hero vs Main Villain",
      type: "Primary",
      resolution: "Resolved",
      description:
        "The protagonist defeats the antagonist and restores peace.",
      suggestion:
        "The resolution feels complete and provides a satisfying ending.",
    },
    {
      id: 2,
      title: "Sibling Relationship",
      type: "Secondary",
      resolution: "Partially Resolved",
      description:
        "The siblings reconcile, but lingering tension remains.",
      suggestion:
        "Add a final conversation to strengthen emotional closure.",
    },
    {
      id: 3,
      title: "Ancient Artifact Mystery",
      type: "Secondary",
      resolution: "Unresolved",
      description:
        "The origin of the artifact is never explained.",
      suggestion:
        "Include a short reveal or epilogue to resolve this plot thread.",
    },
  ];
}

export function refreshConflictAnalysis(
  story: string
) {
  return analyzeConflictResolution(story);
}