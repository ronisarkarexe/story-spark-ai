import { instance as apiClient } from "../helpers/axios/axionInstance";
import { getBaseUrl } from "../helpers/config";
import { Chapter } from "../types/story.types";

export const continueStory = async (
  chapters: Chapter[]
) => {
  const previousContent = chapters
    .map((chapter) => chapter.content)
    .join("\n\n");

  const response = await apiClient.post(
    `${getBaseUrl()}/story-continuation/continue`,
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