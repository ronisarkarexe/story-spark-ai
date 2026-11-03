import { useMemo } from "react";
import { getThemeReport } from "../utils/themeConsistency";

export default function useThemeConsistency() {
  const themes = useMemo(() => getThemeReport(), []);

  const rerunAnalysis = () => {
    alert("Theme consistency analysis completed.");
  };

  const average = Math.round(
    themes.reduce((sum, item) => sum + item.consistency, 0) /
      themes.length
  );

  return {
    themes,
    average,
    rerunAnalysis,
  };
}