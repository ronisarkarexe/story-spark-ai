import { useEffect, useState } from "react";
import { analyzeStory } from "../utils/storyAssistant";

function debounce<T extends (...args: string[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, wait);
  };
  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced as ((...args: Parameters<T>) => void) & { cancel: () => void };
}

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