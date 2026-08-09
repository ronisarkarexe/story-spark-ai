import { useMemo } from "react";
import { getEndingMetrics } from "../utils/endingSatisfaction";

export default function useEndingSatisfaction() {
  const metrics = useMemo(() => getEndingMetrics(), []);

  const overallScore = Math.round(
    metrics.reduce((sum, item) => sum + item.score, 0) /
      metrics.length
  );

  const rerunAnalysis = () => {
    alert("Ending analysis completed.");
  };

  return {
    metrics,
    overallScore,
    rerunAnalysis,
  };
}