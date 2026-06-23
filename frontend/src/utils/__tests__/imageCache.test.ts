/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const CACHE_NAME = "story-spark-ai-image-cache";
const mockBlobUrl1 = "blob:http://localhost/test-url-1";
const mockBlobUrl2 = "blob:http://localhost/test-url-2";

const makeMockResponse = (blob: Blob) => ({
  blob: vi.fn().mockResolvedValue(blob),
});

describe("imageCache", () => {
  beforeEach(() => {
    // Reset module cache to get fresh objectUrlMap for each test
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getCachedImageUrl", () => {
    it("returns empty string for empty url", async () => {
      const { getCachedImageUrl } = await import("../imageCache");
      expect(await getCachedImageUrl("")).toBe("");
    });

    it("returns empty string for undefined url", async () => {
      const { getCachedImageUrl } = await import("../imageCache");
      expect(await getCachedImageUrl(undefined as any)).toBe("");
    });

    it("falls back to original url when caches is not supported", async () => {
      const originalCaches = (window as any).caches;
      (window as any).caches = undefined;
      const { getCachedImageUrl } = await import("../imageCache");
      try {
        expect(await getCachedImageUrl("https://example.com/img.png")).toBe("https://example.com/img.png");
      } finally {
        (window as any).caches = originalCaches;
      }
    });

    it("returns blob url on cache hit", async () => {
      const blob = new Blob(["test"], { type: "image/png" });
      const mockResp = makeMockResponse(blob);
      const openSpy = vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(mockResp as any),
        put: vi.fn(),
      });

      // Set up mocks BEFORE importing
      vi.spyOn(window, "caches", "get").mockReturnValue({ open: openSpy } as any);
      vi.spyOn(URL, "createObjectURL").mockReturnValue(mockBlobUrl1);
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(vi.fn());

      const { getCachedImageUrl } = await import("../imageCache");
      const result = await getCachedImageUrl("https://example.com/cached.png");

      expect(openSpy).toHaveBeenCalledWith(CACHE_NAME);
      expect(mockResp.blob).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(result).toBe(mockBlobUrl1);
    });

    it("falls back to original url when fetch fails", async () => {
      const openSpy = vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(undefined),
        put: vi.fn(),
      });
      vi.spyOn(window, "caches", "get").mockReturnValue({ open: openSpy } as any);
      vi.spyOn(URL, "createObjectURL").mockImplementation(vi.fn());
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(vi.fn());
      vi.spyOn(window, "fetch" as any).mockRejectedValue(new Error("Network error"));

      const { getCachedImageUrl } = await import("../imageCache");
      const result = await getCachedImageUrl("https://example.com/fail.png");
      expect(result).toBe("https://example.com/fail.png");
    });

    it("falls back to original url when response is not ok", async () => {
      const openSpy = vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(undefined),
        put: vi.fn(),
      });
      vi.spyOn(window, "caches", "get").mockReturnValue({ open: openSpy } as any);
      vi.spyOn(URL, "createObjectURL").mockImplementation(vi.fn());
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(vi.fn());
      vi.spyOn(window, "fetch" as any).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });

      const { getCachedImageUrl } = await import("../imageCache");
      const result = await getCachedImageUrl("https://example.com/404.png");
      expect(result).toBe("https://example.com/404.png");
    });

    it("memoizes blob url for same url on repeated calls", async () => {
      const blob = new Blob(["test"], { type: "image/png" });
      const mockResp = makeMockResponse(blob);
      const openSpy = vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(mockResp as any),
        put: vi.fn(),
      });
      vi.spyOn(window, "caches", "get").mockReturnValue({ open: openSpy } as any);
      vi.spyOn(URL, "createObjectURL").mockReturnValue(mockBlobUrl1);
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(vi.fn());

      const { getCachedImageUrl } = await import("../imageCache");
      await getCachedImageUrl("https://example.com/memo.png");
      await getCachedImageUrl("https://example.com/memo.png");

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
  });

  describe("clearObjectUrls", () => {
    it("revokes blob urls for two different urls", async () => {
      const blob = new Blob(["test"], { type: "image/png" });
      const mockResp = makeMockResponse(blob);
      const openSpy = vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(mockResp as any),
        put: vi.fn(),
      });
      const createObjectURLSpy = vi.fn()
        .mockReturnValueOnce(mockBlobUrl1)
        .mockReturnValueOnce(mockBlobUrl2);
      const revokeObjectURLSpy = vi.fn();

      vi.spyOn(window, "caches", "get").mockReturnValue({ open: openSpy } as any);
      vi.spyOn(URL, "createObjectURL").mockImplementation(createObjectURLSpy);
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(revokeObjectURLSpy);

      const { getCachedImageUrl, clearObjectUrls } = await import("../imageCache");
      await getCachedImageUrl("https://example.com/img1.png");
      await getCachedImageUrl("https://example.com/img2.png");

      expect(createObjectURLSpy).toHaveBeenCalledTimes(2);
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      clearObjectUrls();

      expect(revokeObjectURLSpy).toHaveBeenCalledTimes(2);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockBlobUrl1);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(mockBlobUrl2);
    });

    it("does not throw when called on empty map", async () => {
      const { clearObjectUrls } = await import("../imageCache");
      expect(() => clearObjectUrls()).not.toThrow();
    });
  });
});
