import { useEffect, useState } from "react";
import { analyzeWorldConsistency } from "../utils/worldConsistencyAnalyzer";
import type { WorldRule } from "../types/world";

export function useWorldConsistency(story: string) {

  const [rules, setRules] = useState<WorldRule[]>([]);

  useEffect(() => {
    setRules(analyzeWorldConsistency(story));
  }, [story]);

  return {
    rules,
    setRules,
  };
}
