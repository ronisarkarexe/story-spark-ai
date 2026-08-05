export interface NarrativeIssue {
  id: number;

  type:
    | "Abrupt Transition"
    | "Repetition"
    | "Disconnected Scene"
    | "Weak Bridge";

  severity: "High" | "Medium" | "Low";

  scene: string;

  explanation: string;

  suggestion: string;
}