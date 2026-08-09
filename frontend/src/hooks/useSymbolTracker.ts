import { useMemo } from "react";
import { analyzeSymbols } from "../utils/symbolTracker";

export default function useSymbolTracker(story: string) {
  return useMemo(() => {
    return analyzeSymbols(story);
  }, [story]);
}