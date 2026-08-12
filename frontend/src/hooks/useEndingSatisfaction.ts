import { useMemo } from "react";
import { getEndingMetrics } from "../utils/endingSatisfaction";

interface UseEndingSatisfactionOptions {
  onComplete?: () => void;
}

export default function useEndingSatisfaction(options: UseEndingSatisfactionOptions = {}) {
  const { onComplete } = options;

  const metrics = useMemo(() => getEndingMetrics(), []);

  const overallScore = Math.round(
    metrics.reduce((sum, item) => sum + item.score, 0) /
      metrics.length
  );

  const rerunAnalysis = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return {
    metrics,
    overallScore,
    rerunAnalysis,
  };
}
