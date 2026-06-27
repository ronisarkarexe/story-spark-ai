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
  });
});