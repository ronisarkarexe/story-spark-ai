export interface ICodeAnalysisRequest {
  code: string;
}

export interface ICodeAnalysisIssue {
  type: string;
  line: number;
  description: string;
  suggestion: string;
  severity: "error" | "warning" | "info";
  codeSnippet: string;
}

export interface ICodeAnalysisResponse {
  issues: ICodeAnalysisIssue[];
  summary: string;
  clean: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
}
