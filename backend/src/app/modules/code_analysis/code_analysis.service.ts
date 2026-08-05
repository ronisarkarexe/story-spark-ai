import { ICodeAnalysisRequest, ICodeAnalysisResponse, ICodeAnalysisIssue } from "./code_analysis.interface";

export const analyzeSwiftCode = async (payload: ICodeAnalysisRequest): Promise<ICodeAnalysisResponse> => {
  const issues: ICodeAnalysisIssue[] = [];
  const lines = payload.code.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // 1. Force Unwrapping (!)
    if (/\b\w+!\b/.test(line) && !line.includes("!=")) {
      issues.push({
        type: "ForceUnwrap",
        line: lineNumber,
        description: "Force unwrapping an optional can cause runtime crashes if the value is nil.",
        suggestion: "Use optional binding (if let or guard let) to safely unwrap the value.",
        severity: "error",
        codeSnippet: line.trim()
      });
    }

    // 2. Retain Cycles in Closures (checking for self. without weak self)
    if (line.includes("self.") && !payload.code.includes("[weak self]") && !payload.code.includes("[unowned self]")) {
      issues.push({
        type: "PotentialRetainCycle",
        line: lineNumber,
        description: "Using 'self.' inside a closure without a capture list might cause a retain cycle.",
        suggestion: "Consider using '[weak self]' or '[unowned self]' in the closure capture list.",
        severity: "warning",
        codeSnippet: line.trim()
      });
    }

    // 3. Print statements in production
    if (/print\(.*\)/.test(line) || /debugPrint\(.*\)/.test(line)) {
      issues.push({
        type: "PrintInProduction",
        line: lineNumber,
        description: "Print statements should generally be removed or replaced with a proper logging framework in production.",
        suggestion: "Remove the print statement or use a logger (e.g., OSLog).",
        severity: "info",
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

export const CodeAnalysisService = {
  analyzeSwiftCode
};
