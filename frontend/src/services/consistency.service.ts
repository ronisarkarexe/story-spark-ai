import { API_BASE } from "../../helpers/config";
import axios from "axios";

const API_BASE = API_BASE;

export interface IConsistencyIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  location: string;
  suggestion: string;
}

export interface IConsistencyResult {
  consistencyScore: number;
  issues: IConsistencyIssue[];
  summary: string;
  charactersFound: string[];
  timelineEvents: string[];
}

export const analyzeStoryConsistency = async (
  storyText: string
): Promise<IConsistencyResult> => {
  const response = await axios.post(
    `${API_BASE}/story-consistency/analyze`,
    { storyText },
    { withCredentials: true }
  );
  return response.data.data;
};