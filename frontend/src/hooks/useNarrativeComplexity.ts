import { useMemo } from "react";
import {
  getComplexityMetrics,
  getRecommendation,
} from "../utils/narrativeComplexity";

export default function useNarrativeComplexity() {
  const metrics = useMemo(() => getComplexityMetrics(), []);

  const average = Math.round(
    metrics.reduce((sum, item) => sum + item.score, 0) /
      metrics.length
  );

  return {
    metrics,
    average,
    recommendation: getRecommendation(average),
  };
}