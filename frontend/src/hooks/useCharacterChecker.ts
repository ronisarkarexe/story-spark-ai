import { useState } from "react";
import { checkNameConsistency } from "../utils/nameConsistency";

export default function useCharacterChecker() {

  const [issues, setIssues] = useState([]);

  const analyzeStory = (story: string) => {
    const result = checkNameConsistency(story);
    setIssues(result);
  };

  const replaceName = (
    story: string,
    oldName: string,
    newName: string
  ) => {
    return story.replaceAll(oldName, newName);
  };

  return {
    issues,
    analyzeStory,
    replaceName,
  };
}