import { IKotlinAnalysisRequest, IKotlinAnalysisResponse, IKotlinAnalysisIssue } from "./kotlin_analysis.interface";

export const analyzeKotlinCode = async (payload: IKotlinAnalysisRequest): Promise<IKotlinAnalysisResponse> => {
  const issues: IKotlinAnalysisIssue[] = [];
  const lines = payload.code.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // 1. Not-null assertion operator (!!)
    if (line.includes("!!")) {
      issues.push({
        type: "NotNullAssertion",
        line: lineNumber,
        description: "Using the not-null assertion operator (!!) can cause NullPointerExceptions.",
        suggestion: "Use safe calls (?.) or Elvis operator (?:) instead.",
        severity: "error",
        codeSnippet: line.trim()
      });
    }

    // 2. Mutable variables (var)
    if (/\bvar\b/.test(line)) {
      issues.push({
        type: "MutableVariable",
        line: lineNumber,
        description: "Mutable variables (var) can lead to side effects and harder-to-maintain code.",
        suggestion: "Consider using read-only properties (val) if the value doesn't change.",
        severity: "warning",
        codeSnippet: line.trim()
      });
    }
  });

  const errorCount = issues.filter(i => i.severity === "error").length;
  const warningCount = issues.filter(i => i.severity === "warning").length;
  const infoCount = issues.filter(i => i.severity === "info").length;

  return {
    issues,
    summary: `Found ${issues.length} issue(s): ${errorCount} error(s), ${warningCount} warning(s), ${infoCount} info.`,
    clean: issues.length === 0,
    errorCount,
    warningCount,
    infoCount
  };
};

export const KotlinAnalysisService = {
  analyzeKotlinCode
};
