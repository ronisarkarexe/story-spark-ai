import { useMemo } from "react";
import { analyzeSceneTransitions } from "../utils/sceneTransition";

export default function useSceneTransition(
  story: string
) {
  return useMemo(() => {
    return analyzeSceneTransitions(story);
  }, [story]);
}