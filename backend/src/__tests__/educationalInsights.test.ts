jest.mock("../config", () => ({
  __esModule: true,
  default: {
    gemini_api_key: "fake-api-key",
  },
}));

import { EducationalInsightsController } from "../app/modules/educational-insights/educational-insights.controller";
import { EducationalInsightsService } from "../app/modules/educational-insights/educational-insights.service";
import { Post } from "../app/modules/post/post.model";
import { Request, Response } from "express";
import sendResponse from "../shared/send_response";
import ApiError from "../errors/api_error";

jest.mock("../app/modules/post/post.model", () => ({
  Post: {
    findById: jest.fn(),
  },
}));

jest.mock("../shared/send_response", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockState = {
  textResponse: "{}"
};

jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockImplementation(() => {
            return {
              response: {
                text: () => mockState.textResponse,
              },
            };
          }),
        }),
      };
    }),
  };
});

describe("EducationalInsights Controller & Service", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { storyId: "60c72b2f9b1d8e234c8d4512" },
      user: { _id: "user_abc", role: "user" } as any,
    };
    mockRes = {};
  });

  it("should successfully estimate reading level locally using heuristics", () => {
    const text = "This is a simple sentence. Here is another one. And a third simple sentence.";
    const result = EducationalInsightsService.estimateReadingLevel(text);
    expect(result.gradeLevel).toBeDefined();
    expect(result.ageRange).toBeDefined();
    expect(result.explanation).toContain("words per sentence");
  });

  it("should fail to generate insights if story does not exist", async () => {
    (Post.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      EducationalInsightsService.generateEducationalInsights("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should fail to generate insights if user is not authorized to access the story", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "Title",
      content: "Content",
      author: "user_other",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    await expect(
      EducationalInsightsService.generateEducationalInsights("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should fail to generate insights if story content is empty", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "Title",
      content: "",
      author: "user_abc",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    await expect(
      EducationalInsightsService.generateEducationalInsights("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should successfully generate insights from mock story content using controller", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "The Brave Little Rabbit",
      content: "Once upon a time, there was a very brave rabbit named Barnaby. Barnaby loved to explore the enchanted forest. He was resilient and courageous.",
      author: "user_abc",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    const mockAiResponseText = JSON.stringify({
      vocabulary: [
        { word: "resilient", definition: "Able to withstand or recover quickly from difficult conditions.", example: "He was resilient and courageous." }
      ],
      comprehensionQuestions: ["Who is Barnaby?"],
      discussionQuestions: ["What makes someone courageous?"],
      themes: [{ theme: "Courage", explanation: "Barnaby shows courage by exploring." }],
      moralLessons: ["Be brave in the face of fear."],
      writingPrompts: ["Write a story about Barnaby's next adventure."]
    });

    mockState.textResponse = mockAiResponseText;

    const mockNext = jest.fn();
    await EducationalInsightsController.generateEducationalInsights(mockReq as Request, mockRes as Response, mockNext);

    expect(sendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      statusCode: 200,
      success: true,
      data: expect.objectContaining({
        vocabulary: expect.any(Array),
        readingLevel: expect.objectContaining({
          gradeLevel: expect.any(String),
          ageRange: expect.any(String)
        })
      })
    }));
  });
});
