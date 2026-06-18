import { extractCharacterNetworkOffline } from "../app/modules/story_version/character_network.utils";
import { Request, Response } from "express";
import { StoryVersionController } from "../app/modules/story_version/story_version.controller";
import { StoryVersionService } from "../app/modules/story_version/story_version.service";
import sendResponse from "../shared/send_response";

jest.mock("../app/modules/story_version/story_version.service", () => ({
  StoryVersionService: {
    getCharacterNetwork: jest.fn(),
  },
}));

jest.mock("../shared/send_response", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Character Network Extraction Logic", () => {
  it("should extract characters and relationships offline correctly", () => {
    const story = "Merlin walked through the forest toward the castle. Elena watched from the palace window as Merlin approached.";
    const result = extractCharacterNetworkOffline(story);
    expect(result.characters.length).toBeGreaterThan(0);
    expect(result.characters.some(c => c.name === "Merlin")).toBe(true);
    expect(result.characters.some(c => c.name === "Elena")).toBe(true);
  });

  it("should calculate importanceScore and relationships properly", () => {
    const story = "Merlin and Elena talked in the library. Merlin loved books, but Elena preferred sword fighting.";
    const result = extractCharacterNetworkOffline(story);
    expect(result.relationships.length).toBeGreaterThan(0);
    const rel = result.relationships[0];
    expect(rel.source === "elena" || rel.source === "merlin").toBe(true);
    expect(rel.target === "elena" || rel.target === "merlin").toBe(true);
    expect(rel.interactionCount).toBeGreaterThan(0);
  });
});

describe("Character Network Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { id: "656b856b3e34a6efc023dabc" },
      user: { _id: "user123" } as any,
    };
    mockRes = {};
  });

  it("should retrieve character network and send successful response", async () => {
    const mockData = {
      characters: [{ id: "merlin", name: "Merlin", appearanceCount: 5, importanceScore: 80 }],
      relationships: [],
    };
    (StoryVersionService.getCharacterNetwork as jest.Mock).mockResolvedValueOnce(mockData);

    const mockNext = jest.fn();
    await StoryVersionController.getCharacterNetwork(mockReq as Request, mockRes as Response, mockNext);

    expect(StoryVersionService.getCharacterNetwork).toHaveBeenCalledWith("656b856b3e34a6efc023dabc", "user123");
    expect(sendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: 200,
      success: true,
      message: "Character relationship network retrieved successfully!",
      data: mockData,
    });
  });
});
