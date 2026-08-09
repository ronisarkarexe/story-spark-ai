import { Revision } from "../types/revision";

export const createRevision = (
  content: string,
  summary: string = "Story updated"
): Revision => ({
  id: Date.now().toString(),
  timestamp: new Date().toLocaleString(),
  summary,
  content,
});