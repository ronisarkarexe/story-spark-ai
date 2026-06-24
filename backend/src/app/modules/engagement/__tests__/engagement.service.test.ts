import { analyzeEngagement } from "../engagement.service";

jest.mock("../../../services/ai.service", () => ({
  generateStory: jest.fn(),
}));

import { generateStory } from "../../../services/ai.service";

const mockGenerateStory = generateStory as jest.MockedFunction<typeof generateStory>;

const validAIResponse = {
  engagementScore: 85,
  chapterStrengthScore: 78,
  pacing: { score: 80, label: "Well-Paced", feedback: "Good pacing throughout." },
  dialogueQuality: { score: 75, feedback: "Natural and engaging dialogue." },
  emotionalIntensity: { score: 70, feedback: "Moderate emotional depth." },
  suspenseLevel: { score: 65, feedback: "Some suspenseful moments." },
  readability: { score: 88, feedback: "Easy to read." },
  dropOffSections: [],
  improvementSuggestions: ["Consider adding more sensory details."],
};

describe("analyzeEngagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns AI response when generateStory returns valid JSON matching schema", async () => {
    mockGenerateStory.mockResolvedValue({
      story: JSON.stringify(validAIResponse),
      provider: "openai",
      fallbackUsed: false,
    });

    const result = await analyzeEngagement("A long chapter about a hero's journey.");

    expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    const promptArg = mockGenerateStory.mock.calls[0][0] as string;
    expect(promptArg).toContain("You are an expert literary editor");
    expect(promptArg).toContain("engagementScore");
    expect(result.engagementScore).toBe(85);
    expect(result.chapterStrengthScore).toBe(78);
  });

  it("returns fallback when generateStory returns malformed JSON", async () => {
    mockGenerateStory.mockResolvedValue({
      story: "This is not JSON at all",
      provider: "openai",
      fallbackUsed: false,
    });

    const result = await analyzeEngagement("A long chapter.");

    expect(result.engagementScore).toBe(50);
    expect(result.chapterStrengthScore).toBe(50);
    expect(result.dropOffSections).toEqual([]);
    expect(result.improvementSuggestions).toContain(
      "We couldn't parse the AI analysis. Try rephrasing your chapter or try again later."
    );
  });

  it("returns fallback when generateStory throws an error", async () => {
    mockGenerateStory.mockRejectedValue(new Error("AI service unavailable"));

    const result = await analyzeEngagement("A long chapter.");

    expect(result.engagementScore).toBe(50);
    expect(result.chapterStrengthScore).toBe(50);
    expect(result.dropOffSections).toEqual([]);
  });

  it("includes title in the prompt when title is provided", async () => {
    mockGenerateStory.mockResolvedValue({
      story: JSON.stringify(validAIResponse),
      provider: "openai",
      fallbackUsed: false,
    });

    await analyzeEngagement("A long chapter.", "My Epic Tale");

    const promptArg = mockGenerateStory.mock.calls[0][0] as string;
    expect(promptArg).toContain('titled "My Epic Tale"');
  });

  it("omits title reference in the prompt when title is undefined", async () => {
    mockGenerateStory.mockResolvedValue({
      story: JSON.stringify(validAIResponse),
      provider: "openai",
      fallbackUsed: false,
    });

    await analyzeEngagement("A long chapter.");

    const promptArg = mockGenerateStory.mock.calls[0][0] as string;
    expect(promptArg).not.toContain('titled "');
  });

  it("truncates chapter text to 6000 characters in the prompt", async () => {
    mockGenerateStory.mockResolvedValue({
      story: JSON.stringify(validAIResponse),
      provider: "openai",
      fallbackUsed: false,
    });

    const longChapter = "x".repeat(10000);
    await analyzeEngagement(longChapter);

    const promptArg = mockGenerateStory.mock.calls[0][0] as string;
    // The chapter in the prompt should not exceed 6000 chars
    const chapterStart = promptArg.indexOf("Chapter:\n---\n") + "Chapter:\n---\n".length;
    const chapterEnd = promptArg.indexOf("\n---", chapterStart);
    const chapterInPrompt = promptArg.slice(chapterStart, chapterEnd);
    expect(chapterInPrompt.length).toBe(6000);
  });

  it("returns partial schema fields from AI when some fields are missing", async () => {
    const partialResponse = {
      engagementScore: 75,
      // intentionally missing other fields
    };

    mockGenerateStory.mockResolvedValue({
      story: JSON.stringify(partialResponse),
      provider: "openai",
      fallbackUsed: false,
    });

    // With partial data, zod will throw during schema.parse, triggering fallback
    const result = await analyzeEngagement("A long chapter.");
    // The fallback should be returned when Zod validation fails
    expect(result.engagementScore).toBe(50);
  });
});
