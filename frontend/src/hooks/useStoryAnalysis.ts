import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { analyzeStory } from "../utils/storyAssistant";

export function useStoryAnalysis(story: string) {
  const [debouncedStory] = useDebounce(story, 500);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    setSuggestions(analyzeStory(debouncedStory));
  }, [debouncedStory]);

  return suggestions;
}