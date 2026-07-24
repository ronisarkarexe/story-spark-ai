import { ChapterIllustrationService } from "../chapter_illustration.service";
import { ImageCacheModel } from "../chapter_illustration.model";
import { IChapterIllustrationPayload } from "../chapter_illustration.interface";

// Mock dependencies
jest.mock("../chapter_illustration.model");
jest.mock("../../../config", () => ({
  default: {
    image_generation_provider: "openai",
    image_generation_api_key: "test-key",
    openai_key: "test-openai-key",
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ChapterIllustrationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ImageCacheModel.findOne as jest.Mock).mockResolvedValue(null);
    (ImageCacheModel.create as jest.Mock).mockResolvedValue({});
  });

  describe("generateChapterIllustration", () => {
    const mockPayload: IChapterIllustrationPayload = {
      chapterId: "ch-123",
      chapterTitle: "The Adventure Begins",
      chapterContent: "Once upon a time, in a land far away...",
      storyContext: "A fantasy adventure story",
      style: "illustration",
      quality: "standard",
    };

    it("should generate an illustration successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ url: "https://example.com/image.png" }],
        }),
      });

      const result = await ChapterIllustrationService.generateChapterIllustration(
        mockPayload
      );

      expect(result).toMatchObject({
        chapterId: "ch-123",
        imageStatus: "generated",
      });
      expect(result.imageUrl).toBeTruthy();
    });

    it("should return cached image if available", async () => {
      (ImageCacheModel.findOne as jest.Mock).mockResolvedValueOnce({
        imageUrl: "https://cached.com/image.png",
        usageCount: 5,
        save: jest.fn().mockResolvedValue({}),
      });

      const result = await ChapterIllustrationService.generateChapterIllustration(
        mockPayload
      );

      expect(result.imageStatus).toBe("cached");
      expect(result.imageUrl).toBe("https://cached.com/image.png");
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Invalid API key" } }),
      });

      const result = await ChapterIllustrationService.generateChapterIllustration(
        mockPayload
      );

      expect(result.imageStatus).toBe("failed");
      expect(result.imageUrl).toBe("");
    });

    it("should respect abort signal", async () => {
      const controller = new AbortController();
      controller.abort();

      const result = await ChapterIllustrationService.generateChapterIllustration(
        mockPayload,
        controller.signal
      );

      expect(result.imageStatus).toBe("failed");
    });
  });

  describe("generateBatchIllustrations", () => {
    const mockPayloads: IChapterIllustrationPayload[] = [
      {
        chapterId: "ch-1",
        chapterTitle: "Chapter 1",
        chapterContent: "Content 1",
        style: "illustration",
        quality: "standard",
      },
      {
        chapterId: "ch-2",
        chapterTitle: "Chapter 2",
        chapterContent: "Content 2",
        style: "illustration",
        quality: "standard",
      },
    ];

    it("should generate illustrations for multiple chapters", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [{ url: "https://example.com/image.png" }],
        }),
      });

      const results = await ChapterIllustrationService.generateBatchIllustrations(
        mockPayloads
      );

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.imageStatus === "generated")).toBe(true);
    });

    it("should respect abort signal during batch generation", async () => {
      const controller = new AbortController();

      mockFetch.mockImplementationOnce(() => {
        controller.abort();
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [{ url: "https://example.com/image.png" }] }),
        });
      });

      const results = await ChapterIllustrationService.generateBatchIllustrations(
        mockPayloads,
        controller.signal
      );

      expect(results.length).toBeLessThanOrEqual(mockPayloads.length);
    });
  });

  describe("clearExpiredCache", () => {
    it("should delete expired cache entries", async () => {
      (ImageCacheModel.deleteMany as jest.Mock).mockResolvedValueOnce({
        deletedCount: 5,
      });

      const count = await ChapterIllustrationService.clearExpiredCache();

      expect(count).toBe(5);
      expect(ImageCacheModel.deleteMany).toHaveBeenCalledWith({
        expiresAt: { $lt: expect.any(Date) },
      });
    });

    it("should handle deletion errors gracefully", async () => {
      (ImageCacheModel.deleteMany as jest.Mock).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const count = await ChapterIllustrationService.clearExpiredCache();

      expect(count).toBe(0);
    });
  });
});
