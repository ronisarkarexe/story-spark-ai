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

  it("should strip markdown code fences before parsing", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: '```json\n{\n  "storySegment": "Markdown-wrapped segment.",\n  "choices": ["A", "B", "C"]\n}\n```',
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      data: expect.objectContaining({
        storySegment: "Markdown-wrapped segment.",
        choices: ["A", "B", "C"],
      }),
    }));
  });

  it("should recover from truncated JSON by falling back to raw text", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: '{ "title": "The Quest", "branches": [ { "id": 1, ',
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: true,
      statusCode: 200,
      data: expect.objectContaining({
        storySegment: expect.stringContaining('{ "title": "The Quest", "branches": [ { "id": 1,'),
      }),
    }));
  });

  it("should fall back when AI returns invalid keys", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        hallucinatedKey: "unexpected",
        choices: ["A", "B", "C"],
      }),
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: true,
      statusCode: 200,
      data: expect.objectContaining({
        choices: ["Explore the surroundings", "Search for another way", "Wait and see what happens"],
      }),
    }));
  });

  it("should normalize choices to exactly 3 when fewer are provided", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        storySegment: "Segment with one choice.",
        choices: ["Only choice"],
      }),
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      data: expect.objectContaining({
        choices: ["Only choice", "Option 2", "Option 3"],
      }),
    }));
  });

  it("should truncate choices to exactly 3 when more are provided", async () => {
    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        storySegment: "Segment with too many choices.",
        choices: ["A", "B", "C", "D", "E"],
      }),
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      data: expect.objectContaining({
        choices: ["A", "B", "C"],
      }),
    }));
  });
});

// ---------------------------------------------------------------------------
// validateBranchingRequest — unit tests for the pure validation helper
// ---------------------------------------------------------------------------

import {
  validateBranchingRequest,
  ALLOWED_GENRES,
  MAX_STORY_CONTEXT_LENGTH,
  MAX_CHOICE_LENGTH,
} from "../controllers/storyBranchingController";

describe("validateBranchingRequest", () => {
  const validBody = {
    storyContext: "Once upon a time in a dark forest.",
    selectedChoice: "Follow the glowing light",
    genre: "fantasy",
  };

  // --- genre type guard ---

  it("returns 400 when genre is a number (non-string type)", () => {
    const result = validateBranchingRequest({ ...validBody, genre: 42 });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.message).toMatch(/genre must be a string/i);
    }
  });

  it("returns 400 when genre is an object (non-string type)", () => {
    const result = validateBranchingRequest({ ...validBody, genre: { name: "fantasy" } });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.message).toMatch(/genre must be a string/i);
    }
  });

  it("returns 400 for an unknown genre and lists valid options", () => {
    const result = validateBranchingRequest({ ...validBody, genre: "western" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      // Message must list all allowed genres
      for (const g of ALLOWED_GENRES) {
        expect(result.message).toContain(g);
      }
    }
  });

  it("accepts known genres case-insensitively (e.g. 'Fantasy' → 'fantasy')", () => {
    const result = validateBranchingRequest({ ...validBody, genre: "Fantasy" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.fields.genre).toBe("fantasy");
    }
  });

  it("accepts all genres in ALLOWED_GENRES", () => {
    for (const genre of ALLOWED_GENRES) {
      const result = validateBranchingRequest({ ...validBody, genre });
      expect(result.valid).toBe(true);
    }
  });

  it("treats absent genre as valid (genre is optional)", () => {
    const { genre: _omit, ...bodyWithoutGenre } = validBody;
    const result = validateBranchingRequest(bodyWithoutGenre);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.fields.genre).toBeUndefined();
    }
  });

  // --- storyContext length guard ---

  it("returns 400 when storyContext exceeds MAX_STORY_CONTEXT_LENGTH characters", () => {
    const longContext = "a".repeat(MAX_STORY_CONTEXT_LENGTH + 1);
    const result = validateBranchingRequest({ ...validBody, storyContext: longContext });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.message).toMatch(/storyContext must not exceed/i);
    }
  });

  it("accepts storyContext of exactly MAX_STORY_CONTEXT_LENGTH characters", () => {
    const exactContext = "a".repeat(MAX_STORY_CONTEXT_LENGTH);
    const result = validateBranchingRequest({ ...validBody, storyContext: exactContext });
    expect(result.valid).toBe(true);
  });

  it("returns 400 when storyContext is an empty string", () => {
    const result = validateBranchingRequest({ ...validBody, storyContext: "" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
    }
  });

  it("returns 400 when storyContext is not a string", () => {
    const result = validateBranchingRequest({ ...validBody, storyContext: 123 });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
    }
  });

  // --- selectedChoice guards ---

  it("returns 400 when selectedChoice is an empty string", () => {
    const result = validateBranchingRequest({ ...validBody, selectedChoice: "" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.message).toMatch(/selectedChoice cannot be empty/i);
    }
  });

  it("returns 400 when selectedChoice exceeds MAX_CHOICE_LENGTH characters", () => {
    const longChoice = "b".repeat(MAX_CHOICE_LENGTH + 1);
    const result = validateBranchingRequest({ ...validBody, selectedChoice: longChoice });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.message).toMatch(/selectedChoice must not exceed/i);
    }
  });

  it("accepts selectedChoice of exactly MAX_CHOICE_LENGTH characters", () => {
    const exactChoice = "b".repeat(MAX_CHOICE_LENGTH);
    const result = validateBranchingRequest({ ...validBody, selectedChoice: exactChoice });
    expect(result.valid).toBe(true);
  });

  it("returns 400 when selectedChoice is not a string", () => {
    const result = validateBranchingRequest({ ...validBody, selectedChoice: true });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
    }
  });

  // --- sanitization ---

  it("trims whitespace from storyContext and selectedChoice", () => {
    const result = validateBranchingRequest({
      storyContext: "  A tale of two cities.  ",
      selectedChoice: "  Run north.  ",
      genre: "mystery",
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.fields.storyContext).toBe("A tale of two cities.");
      expect(result.fields.selectedChoice).toBe("Run north.");
    }
  });

  // --- valid happy path ---

  it("returns valid result with sanitized fields for a well-formed request", () => {
    const result = validateBranchingRequest(validBody);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.fields.storyContext).toBe(validBody.storyContext);
      expect(result.fields.selectedChoice).toBe(validBody.selectedChoice);
      expect(result.fields.genre).toBe("fantasy");
    }
  });
});

// ---------------------------------------------------------------------------
// Integration: controller rejects invalid requests before calling AI
// ---------------------------------------------------------------------------

describe("StoryBranchingController — validation integration", () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {};
  });

  it("returns 400 and does NOT call generateStory when genre is a number", async () => {
    const mockReq = {
      body: {
        storyContext: "A story.",
        selectedChoice: "Go left",
        genre: 99,
      },
      headers: {},
    } as unknown as Request;

    await StoryBranchingController.createBranchingStory(mockReq, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: false,
      statusCode: 400,
    }));
    expect(mockGenerateStory).not.toHaveBeenCalled();
  });

  it("returns 400 and does NOT call generateStory for an unknown genre", async () => {
    const mockReq = {
      body: {
        storyContext: "A story.",
        selectedChoice: "Go right",
        genre: "western",
      },
      headers: {},
    } as unknown as Request;

    await StoryBranchingController.createBranchingStory(mockReq, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: false,
      statusCode: 400,
    }));
    expect(mockGenerateStory).not.toHaveBeenCalled();
  });

  it("returns 400 and does NOT call generateStory when storyContext exceeds 8000 chars", async () => {
    const mockReq = {
      body: {
        storyContext: "x".repeat(8001),
        selectedChoice: "Continue",
        genre: "fantasy",
      },
      headers: {},
    } as unknown as Request;

    await StoryBranchingController.createBranchingStory(mockReq, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: false,
      statusCode: 400,
    }));
    expect(mockGenerateStory).not.toHaveBeenCalled();
  });

  it("returns 400 and does NOT call generateStory when selectedChoice is an empty string", async () => {
    const mockReq = {
      body: {
        storyContext: "A story begins.",
        selectedChoice: "",
        genre: "horror",
      },
      headers: {},
    } as unknown as Request;

    await StoryBranchingController.createBranchingStory(mockReq, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: false,
      statusCode: 400,
    }));
    expect(mockGenerateStory).not.toHaveBeenCalled();
  });

  it("calls generateStory and returns 200 for a valid request", async () => {
    const mockReq = {
      body: {
        storyContext: "A hero stands at the crossroads.",
        selectedChoice: "Take the mountain path",
        genre: "fantasy",
      },
      headers: {},
    } as unknown as Request;

    mockGenerateStory.mockResolvedValueOnce({
      story: JSON.stringify({
        storySegment: "The hero climbs the misty mountain.",
        choices: ["Rest at a cave", "Press onward", "Turn back"],
      }),
      provider: "openai",
      fallbackUsed: false,
    });

    await StoryBranchingController.createBranchingStory(mockReq, mockRes as Response);

    expect(mockGenerateStory).toHaveBeenCalledTimes(1);
    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      success: true,
      statusCode: 200,
    }));
  });
});
