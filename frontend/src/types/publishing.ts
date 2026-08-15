export interface ChecklistItem {
  id: number;
  category: string;
  status: "Passed" | "Warning" | "Failed";
  message: string;
  suggestion: string;
}
