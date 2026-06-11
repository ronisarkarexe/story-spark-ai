import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getEducationalInsights } from "./educational-insights.service";

vi.mock("axios");

describe("Educational Insights Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully fetch insights from the API", async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          vocabulary: [
            {
              word: "resilient",
              definition: "strong",
              example: "resilient story",
            },
          ],
          comprehensionQuestions: ["Q1"],
          discussionQuestions: ["D1"],
          themes: [{ theme: "Courage", explanation: "Brave" }],
          moralLessons: ["M1"],
          writingPrompts: ["W1"],
          readingLevel: {
            gradeLevel: "Grade 3",
            ageRange: "8-10",
            explanation: "Heuristics",
          },
        },
      },
    };

    vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

    const result = await getEducationalInsights("story-123");

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/stories/story-123/educational-insights"),
      {},
      { withCredentials: true }
    );
    expect(result.readingLevel.gradeLevel).toBe("Grade 3");
    expect(result.vocabulary[0].word).toBe("resilient");
  });
});
