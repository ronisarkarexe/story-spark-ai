import axios from "axios";
import { Chapter } from "../types/story.types";

export const continueStory = async (
  chapters: Chapter[]
) => {
  const previousContent = chapters
    .map((chapter) => chapter.content)
    .join("\n\n");

  const response = await axios.post(
    "http://localhost:5000/api/v1/story-continuation/continue",
    {
      prompt: `
Continue this story naturally.

Rules:
- Maintain character consistency
- Keep emotional tone
- Avoid repetition
- Continue the narrative smoothly

Story:
${previousContent}
      `,
    }
  );

  return response.data.text;
};