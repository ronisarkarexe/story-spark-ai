import { WorldRule } from "../types/world";

export function analyzeWorldConsistency(
  story: string
): WorldRule[] {

  const rules: WorldRule[] = [];

  if (
    story.includes("Dragon Kingdom") &&
    story.includes("Dragon Empire")
  ) {
    rules.push({
      id: 1,
      category: "Location",
      title: "Kingdom Naming Conflict",
      description:
        "The same location appears with different names.",
      status: "Conflict",
      suggestion:
        "Use one consistent name throughout the story."
    });
  }

  if (
    story.includes("Magic cannot heal") &&
    story.includes("Magic healed instantly")
  ) {
    rules.push({
      id: 2,
      category: "Magic",
      title: "Magic Rule Conflict",
      description:
        "Healing rules contradict earlier world-building.",
      status: "Conflict",
      suggestion:
        "Revise the magic system or explain the exception."
    });
  }

  return rules;
}