export interface WorldRule {
  id: number;

  category:
    | "Location"
    | "Magic"
    | "Technology"
    | "History"
    | "Currency"
    | "Organization"
    | "Custom";

  title: string;

  description: string;

  status: "Consistent" | "Conflict";

  suggestion: string;
}