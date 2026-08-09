import { useMemo } from "react";
import { getStoryMetrics } from "../utils/writingStyleComparison";

export default function useWritingStyleComparison(
  stories: { title: string; content: string }[]
) {
  return useMemo(() => {
    return stories.map((story) =>
      getStoryMetrics(story.title, story.content)
    );
  }, [stories]);
}