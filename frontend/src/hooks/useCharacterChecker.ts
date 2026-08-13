import { useState } from "react";
import { checkNameConsistency } from "../utils/nameConsistency";

export default function useCharacterChecker() {
  const [issues, setIssues] = useState<any[]>([]);

  const analyzeStory = (story: string) => {
    const result = checkNameConsistency(story);
    setIssues(result);
  };

  const replaceName = (
    story: string,
    oldName: string,
    newName: string
  ) => {
    return story.split(oldName).join(newName);
  };

  return {
    issues,
    analyzeStory,
    replaceName,
  };
}