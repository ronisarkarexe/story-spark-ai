export interface RevisionTask {
  id: number;
  title: string;
  description: string;

  priority: "High" | "Medium" | "Low";

  category:
    | "Introduction"
    | "Dialogue"
    | "Characters"
    | "Plot"
    | "Ending"
    | "Grammar";

  completed: boolean;
}

export interface Revision {
  id: string;
  timestamp: string;
  summary: string;
  content: string;
}
