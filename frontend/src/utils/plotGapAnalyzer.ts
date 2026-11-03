export interface PlotGap {
  id: number;
  type: string;
  severity: "Low" | "Medium" | "High";
  description: string;
  suggestion: string;
}

export function analyzePlotGaps(story: string): PlotGap[] {
  const findings: PlotGap[] = [];

  const text = story.toLowerCase();

  // Abrupt transitions
  if (
    text.includes("suddenly") ||
    text.includes("immediately") ||
    text.includes("next day")
  ) {
    findings.push({
      id: findings.length + 1,
      type: "Abrupt Transition",
      severity: "Medium",
      description:
        "The story changes scenes very quickly without a smooth transition.",
      suggestion:
        "Add a transition paragraph explaining how the characters reached the next scene.",
    });
  }

  // Unresolved mystery
  if (
    text.includes("mystery") &&
    !text.includes("solved")
  ) {
    findings.push({
      id: findings.length + 1,
      type: "Unresolved Plot",
      severity: "High",
      description:
        "A mystery is introduced but no clear resolution is found.",
      suggestion:
        "Resolve the mystery or leave intentional clues for future chapters.",
    });
  }

  // Character teleportation
  if (
    text.includes("castle") &&
    text.includes("forest") &&
    !text.includes("travel")
  ) {
    findings.push({
      id: findings.length + 1,
      type: "Location Gap",
      severity: "Medium",
      description:
        "Characters appear in different locations without explanation.",
      suggestion:
        "Add travel or movement between these locations.",
    });
  }

  // Empty result
  if (findings.length === 0) {
    findings.push({
      id: 1,
      type: "No Issues",
      severity: "Low",
      description:
        "No obvious logical plot gaps detected.",
      suggestion:
        "Your story appears structurally consistent.",
    });
  }

  return findings;
}