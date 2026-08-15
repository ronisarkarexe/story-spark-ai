export interface ChecklistItem {
  id: number;
  title: string;
  passed: boolean;
  recommendation: string;
}

export function generateChecklist(): ChecklistItem[] {
  return [
    {
      id: 1,
      title: "Title Quality",
      passed: true,
      recommendation: "Title looks engaging."
    },
    {
      id: 2,
      title: "Grammar",
      passed: false,
      recommendation: "Review grammar before publishing."
    },
    {
      id: 3,
      title: "Readability",
      passed: true,
      recommendation: "Story is easy to read."
    },
    {
      id: 4,
      title: "Metadata",
      passed: false,
      recommendation: "Add missing keywords and tags."
    },
    {
      id: 5,
      title: "Plot Threads",
      passed: true,
      recommendation: "No major unresolved plot issues."
    },
    {
      id: 6,
      title: "Accessibility",
      passed: true,
      recommendation: "Formatting is reader-friendly."
    }
  ];
}