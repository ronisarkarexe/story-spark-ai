import axios from "axios";
import { getBaseUrl } from "../helpers/config";

const API_BASE = getBaseUrl();

export interface IPromptAnalysisRequest {
  prompt: string;
  language?: string;
  genre?: string;
  tone?: string;
}

export interface IPromptAnalysisResponse {
  prompt: string;
  creativityScore: number;
  enhancedPrompt: string;
  improvements: string[];
  keywords: string[];
  promptLength: number;
  estimatedGenerationTime: number;
  sentimentScore: {
    positive: number;
    neutral: number;
    negative: number;
  };
  complexity: "simple" | "moderate" | "complex";
  recommendations: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
  }[];
}

/**
 * Analyze a single prompt
 */
export const analyzePrompt = async (
  request: IPromptAnalysisRequest
): Promise<IPromptAnalysisResponse> => {
  const response = await axios.post(
    `${API_BASE}/prompt-analysis/analyze`,
    request,
    { withCredentials: true }
  );
  const data = response.data?.data;
  if (!data || typeof data !== "object") {
    throw new Error("analyzePrompt: invalid response shape from backend.");
  }
  return data as IPromptAnalysisResponse;
};

/**
 * Enhance a prompt (subset of full analysis)
 */
export const enhancePrompt = async (
  request: IPromptAnalysisRequest
): Promise<{
  originalPrompt: string;
  enhancedPrompt: string;
  improvements: string[];
  keywords: string[];
}> => {
  const response = await axios.post(
    `${API_BASE}/prompt-analysis/enhance`,
    request,
    { withCredentials: true }
  );
  const data = response.data?.data;
  if (!data || typeof data !== "object") {
    throw new Error("enhancePrompt: invalid response shape from backend.");
  }
  return data;
};

/**
 * Analyze multiple prompts in batch
 */
export const batchAnalyzePrompts = async (
  prompts: IPromptAnalysisRequest[]
): Promise<IPromptAnalysisResponse[]> => {
  const response = await axios.post(
    `${API_BASE}/prompt-analysis/batch`,
    { prompts },
    { withCredentials: true }
  );
  const data = response.data?.data;
  if (!Array.isArray(data)) {
    throw new Error("batchAnalyzePrompts: expected array from backend.");
  }
  return data as IPromptAnalysisResponse[];
};
