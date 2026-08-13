import { useEffect, useState } from "react";
import { analyzeWorldConsistency } from "../utils/worldConsistencyAnalyzer";

export function useWorldConsistency(story: string) {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    setRules(analyzeWorldConsistency(story));
  }, [story]);

  return {
    rules,
    setRules,
  };
}