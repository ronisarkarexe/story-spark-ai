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
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up shared state between tests
    clearObjectUrls();
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

      await getCachedImageUrl('https://example.com/to-clear.png');
      expect(global.URL.createObjectURL).toHaveBeenCalled();

      clearObjectUrls();

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/blob-id');
    });
  });
});
