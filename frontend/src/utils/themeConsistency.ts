export interface ThemeReport {
  theme: string;
  consistency: number;
  weakChapter: string;
  suggestion: string;
}

export const getThemeReport = (): ThemeReport[] => [
  {
    theme: "Friendship",
    consistency: 91,
    weakChapter: "Chapter 6",
    suggestion: "Add more interactions between the main characters.",
  },
  {
    theme: "Hope",
    consistency: 78,
    weakChapter: "Chapter 8",
    suggestion: "Include hopeful dialogue before the climax.",
  },
  {
    theme: "Sacrifice",
    consistency: 66,
    weakChapter: "Chapter 10",
    suggestion: "Strengthen the protagonist's motivation.",
  },
];