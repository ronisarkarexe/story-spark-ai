import { SuggestionService } from "../app/modules/suggestion/suggestion.service";
import { Suggestion } from "../app/modules/suggestion/suggestion.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import httpStatus from "http-status";
import ApiError from "../errors/api_error";

// Mock the Mongoose Suggestion Model
jest.mock("../app/modules/suggestion/suggestion.model", () => ({
  Suggestion: {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

// Mock the Gemini API client
const mockGenerateContent = jest.fn();
jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => ({
        generateContent: (...args: any[]) => mockGenerateContent(...args),
      })),
    })),
    HarmCategory: {
      HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
      HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
    },
    HarmBlockThreshold: {
      BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE",
    },
  };
});

// Mock config
jest.mock("../config", () => ({
  gemini_api_key: "fake-test-key-12345",
}));

const MOCK_USER_ID = "507f1f77bcf86cd799439011";
const MOCK_RECORD_ID = "507f1f77bcf86cd799439012";
const MOCK_STORY_ID = "507f1f77bcf86cd799439013";
const MOCK_NONEXISTENT_ID = "507f1f77bcf86cd799439999";

describe("Suggestion System Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateSuggestion", () => {
    it("successfully generates suggestions and saves history", async () => {
      const mockResultPayload = {
        suggestions: [
          {
            title: "Path A: The unexpected choice",
            description: "The protagonist decides to...",
            outcome: "This leads to a confrontation with...",
          },
        ],
        unexpectedTwist: {
          title: "Unexpected Twist",
          description: "It is revealed that...",
        },
      };

      // Mock Gemini response
      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => JSON.stringify(mockResultPayload),
        },
      });

      // Mock Mongoose Suggestion.create
      const mockSavedRecord = {
        _id: MOCK_RECORD_ID,
        userId: MOCK_USER_ID,
        suggestionType: "plot",
        originalText: "Original text content",
        storyContext: "Story context content",
        generatedSuggestion: mockResultPayload,
        accepted: false,
        rejected: false,
      };
      (Suggestion.create as jest.Mock).mockResolvedValueOnce(mockSavedRecord);

      const result = await SuggestionService.generateSuggestion(MOCK_USER_ID, {
        suggestionType: "plot",
        originalText: "Original text content",
        storyContext: "Story context content",
      });

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(Suggestion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: expect.anything(),
          suggestionType: "plot",
          originalText: "Original text content",
          storyContext: "Story context content",
          generatedSuggestion: mockResultPayload,
        })
      );
      expect(result).toEqual(mockSavedRecord);
    });

    it("throws ApiError if Gemini API fails", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        SuggestionService.generateSuggestion(MOCK_USER_ID, {
          suggestionType: "plot",
          storyContext: "Story context content",
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe("acceptSuggestion", () => {
    it("successfully marks suggestion as accepted", async () => {
      const mockUpdated = { _id: MOCK_RECORD_ID, accepted: true, rejected: false };
      (Suggestion.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(mockUpdated);

      const result = await SuggestionService.acceptSuggestion(MOCK_USER_ID, MOCK_RECORD_ID);

      expect(Suggestion.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: expect.anything(),
          userId: expect.anything(),
        }),
        { $set: { accepted: true, rejected: false } },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });

    it("throws ApiError if suggestion is not found", async () => {
      (Suggestion.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        SuggestionService.acceptSuggestion(MOCK_USER_ID, MOCK_NONEXISTENT_ID)
      ).rejects.toThrow(ApiError);
    });
  });

  describe("rejectSuggestion", () => {
    it("successfully marks suggestion as rejected", async () => {
      const mockUpdated = { _id: MOCK_RECORD_ID, accepted: false, rejected: true };
      (Suggestion.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(mockUpdated);

      const result = await SuggestionService.rejectSuggestion(MOCK_USER_ID, MOCK_RECORD_ID);

      expect(Suggestion.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: expect.anything(),
          userId: expect.anything(),
        }),
        { $set: { rejected: true, accepted: false } },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("getSuggestionsHistory", () => {
    it("retrieves paginated history", async () => {
      const mockRecords = [{ _id: "rec1" }, { _id: "rec2" }];
      const mockFindChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockRecords),
      };
      (Suggestion.find as jest.Mock).mockReturnValue(mockFindChain);
      (Suggestion.countDocuments as jest.Mock).mockResolvedValueOnce(25);

      const result = await SuggestionService.getSuggestionsHistory(MOCK_USER_ID, 2, 5);

      expect(Suggestion.find).toHaveBeenCalledWith({ userId: expect.anything() });
      expect(mockFindChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockFindChain.skip).toHaveBeenCalledWith(5);
      expect(mockFindChain.limit).toHaveBeenCalledWith(5);
      expect(result).toEqual({
        meta: { page: 2, limit: 5, total: 25 },
        data: mockRecords,
      });
    });
  });

  describe("deleteSuggestionFromHistory", () => {
    it("deletes suggestions from history", async () => {
      (Suggestion.findOneAndDelete as jest.Mock).mockResolvedValueOnce({ _id: MOCK_RECORD_ID });

      const result = await SuggestionService.deleteSuggestionFromHistory(MOCK_USER_ID, MOCK_RECORD_ID);

      expect(Suggestion.findOneAndDelete).toHaveBeenCalled();
      expect(result.message).toContain("deleted successfully");
    });

    it("throws ApiError if record to delete is not found", async () => {
      (Suggestion.findOneAndDelete as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        SuggestionService.deleteSuggestionFromHistory(MOCK_USER_ID, MOCK_RECORD_ID)
      ).rejects.toThrow(ApiError);
    });
  });
});
