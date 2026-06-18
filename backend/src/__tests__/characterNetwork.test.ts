import { describe, expect, it, jest, beforeEach } from "@jest/globals";
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

// ── Offline extraction ────────────────────────────────────────────────────────

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

  // ── NEW: edge cases ─────────────────────────────────────────────────────────

  it("should return empty characters and relationships for empty story", () => {
    const result = extractCharacterNetworkOffline("");
    expect(result.characters).toHaveLength(0);
    expect(result.relationships).toHaveLength(0);
  });

  it("should return empty relationships for single character story", () => {
    const story = "Merlin walked alone through the dark forest.";
    const result = extractCharacterNetworkOffline(story);
    const merlin = result.characters.find(c => c.name === "Merlin");
    expect(merlin).toBeDefined();
    expect(result.relationships).toHaveLength(0);
  });

  it("should set higher importanceScore for character with more appearances", () => {
    const story = "Merlin cast a spell. Merlin opened the gate. Merlin spoke to Elena.";
    const result = extractCharacterNetworkOffline(story);
    const merlin = result.characters.find(c => c.name === "Merlin");
    const elena  = result.characters.find(c => c.name === "Elena");
    expect(merlin!.importanceScore).toBeGreaterThan(elena!.importanceScore);
  });

  it("should not produce duplicate characters", () => {
    const story = "Merlin spoke. Merlin laughed. Merlin left.";
    const result = extractCharacterNetworkOffline(story);
    const names = result.characters.map(c => c.name.toLowerCase());
    const unique = new Set(names);
    expect(names.length).toBe(unique.size);
  });

  it("should not produce duplicate relationships between same pair", () => {
    const story = "Merlin met Elena. Elena met Merlin. Merlin and Elena talked again.";
    const result = extractCharacterNetworkOffline(story);
    const pairs = result.relationships.map(r =>
      [r.source, r.target].sort().join("-")
    );
    const unique = new Set(pairs);
    expect(pairs.length).toBe(unique.size);
  });
});

// ── Controller ────────────────────────────────────────────────────────────────

describe("Character Network Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { id: "656b856b3e34a6efc023dabc" },
      user: { _id: "user123" } as any,
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  it("should retrieve character network and send successful response", async () => {
    const mockData = {
      characters: [{ id: "merlin", name: "Merlin", appearanceCount: 5, importanceScore: 80 }],
      relationships: [],
    };
    (StoryVersionService.getCharacterNetwork as jest.Mock).mockResolvedValueOnce(mockData);

    await StoryVersionController.getCharacterNetwork(mockReq as Request, mockRes as Response, mockNext);

    expect(StoryVersionService.getCharacterNetwork).toHaveBeenCalledWith("656b856b3e34a6efc023dabc", "user123");
    expect(sendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: 200,
      success: true,
      message: "Character relationship network retrieved successfully!",
      data: mockData,
    });
  });

  // ── NEW: error handling ─────────────────────────────────────────────────────

  it("should call next with error when service throws", async () => {
    const err = new Error("DB connection failed");
    (StoryVersionService.getCharacterNetwork as jest.Mock).mockRejectedValueOnce(err);

    await StoryVersionController.getCharacterNetwork(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
    expect(sendResponse).not.toHaveBeenCalled();
  });

  it("should call next with error when story version not found", async () => {
    const err = new Error("Story version not found");
    (StoryVersionService.getCharacterNetwork as jest.Mock).mockRejectedValueOnce(err);

    await StoryVersionController.getCharacterNetwork(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });

  it("should call service with correct storyId and userId", async () => {
    (StoryVersionService.getCharacterNetwork as jest.Mock).mockResolvedValueOnce({
      characters: [],
      relationships: [],
    });

    mockReq.params = { id: "abc123" };
    mockReq.user   = { _id: "userXYZ" } as any;

    await StoryVersionController.getCharacterNetwork(mockReq as Request, mockRes as Response, mockNext);

    expect(StoryVersionService.getCharacterNetwork).toHaveBeenCalledWith("abc123", "userXYZ");
  });

  it("should return empty network when story has no characters", async () => {
    const emptyData = { characters: [], relationships: [] };
    (StoryVersionService.getCharacterNetwork as jest.Mock).mockResolvedValueOnce(emptyData);

    await StoryVersionController.getCharacterNetwork(mockReq as Request, mockRes as Response, mockNext);

    expect(sendResponse).toHaveBeenCalledWith(mockRes, expect.objectContaining({
      statusCode: 200,
      data: emptyData,
    }));
  });
});