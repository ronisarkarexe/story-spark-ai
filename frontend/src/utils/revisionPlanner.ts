import { RevisionTask } from "../types/revision";

export function generateRevisionPlan(
  story: string
): RevisionTask[] {
  const tasks: RevisionTask[] = [];

  if (story.length < 1500) {
    tasks.push({
      id: 1,
      title: "Strengthen Introduction",
      description:
        "The opening could better hook readers.",
      priority: "High",
      category: "Introduction",
      completed: false,
    });
  }

  if (story.includes("suddenly")) {
    tasks.push({
      id: 2,
      title: "Improve Scene Transition",
      description:
        "Some transitions feel abrupt.",
      priority: "Medium",
      category: "Plot",
      completed: false,
    });
  }

  if ((story.match(/"/g) || []).length < 8) {
    tasks.push({
      id: 3,
      title: "Enhance Dialogue",
      description:
        "Dialogue can improve pacing and character depth.",
      priority: "Medium",
      category: "Dialogue",
      completed: false,
    });
  }

  tasks.push({
    id: 4,
    title: "Review Ending",
    description:
      "Ensure the ending resolves all major conflicts.",
    priority: "Low",
    category: "Ending",
    completed: false,
  });

  return tasks;
}