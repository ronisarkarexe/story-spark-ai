export interface IKotlinAnalysisRequest {
  code: string;
}

export interface IKotlinAnalysisIssue {
  type: string;
  line: number;
  description: string;
  suggestion: string;
  severity: "error" | "warning" | "info";
  codeSnippet: string;
}

export interface IKotlinAnalysisResponse {
  issues: IKotlinAnalysisIssue[];
  summary: string;
  clean: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
}
