import { useMemo } from "react";
import { analyzeStory } from "../utils/publishingAnalyzer";

export const usePublishingChecklist = (story: string) =>
  useMemo(() => analyzeStory(story), [story]);
