// ─────────────────────────────────────────────────────────────────────────────
// Prompt Analysis Feature - Types and Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface IPromptAnalysisRequest {
  prompt: string;
  language?: string;
  genre?: string;
  tone?: string;
}

export interface IPromptAnalysisResponse {
  prompt: string;
  creativityScore: number; // 0-100
  enhancedPrompt: string;
  improvements: string[]; // At least 3 suggestions
  keywords: string[];
  promptLength: number;
  estimatedGenerationTime: number; // in seconds
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

export interface IPromptAnalysisMetrics {
  totalAnalyzed: number;
  averageCreativityScore: number;
  topKeywords: string[];
  commonIssues: string[];
}
