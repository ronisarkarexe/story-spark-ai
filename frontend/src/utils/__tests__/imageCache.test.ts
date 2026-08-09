// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCachedImageUrl, clearObjectUrls } from "../imageCache";

const TEST_URL = "https://example.com/image.png";

describe("imageCache utility", () => {
  beforeEach(() => {
    clearObjectUrls();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clearObjectUrls();
    vi.restoreAllMocks();
  });

  it("returns empty string for empty URL", async () => {
    const result = await getCachedImageUrl("");
    expect(result).toBe("");
  });

  it("falls back to original URL when caches API is not in window", async () => {
    const originalCaches = window.caches;
    delete (window as any).caches;

    const result = await getCachedImageUrl(TEST_URL);
    expect(result).toBe(TEST_URL);

    (window as any).caches = originalCaches;
  });

  it("falls back to original URL when fetch fails", async () => {
    vi.stubGlobal("caches", {
      open: vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(null),
        put: vi.fn(),
      }),
    });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const result = await getCachedImageUrl(TEST_URL);
    expect(result).toBe(TEST_URL);
  });

  it("falls back to original URL when response is not ok", async () => {
    vi.stubGlobal("caches", {
      open: vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(null),
        put: vi.fn(),
      }),
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    }));

    const result = await getCachedImageUrl(TEST_URL);
    expect(result).toBe(TEST_URL);
  });

  it("deduplicates concurrent requests for the same URL", async () => {
    const mockCache = {
      match: vi.fn().mockResolvedValue({
        blob: vi.fn().mockResolvedValue(new Blob(["test"], { type: "image/png" })),
      }),
      put: vi.fn().mockResolvedValue(undefined),
    };
    const openSpy = vi.fn().mockResolvedValue(mockCache);
    vi.stubGlobal("caches", { open: openSpy });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:http://localhost/test-blob"),
      revokeObjectURL: vi.fn(),
    });

    const results = await Promise.all([
      getCachedImageUrl(TEST_URL),
      getCachedImageUrl(TEST_URL),
    ]);

    expect(results[0]).toBe("blob:http://localhost/test-blob");
    expect(results[1]).toBe("blob:http://localhost/test-blob");
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it("clearObjectUrls clears the blob URL map without errors", () => {
    expect(() => clearObjectUrls()).not.toThrow();
  });
});
