/**
 * engagement.service.test.ts
 * Unit tests for analyzeEngagement service
 */
import { analyzeEngagement } from "../app/modules/engagement/engagement.service";
import * as aiService from "../services/ai.service";
import * as aiModule from "../app/modules/ai";

jest.mock("../services/ai.service", () => ({
  generateStory: jest.fn(),
}));

jest.mock("../app/modules/ai", () => {
  const { z } = require("zod");
  const mockSchema = z.object({});
  return {
    safeParseAIResponse: jest.fn(),
    EngagementAnalysisResponseSchema: mockSchema,
  };
});

const MockedGenerate = aiService.generateStory as jest.Mock;
const MockedSafeParse = aiModule.safeParseAIResponse as jest.Mock;

const mockStoryResult = {
  story: '{"engagementScore":75,"chapterStrengthScore":80,"pacing":{"score":70,"label":"Well-Paced","feedback":"Good pacing"},"dialogueQuality":{"score":65,"feedback":"Some dialogue"},"emotionalIntensity":{"score":80,"feedback":"Strong emotions"},"suspenseLevel":{"score":60,"feedback":"Could use more suspense"},"readability":{"score":70,"feedback":"Readable"},"dropOffSections":[],"improvementSuggestions":["Add more dialogue"]}',
};

const mockParsedResponse = {
  engagementScore: 75,
  chapterStrengthScore: 80,
  pacing: { score: 70, label: "Well-Paced", feedback: "Good pacing" },
  dialogueQuality: { score: 65, feedback: "Some dialogue" },
  emotionalIntensity: { score: 80, feedback: "Strong emotions" },
  suspenseLevel: { score: 60, feedback: "Could use more suspense" },
  readability: { score: 70, feedback: "Readable" },
  dropOffSections: [],
  improvementSuggestions: ["Add more dialogue"],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("analyzeEngagement", () => {
  it("calls generateStory with a prompt containing the chapter text", async () => {
    (aiService.generateStory as jest.Mock).mockResolvedValue(mockStoryResult);
    (aiModule.safeParseAIResponse as jest.Mock).mockReturnValueOnce(mockParsedResponse);

    const result = await analyzeEngagement("This is a test chapter about adventures.");

    expect(aiService.generateStory).toHaveBeenCalledWith(
      expect.stringContaining("This is a test chapter")
    );
    expect(result.engagementScore).toBe(75);
  });

  it("includes title in the prompt when provided", async () => {
    (aiService.generateStory as jest.Mock).mockResolvedValue(mockStoryResult);
    (aiModule.safeParseAIResponse as jest.Mock).mockReturnValueOnce(mockParsedResponse);

    await analyzeEngagement("Test content", "My Story Title");

    expect(aiService.generateStory).toHaveBeenCalledWith(
      expect.stringContaining('titled "My Story Title"')
    );
  });

  it("calls safeParseAIResponse with the story content and schema", async () => {
    (aiService.generateStory as jest.Mock).mockResolvedValue(mockStoryResult);
    (aiModule.safeParseAIResponse as jest.Mock).mockReturnValueOnce(mockParsedResponse);

    await analyzeEngagement("Test chapter content");

    expect(aiModule.safeParseAIResponse).toHaveBeenCalledWith(
      mockStoryResult.story,
      expect.any(Object),
      expect.any(Object),
      { label: "engagement analysis" }
    );
  });

  it("returns the parsed engagement analysis result", async () => {
    (aiService.generateStory as jest.Mock).mockResolvedValue(mockStoryResult);
    (aiModule.safeParseAIResponse as jest.Mock).mockReturnValueOnce(mockParsedResponse);

    const result = await analyzeEngagement("Chapter content here");

    expect(result.engagementScore).toBe(75);
    expect(result.chapterStrengthScore).toBe(80);
    expect(result.pacing.label).toBe("Well-Paced");
  });

  it("truncates chapter text to 6000 characters in the prompt", async () => {
    (aiService.generateStory as jest.Mock).mockResolvedValue(mockStoryResult);
    (aiModule.safeParseAIResponse as jest.Mock).mockReturnValueOnce(mockParsedResponse);

    const longChapter = "word ".repeat(5000); // > 6000 chars
    await analyzeEngagement(longChapter);

    const callArg = (aiService.generateStory as jest.Mock).mock.calls[0][0] as string;
    // The prompt includes the chapter content after "Chapter:\n---\n"
    const chapterInPrompt = callArg.split("Chapter:\n---\n")[1]?.split("\n---")[0];
    expect(chapterInPrompt!.length).toBeLessThanOrEqual(6000);
  });

  it("returns fallback when safeParseAIResponse uses the fallback on parse failure", async () => {
    const fallbackResponse = {
      engagementScore: 50,
      chapterStrengthScore: 50,
      pacing: { score: 50, label: "Well-Paced", feedback: "Unable to analyze pacing automatically." },
      dialogueQuality: { score: 50, feedback: "Unable to analyze dialogue quality automatically." },
      emotionalIntensity: { score: 50, feedback: "Unable to analyze emotional intensity automatically." },
      suspenseLevel: { score: 50, feedback: "Unable to analyze suspense level automatically." },
      readability: { score: 50, feedback: "Unable to analyze readability automatically." },
      dropOffSections: [],
      improvementSuggestions: ["We couldn't parse the AI analysis."],
    };
    (aiService.generateStory as jest.Mock).mockResolvedValue(mockStoryResult);
    (aiModule.safeParseAIResponse as jest.Mock).mockImplementation((_text: string, _schema: any, fallback: any) => fallback);

    const result = await analyzeEngagement("Some content");

    expect(result.engagementScore).toBe(50); // fallback score
    expect(aiModule.safeParseAIResponse).toHaveBeenCalled();
  });
});
