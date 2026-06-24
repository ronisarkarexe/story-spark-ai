export interface IBugReport {
  title: string;
  category: string;
  severity: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  email?: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt?: Date;
  updatedAt?: Date;
  screenshotUrl?: string;
}
