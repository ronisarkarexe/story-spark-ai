import { instance as axios } from "../helpers/axios/axiosInstance";
import { Chapter } from "../types/story.types";
import { getBaseUrl } from "../helpers/config";

const BASE_URL = getBaseUrl();

export const continueStory = async (
  chapters: Chapter[]
) => {
  const previousContent = chapters
    .map((chapter) => chapter.content)
    .join("\n\n");

  const response = await axios.post(
    `${BASE_URL}/story-continuation/continue`,
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

  return response.data.data.continuation;
};