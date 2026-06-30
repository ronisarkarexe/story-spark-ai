import { describe, it, expect, afterEach } from "vitest";

const TEST_URL = "https://example.com/image.png";

describe("imageCache utility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getCachedImageUrl returns empty string for empty URL", async () => {
    const { getCachedImageUrl } = await import("../imageCache");
    const result = await getCachedImageUrl("");
    expect(result).toBe("");
  });

  it("falls back to original URL when fetch fails", async () => {
    const { getCachedImageUrl } = await import("../imageCache");

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
    const { getCachedImageUrl } = await import("../imageCache");

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
    const { getCachedImageUrl } = await import("../imageCache");

    const mockCache = {
      match: vi.fn().mockResolvedValue({
        blob: vi.fn().mockResolvedValue(new Blob(["test"], { type: "image/png" })),
      }),
      put: vi.fn().mockResolvedValue(undefined),
    };
    const openSpy = vi.fn().mockResolvedValue(mockCache);
    vi.stubGlobal("caches", { open: openSpy });

    // Two concurrent calls to the same URL
    const results = await Promise.all([
      getCachedImageUrl(TEST_URL),
      getCachedImageUrl(TEST_URL),
    ]);

    // Both calls return the same blob URL
    expect(results[0]).toBeTruthy();
    expect(results[0]).toBe(results[1]);
    // caches.open is called exactly once due to in-flight deduplication
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it("clearObjectUrls clears the blob URL map without errors", async () => {
    const { clearObjectUrls } = await import("../imageCache");
    expect(() => clearObjectUrls()).not.toThrow();
  });
});
