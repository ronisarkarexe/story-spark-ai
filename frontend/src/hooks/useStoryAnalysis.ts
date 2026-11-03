import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { analyzeStory } from "../utils/storyAssistant";

export function useStoryAnalysis(story: string) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const update = debounce(() => {
      setSuggestions(analyzeStory(story));
    }, 500);

    update();

    return () => update.cancel();
  }, [story]);

  return suggestions;
}