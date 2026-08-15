import { useEffect, useState } from "react";
import { analyzeNarrativeFlow } from "../utils/narrativeFlowAnalyzer";
import type { NarrativeIssue } from "../types/narrative";

export function useNarrativeFlow(story: string) {

  const [issues, setIssues] = useState<NarrativeIssue[]>([]);

  useEffect(() => {
    setIssues(analyzeNarrativeFlow(story));
  }, [story]);

  return {
    issues,
    setIssues
  };

}
