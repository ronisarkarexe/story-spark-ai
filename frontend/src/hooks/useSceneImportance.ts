import { useEffect, useState } from "react";
import { analyzeScenes } from "../utils/sceneImportanceAnalyzer";

export function useSceneImportance(story: string) {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    setScores(analyzeScenes(story));
  }, [story]);

  return scores;
}