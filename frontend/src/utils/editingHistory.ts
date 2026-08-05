export interface SuggestionHistory {
  id: number;
  suggestion: string;
  status: "Accepted" | "Rejected";
  timestamp: string;
}

export function getSuggestionHistory(): SuggestionHistory[] {
  return [
    {
      id: 1,
      suggestion: "Replace repetitive adjective in paragraph 2.",
      status: "Accepted",
      timestamp: "2026-08-05 10:15",
    },
    {
      id: 2,
      suggestion: "Shorten dialogue in Chapter 3.",
      status: "Rejected",
      timestamp: "2026-08-05 11:20",
    },
    {
      id: 3,
      suggestion: "Improve scene transition before final chapter.",
      status: "Accepted",
      timestamp: "2026-08-05 12:05",
    },
  ];
}