export interface RevisionItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export function generateRevisionChecklist() {
  return [
    {
      id: 1,
      title: "Grammar & Spelling",
      description: "Review grammar, spelling, and punctuation.",
      completed: false,
    },
    {
      id: 2,
      title: "Story Title",
      description: "Ensure the title is engaging and relevant.",
      completed: false,
    },
    {
      id: 3,
      title: "Pacing",
      description: "Check whether the story flows naturally.",
      completed: false,
    },
    {
      id: 4,
      title: "Character Consistency",
      description: "Verify consistent character behavior and traits.",
      completed: false,
    },
    {
      id: 5,
      title: "Dialogue Quality",
      description: "Ensure dialogue sounds natural.",
      completed: false,
    },
    {
      id: 6,
      title: "Ending Satisfaction",
      description: "Confirm the ending feels complete and satisfying.",
      completed: false,
    },
  ] as RevisionItem[];
}

export function completedCount(items: RevisionItem[]) {
  return items.filter((item) => item.completed).length;
}

export function remainingCount(items: RevisionItem[]) {
  return items.length - completedCount(items);
}