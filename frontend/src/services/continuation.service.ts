import axios from "../helpers/axios/axiosInstance";
import { Chapter } from "../types/story.types";

const API_BASE = "/v1";

export const continueStory = async (chapters: Chapter[]) => {
  const previousContent = chapters
    .map((chapter) => chapter.content)
    .join("\n\n");

  try {
    const response = await axios.post(
      `${API_BASE}/ai_model/continue-story`,
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
      },
      { withCredentials: true }
    );

    return response.data.data.continuation;
  } catch (error) {
    console.error("Story continuation request failed:", error);
    throw new Error("Failed to continue story.");
  }
};

/**
 * Generate multiple story continuations (batch) based on the provided chapters.
 * @param chapters - Array of Chapter objects representing the current story.
 * @param count - Desired number of continuations (default 3, capped at 5).
 * @returns An array of continuation strings.
 */
export const getContinuations = async (
  chapters: Chapter[],
  count: number = 3
): Promise<string[]> => {
  const previousContent = chapters.map((c) => c.content).join("\n\n");
  try {
    const response = await axios.post(
      `${API_BASE}/ai_model/continue-story`,
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
        count,
      },
      { withCredentials: true }
    );
    const data = response.data.data;
    if (Array.isArray(data)) {
      return data.map((item: any) => item.continuation ?? "");
    }
    return [];
  } catch (error) {
    console.error("Story batch continuation request failed:", error);
    throw new Error("Failed to generate story continuations.");
  }
};