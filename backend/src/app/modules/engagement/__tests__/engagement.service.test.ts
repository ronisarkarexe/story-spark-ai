// Mock the dependencies BEFORE importing the service
jest.mock("../../../../services/ai.service", () => ({
  generateStory: jest.fn(),
}));

import { analyzeEngagement } from "../engagement.service";
import { generateStory } from "../../../../services/ai.service";

// Jest globals (this repo compiles tests without pulling in Jest types into the TS program)
/* eslint-disable @typescript-eslint/no-explicit-any */

declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;

const mockGenerateStory = generateStory as jest.MockedFunction<typeof generateStory>;

describe("EngagementService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validResponseData = {
    engagementScore: 85,
    chapterStrengthScore: 90,
    pacing: { score: 80, label: "Well-Paced", feedback: "Pacing is excellent." },
    dialogueQuality: { score: 75, feedback: "Dialogue is engaging." },
    emotionalIntensity: { score: 85, feedback: "Intense emotion." },
    suspenseLevel: { score: 70, feedback: "Good suspense." },
    readability: { score: 90, feedback: "Very readable." },
    dropOffSections: [{ excerpt: "Excerpt text", reason: "Slowing down", suggestion: "Speed up" }],
    improvementSuggestions: ["Increase action in middle", "Show more, tell less"],
  };

  const fallbackData = {
    engagementScore: 50,
    chapterStrengthScore: 50,
    pacing: { score: 50, label: "Well-Paced", feedback: "Unable to analyze pacing automatically." },
    dialogueQuality: { score: 50, feedback: "Unable to analyze dialogue quality automatically." },
    emotionalIntensity: { score: 50, feedback: "Unable to analyze emotional intensity automatically." },
    suspenseLevel: { score: 50, feedback: "Unable to analyze suspense level automatically." },
    readability: { score: 50, feedback: "Unable to analyze readability automatically." },
    dropOffSections: [],
    improvementSuggestions: [
      "We couldn't parse the AI analysis. Try rephrasing your chapter or try again later.",
    ],
  };

  it("should call generateStory with the correct prompt structure", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify(validResponseData),
      provider: "openai",
      fallbackUsed: false,
    });

    const chapterText = "It was a dark and stormy night.";
    await analyzeEngagement(chapterText);

    expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    expect(mockGenerateStory).toHaveBeenCalledWith(
      expect.stringContaining("You are an expert literary editor.")
    );
    expect(mockGenerateStory).toHaveBeenCalledWith(
      expect.stringContaining(chapterText)
    );
  });

  it("should return the result as-is when AI returns valid JSON matching EngagementAnalysisResponseSchema", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify(validResponseData),
      provider: "openai",
      fallbackUsed: false,
    });

    const result = await analyzeEngagement("Chapter text content");
    expect(result).toEqual(validResponseData);
  });

  it("should return the fallback object when AI returns malformed JSON", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: "malformed-json-here{",
      provider: "openai",
      fallbackUsed: false,
    });

    const result = await analyzeEngagement("Chapter text content");
    expect(result).toEqual(fallbackData);
  });

  it("should return the fallback object when AI throws/rejects", async () => {
    mockGenerateStory.mockRejectedValueOnce(new Error("AI pipeline failed"));

    const result = await analyzeEngagement("Chapter text content");
    expect(result).toEqual(fallbackData);
  });

  it("should include the title parameter in the prompt when provided", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify(validResponseData),
      provider: "openai",
      fallbackUsed: false,
    });

    const title = "The Crimson Blade";
    await analyzeEngagement("Chapter text content", title);

    expect(mockGenerateStory).toHaveBeenCalledWith(
      expect.stringContaining('titled "The Crimson Blade"')
    );
  });

  it("should omit the title parameter from the prompt when undefined", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify(validResponseData),
      provider: "openai",
      fallbackUsed: false,
    });

    await analyzeEngagement("Chapter text content", undefined);

    expect(mockGenerateStory).not.toHaveBeenCalledWith(
      expect.stringContaining('titled')
    );
  });
});
