
// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCachedImageUrl } from "../imageCache";

describe("imageCache", () => {
  beforeEach(() => {
    delete (window as any).caches;
  });

  describe("getCachedImageUrl", () => {
    it("returns an empty string when url is empty", async () => {
      const result = await getCachedImageUrl("");

      expect(result).toBe("");
    });

    it("returns the original url when Cache Storage API is unavailable", async () => {
      const url = "https://example.com/image.png";

      const result = await getCachedImageUrl(url);

      expect(result).toBe(url);
    });

    it("returns a blob URL when the image exists in Cache Storage", async () => {
  const url = "https://example.com/image.png";
  const blob = new Blob(["image"]);

  const createObjectURLMock = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValue("blob:cached-image");

  const cache = {
    match: vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(blob),
    }),
  };

  (window as any).caches = {
    open: vi.fn().mockResolvedValue(cache),
  };

  const result = await getCachedImageUrl(url);

  expect(result).toBe("blob:cached-image");
  expect(window.caches.open).toHaveBeenCalled();
  expect(cache.match).toHaveBeenCalledWith(url);
  expect(createObjectURLMock).toHaveBeenCalledWith(blob);

  createObjectURLMock.mockRestore();
});

it("returns the cached blob URL from memory on subsequent calls", async () => {
  const url = "https://example.com/image2.png";
  const blob = new Blob(["image"]);

  const createObjectURLMock = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValue("blob:memory-image");

  const cache = {
    match: vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(blob),
    }),
  };

  (window as any).caches = {
    open: vi.fn().mockResolvedValue(cache),
  };

  const first = await getCachedImageUrl(url);
  const second = await getCachedImageUrl(url);

  expect(first).toBe("blob:memory-image");
  expect(second).toBe("blob:memory-image");

  // Cache Storage should only be accessed once.
  expect(cache.match).toHaveBeenCalledTimes(1);

  // Object URL should only be created once.
  expect(createObjectURLMock).toHaveBeenCalledTimes(1);

  createObjectURLMock.mockRestore();
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCachedImageUrl, clearObjectUrls } from '../imageCache';

describe('imageCache utility', () => {
  const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });
  const mockResponse = {
    ok: true,
    blob: vi.fn().mockResolvedValue(mockBlob),
    clone: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const mockCache = {
    match: vi.fn(),
    put: vi.fn(),
  } as unknown as Cache;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global caches mock
    Object.defineProperty(window, 'caches', {
      value: {
        open: vi.fn().mockResolvedValue(mockCache),
      },
      writable: true,
      configurable: true,
    });
    // Mock URL.createObjectURL to return a predictable blob URL
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/blob-id');
    global.URL.revokeObjectURL = vi.fn();
    global.fetch = vi.fn();

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


  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up shared state between tests
    clearObjectUrls();

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

  describe('getCachedImageUrl', () => {
    it('returns empty string for empty URL', async () => {
      const result = await getCachedImageUrl('');
      expect(result).toBe('');
    });

    it('returns the URL unchanged when caches API is unavailable (SSR)', async () => {
      Object.defineProperty(window, 'caches', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      const result = await getCachedImageUrl('https://example.com/image.png');
      expect(result).toBe('https://example.com/image.png');
    });


    it('returns cached blob URL on cache hit without calling fetch', async () => {
      const cachedBlob = new Blob(['cached-data'], { type: 'image/png' });
      const cachedResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(cachedBlob),
      } as unknown as Response;
      mockCache.match = vi.fn().mockResolvedValue(cachedResponse);

  it("uses in-memory blob URL cache for repeated calls", async () => {
    const blob = createMockBlob("fake image data");
    mockCache.match.mockResolvedValue(null);
    mockFetch.mockResolvedValueOnce(
      new Response("fake image data", { status: 200, headers: { "content-type": "image/png" } })
    );
    mockCache.put.mockResolvedValue(undefined);


      const result = await getCachedImageUrl('https://example.com/cached.png');

      expect(result).toBe('blob:http://localhost/blob-id');
      expect(mockCache.match).toHaveBeenCalledWith('https://example.com/cached.png');
      expect(mockCache.put).not.toHaveBeenCalled();
    });


    it('fetches, caches, and returns blob URL on cache miss', async () => {
      mockCache.match = vi.fn().mockResolvedValue(undefined);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await getCachedImageUrl('https://example.com/new.png');

      expect(result).toBe('blob:http://localhost/blob-id');
      expect(mockCache.match).toHaveBeenCalledWith('https://example.com/new.png');
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/new.png');
      expect(mockCache.put).toHaveBeenCalled();

  it("falls back to original URL when Cache API is not available", async () => {
    Object.defineProperty(globalThis, "caches", {
      value: undefined,
      writable: true,
      configurable: true,

    });

    it('returns original URL when fetch fails', async () => {
      mockCache.match = vi.fn().mockResolvedValue(undefined);
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      const result = await getCachedImageUrl('https://example.com/bad.png');

      expect(result).toBe('https://example.com/bad.png');
    });

    it('returns original URL when response is not ok', async () => {
      mockCache.match = vi.fn().mockResolvedValue(undefined);
      const badResponse = { ok: false } as unknown as Response;
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(badResponse);


      const result = await getCachedImageUrl('https://example.com/404.png');

      expect(result).toBe('https://example.com/404.png');

  it("returns cached blob URL when cache hit occurs", async () => {
    const cachedResponse = new Response("cached image", {
      status: 200,
      headers: { "content-type": "image/png" },

    });

    it('deduplicates concurrent requests for the same URL', async () => {
      mockCache.match = vi.fn().mockResolvedValue(undefined);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const [result1, result2] = await Promise.all([
        getCachedImageUrl('https://example.com/dedup.png'),
        getCachedImageUrl('https://example.com/dedup.png'),
      ]);

      expect(result1).toBe('blob:http://localhost/blob-id');
      expect(result2).toBe('blob:http://localhost/blob-id');
      // Fetch should only be called once for the deduplicated request
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });


  describe('clearObjectUrls', () => {
    it('revokes blob URLs and clears the map', async () => {
      mockCache.match = vi.fn().mockResolvedValue(undefined);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

  it("stores fetched image in cache and returns blob URL", async () => {
    const blob = createMockBlob("new image");
    mockCache.match.mockResolvedValue(null);
    mockFetch.mockResolvedValueOnce(
      new Response("new image", { status: 200, headers: { "content-type": "image/png" } })
    );
    mockCache.put.mockResolvedValue(undefined);


      await getCachedImageUrl('https://example.com/to-clear.png');
      expect(global.URL.createObjectURL).toHaveBeenCalled();

      clearObjectUrls();


      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/blob-id');
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

