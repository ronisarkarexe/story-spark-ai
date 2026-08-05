import { analyzeEngagement } from "../engagement.service";

jest.mock("../../../services/ai.service");

const mockGenerateStory = jest.requireMock(
  "../../../services/ai.service"
).generateStory as jest.MockedFunction<
  (prompt: string) => Promise<{ story: string }>
>;

describe("analyzeEngagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a valid response structure", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        engagementScore: 80,
        chapterStrengthScore: 75,
        pacing: { score: 70, label: "Well-Paced", feedback: "Good pacing." },
        dialogueQuality: { score: 85, feedback: "Natural dialogue." },
        emotionalIntensity: { score: 90, feedback: "Strong emotions." },
        suspenseLevel: { score: 65, feedback: "Some tension." },
        readability: { score: 88, feedback: "Easy to read." },
        dropOffSections: [],
        improvementSuggestions: ["Add more dialogue."],
      }),
    });

    const result = await analyzeEngagement("Once upon a time in a kingdom.");

    expect(result).toHaveProperty("engagementScore");
    expect(result).toHaveProperty("chapterStrengthScore");
    expect(result).toHaveProperty("pacing");
    expect(result).toHaveProperty("dialogueQuality");
    expect(result).toHaveProperty("emotionalIntensity");
    expect(result).toHaveProperty("suspenseLevel");
    expect(result).toHaveProperty("readability");
    expect(result).toHaveProperty("dropOffSections");
    expect(result).toHaveProperty("improvementSuggestions");
  });

  it("returns fallback response when AI returns invalid JSON", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: "This is not JSON at all",
    });

    const result = await analyzeEngagement("Some chapter text");

    expect(result.engagementScore).toBe(50);
    expect(result.chapterStrengthScore).toBe(50);
    expect(result.pacing.score).toBe(50);
    expect(result.dropOffSections).toEqual([]);
    expect(result.improvementSuggestions).toContain(
      "We couldn't parse the AI analysis. Try rephrasing your chapter or try again later."
    );
  });

  it("returns fallback response when AI returns partial JSON", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: '{ "engagementScore": "not a number" }',
    });

    const result = await analyzeEngagement("Chapter content here");

    expect(result.engagementScore).toBe(50);
  });

  it("calls generateStory with a prompt containing the chapter text", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        engagementScore: 60,
        chapterStrengthScore: 60,
        pacing: { score: 60, label: "Well-Paced", feedback: "Ok." },
        dialogueQuality: { score: 60, feedback: "Ok." },
        emotionalIntensity: { score: 60, feedback: "Ok." },
        suspenseLevel: { score: 60, feedback: "Ok." },
        readability: { score: 60, feedback: "Ok." },
        dropOffSections: [],
        improvementSuggestions: [],
      }),
    });

    await analyzeEngagement("My amazing chapter content", "My Story Title");

    expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    const callArg = mockGenerateStory.mock.calls[0][0];
    expect(callArg).toContain("My amazing chapter content");
    expect(callArg).toContain("My Story Title");
  });

  it("truncates chapter text to 6000 chars in the prompt", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        engagementScore: 50,
        chapterStrengthScore: 50,
        pacing: { score: 50, label: "Well-Paced", feedback: "." },
        dialogueQuality: { score: 50, feedback: "." },
        emotionalIntensity: { score: 50, feedback: "." },
        suspenseLevel: { score: 50, feedback: "." },
        readability: { score: 50, feedback: "." },
        dropOffSections: [],
        improvementSuggestions: [],
      }),
    });

    const longText = "x".repeat(8000);
    await analyzeEngagement(longText);

    const callArg = mockGenerateStory.mock.calls[0][0];
    expect(callArg.length).toBeLessThan(9000);
  });

  it("handles empty chapter text", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        engagementScore: 40,
        chapterStrengthScore: 40,
        pacing: { score: 40, label: "Well-Paced", feedback: "." },
        dialogueQuality: { score: 40, feedback: "." },
        emotionalIntensity: { score: 40, feedback: "." },
        suspenseLevel: { score: 40, feedback: "." },
        readability: { score: 40, feedback: "." },
        dropOffSections: [],
        improvementSuggestions: [],
      }),
    });

    const result = await analyzeEngagement("");
    expect(result).toHaveProperty("engagementScore");
  });
});
