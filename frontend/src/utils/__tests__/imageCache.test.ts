/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { getCachedImageUrl, clearObjectUrls } from "../imageCache";

const originalCaches = globalThis.caches;
const mockCache = {
  match: vi.fn(),
  put: vi.fn(),
};
const mockCachesOpen = vi.fn(() => Promise.resolve(mockCache));

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
const BLOB_URL_MAP = new Map<string, Blob>();
let objectUrlCounter = 0;

const mockCreateObjectURL = vi.fn((blob: Blob) => {
  const url = `blob:mock:${++objectUrlCounter}`;
  BLOB_URL_MAP.set(url, blob);
  return url;
});
const mockRevokeObjectURL = vi.fn((url: string) => {
  BLOB_URL_MAP.delete(url);
});

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  objectUrlCounter = 0;
  BLOB_URL_MAP.clear();
  clearObjectUrls();
  Object.defineProperty(globalThis, "caches", {
    value: { open: mockCachesOpen },
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "fetch", {
    value: mockFetch,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "URL", {
    value: {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    },
    writable: true,
    configurable: true,
  });
});

afterAll(() => {
  Object.defineProperty(globalThis, "caches", {
    value: originalCaches,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "URL", {
    value: {
      createObjectURL: originalCreateObjectURL,
      revokeObjectURL: originalRevokeObjectURL,
    },
    writable: true,
    configurable: true,
  });
});

const createMockBlob = (text: string) =>
  new Blob([text], { type: "image/png" });

describe("getCachedImageUrl", () => {
  it("returns empty string when url is falsy", async () => {
    await expect(getCachedImageUrl("")).resolves.toBe("");
    await expect(
      getCachedImageUrl(undefined as unknown as string)
    ).resolves.toBe("");
  });

  it("uses in-memory blob URL cache for repeated calls", async () => {
    const blob = createMockBlob("fake image data");
    mockCache.match.mockResolvedValue(null);
    mockFetch.mockResolvedValueOnce(
      new Response("fake image data", { status: 200, headers: { "content-type": "image/png" } })
    );
    mockCache.put.mockResolvedValue(undefined);

    const result1 = await getCachedImageUrl("https://example.com/image.png");
    const result2 = await getCachedImageUrl("https://example.com/image.png");

    expect(result1).toBe(result2);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockCachesOpen).toHaveBeenCalledTimes(1);
  });

  it("falls back to original URL when Cache API is not available", async () => {
    Object.defineProperty(globalThis, "caches", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const result = await getCachedImageUrl("https://example.com/image.png");
    expect(result).toBe("https://example.com/image.png");
  });

  it("falls back to original URL when fetch fails", async () => {
    mockCache.match.mockResolvedValue(null);
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await getCachedImageUrl("https://example.com/image.png");
    expect(result).toBe("https://example.com/image.png");
  });

  it("returns cached blob URL when cache hit occurs", async () => {
    const cachedResponse = new Response("cached image", {
      status: 200,
      headers: { "content-type": "image/png" },
    });
    mockCache.match.mockResolvedValueOnce(cachedResponse);

    const result = await getCachedImageUrl("https://example.com/image.png");
    expect(result).toMatch(/^blob:mock:/);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("stores fetched image in cache and returns blob URL", async () => {
    const blob = createMockBlob("new image");
    mockCache.match.mockResolvedValue(null);
    mockFetch.mockResolvedValueOnce(
      new Response("new image", { status: 200, headers: { "content-type": "image/png" } })
    );
    mockCache.put.mockResolvedValue(undefined);

    const result = await getCachedImageUrl("https://example.com/image.png");

    expect(result).toMatch(/^blob:mock:/);
    expect(mockCache.put).toHaveBeenCalled();
  });
});

describe("clearObjectUrls", () => {
  it("clears the object URLs and revokes them", async () => {
    mockCache.match.mockResolvedValue(null);
    mockFetch.mockResolvedValueOnce(
      new Response("image to clear", { status: 200, headers: { "content-type": "image/png" } })
    );
    mockCache.put.mockResolvedValue(undefined);

    await getCachedImageUrl("https://example.com/image-to-clear.png");
    
    clearObjectUrls();

    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });
});
