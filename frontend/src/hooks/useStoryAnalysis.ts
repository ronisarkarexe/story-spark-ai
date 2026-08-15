import { useEffect, useState } from "react";
import { analyzeStory, type Suggestion } from "../utils/storyAssistant";

export function useStoryAnalysis(story: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSuggestions(analyzeStory(story));
    }, 500);
    return () => window.clearTimeout(timer);
  }, [story]);

  return suggestions;
}
