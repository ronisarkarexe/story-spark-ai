import axios from "axios";
import { getBaseUrl } from "../helpers/config";

// Resolved inside each function — avoids frozen 'undefined' if env
// vars are not yet available at module import time
const getApiBase = (): string => {
  const base = getBaseUrl();
  if (!base) {
    throw new Error(
      "[prompt_analysis.service] API base URL is not configured. Set VITE_BASE_URL in your environment."
    );
  }
  return base;
};

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
    `${getApiBase()}/prompt-analysis/analyze`,
    request,
    { withCredentials: true }
  );
  return response.data.data;
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
    `${getApiBase()}/prompt-analysis/enhance`,
    request,
    { withCredentials: true }
  );
  return response.data.data;
};

/**
 * Analyze multiple prompts in batch
 */
export const batchAnalyzePrompts = async (
  prompts: IPromptAnalysisRequest[]
): Promise<IPromptAnalysisResponse[]> => {
  const response = await axios.post(
    `${getApiBase()}/prompt-analysis/batch`,
    { prompts },
    { withCredentials: true }
  );
  return response.data.data;
};
