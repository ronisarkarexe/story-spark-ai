import { useEffect, useState } from "react";
import { analyzeNarrativeFlow } from "../utils/narrativeFlowAnalyzer";

export function useNarrativeFlow(story: string) {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    setIssues(analyzeNarrativeFlow(story));
  }, [story]);

  return {
    issues,
    setIssues
  };
}