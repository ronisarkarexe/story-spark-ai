jest.mock("../config", () => ({
  __esModule: true,
  default: {
    gemini_api_key: "fake-api-key",
  },
}));

import { DialogueFingerprintController } from "../app/modules/dialogue-fingerprint/dialogueFingerprint.controller";
import { DialogueFingerprintService } from "../app/modules/dialogue-fingerprint/dialogueFingerprint.service";
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
  textResponse: "{}",
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

describe("DialogueFingerprint Controller & Service", () => {
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

  it("should successfully estimate dialogue segments locally using heuristics", () => {
    const text = 'Emma said, "I won\'t give up." Then Liam replied, "We have to try again."';
    const result = DialogueFingerprintService.estimateDialogueSegments(text);
    expect(result).toBe(2);
  });

  it("should fail to generate fingerprint if story does not exist", async () => {
    (Post.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      DialogueFingerprintService.analyzeDialogueVoices("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should fail to generate fingerprint if user is not authorized to access the story", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "Title",
      content: 'Emma said, "I won\'t give up." Then Liam replied, "We have to try again."',
      author: "user_other",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    await expect(
      DialogueFingerprintService.analyzeDialogueVoices("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should fail to generate fingerprint if story content is empty", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "Title",
      content: "",
      author: "user_abc",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    await expect(
      DialogueFingerprintService.analyzeDialogueVoices("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should fail to generate fingerprint if story has no dialogue", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "Title",
      content: "This story is just raw narration. There are no dialogue quotes anywhere.",
      author: "user_abc",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    await expect(
      DialogueFingerprintService.analyzeDialogueVoices("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should fail to generate fingerprint if story has insufficient dialogue segments", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "Title",
      content: 'Emma said, "I won\'t give up."',
      author: "user_abc",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    await expect(
      DialogueFingerprintService.analyzeDialogueVoices("60c72b2f9b1d8e234c8d4512", "user_abc")
    ).rejects.toThrow(ApiError);
  });

  it("should successfully generate dialogue analysis metrics and suggestions via service & controller", async () => {
    const mockStory = {
      _id: "60c72b2f9b1d8e234c8d4512",
      title: "The Meeting",
      content: 'Emma said, "I won\'t give up." Then Liam replied, "We have to try again."',
      author: "user_abc",
    };
    (Post.findById as jest.Mock).mockResolvedValueOnce(mockStory);

    const mockAiResponseText = JSON.stringify({
      extractedCharacters: [
        {
          character: "Emma",
          dialogues: ["I won't give up."],
          tone: "Encouraging",
          catchphrases: ["won't give up"],
        },
        {
          character: "Liam",
          dialogues: ["We have to try again."],
          tone: "Determined",
          catchphrases: ["have to"],
        },
      ],
      recommendations: [
        {
          character: "Liam",
          suggestion: "Give Liam more contractions to sound casual.",
        },
      ],
    });

    mockState.textResponse = mockAiResponseText;

    const mockNext = jest.fn();
    await DialogueFingerprintController.analyzeDialogueVoices(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(sendResponse).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        success: true,
        data: expect.objectContaining({
          characters: expect.any(Array),
          similarities: expect.any(Array),
          recommendations: expect.any(Array),
        }),
      })
    );
  });
});
