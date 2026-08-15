import { useMemo } from "react";
import { analyzeRepetition } from "../utils/repetitionAnalyzer";

export const useRepetitionAnalysis = (story: string) =>
  useMemo(() => analyzeRepetition(story), [story]);
