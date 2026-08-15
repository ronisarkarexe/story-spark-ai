export interface RepetitionIssue {
  id: number;
  type: string;
  repeatedText: string;
  occurrences: number;
  severity: "High" | "Medium" | "Low";
  suggestion: string;
}
