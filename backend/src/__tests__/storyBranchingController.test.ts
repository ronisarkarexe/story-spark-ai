import { Request, Response } from "express";

// Mock the dependencies BEFORE importing the controller
jest.mock("../services/ai.service", () => ({
  generateStory: jest.fn(),
}));

jest.mock("../shared/send_response", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { StoryBranchingController } from "../controllers/storyBranchingController";
import { generateStory } from "../services/ai.service";
import sendResponse from "../shared/send_response";

const mockGenerateStory = generateStory as jest.MockedFunction<typeof generateStory>;
const mockSendResponse = sendResponse as jest.MockedFunction<typeof sendResponse>;

describe("StoryBranchingController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {
        storyContext: "Once upon a time in a fantasy world.",
        selectedChoice: "Enter the dark portal",
        genre: "Fantasy",
      },
    };
    mockRes = {};
  });

  it("should successfully parse valid JSON response from AI and return standard sendResponse structure", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        storySegment: "You step through the glowing blue portal and find yourself in a silent forest.",
        choices: [
          "Walk along the ancient cobblestone path",
          "Climb a nearby massive oak tree to look around",
          "Wait quietly to see if the portal closes"
        ]
      }),
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      success: true,
      statusCode: 200,
      message: "Story generated successfully",
      data: {
        storySegment: "You step through the glowing blue portal and find yourself in a silent forest.",
        choices: [
          "Walk along the ancient cobblestone path",
          "Climb a nearby massive oak tree to look around",
          "Wait quietly to see if the portal closes"
        ],
        segmentIndex: 1, // 0 choices in history so far
      },
    });
  });

  it("should calculate correct segmentIndex when history contains multiple selection steps", async () => {
    mockReq.body.storyContext = 
      "Once upon a time.\n[Player chose: Option 1]\n\n" +
      "Scene two.\n[Player chose: Option 2]\n\n" +
      "Scene three.";
    
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        storySegment: "Scene four outcome.",
        choices: ["Option A", "Option B", "Option C"]
      }),
      provider: "gemini",
      fallbackUsed: true,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      data: expect.objectContaining({
        segmentIndex: 3, // 2 player choices in history, so index 3
      }),
    }));
  });

  it("should fall back gracefully to raw text parser if AI response is not JSON", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: "This is a plain text story continuation with no JSON at all.",
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      success: true,
      statusCode: 200,
      message: "Story generated successfully",
      data: {
        storySegment: "This is a plain text story continuation with no JSON at all.",
        choices: [
          "Explore the surroundings",
          "Search for another way",
          "Wait and see what happens"
        ],
        segmentIndex: 1,
      },
    });
  });
});
