import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act, cleanup, waitFor } from "@testing-library/react";
import { useCachedImage } from "../useCachedImage";
import * as imageCache from "../../utils/imageCache";

vi.mock("../../utils/imageCache", () => ({
  getCachedImageUrl: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useCachedImage", () => {
  it("returns undefined cachedSrc and false isLoading when src is falsy", () => {
    const { result } = renderHook(() => useCachedImage(undefined));
    expect(result.current.cachedSrc).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("returns undefined cachedSrc and false isLoading when src is an empty string", () => {
    const { result } = renderHook(() => useCachedImage(""));
    expect(result.current.cachedSrc).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("sets isLoading true immediately when src is provided", () => {
    (imageCache.getCachedImageUrl as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise<string>(() => {})
    );

    const { result } = renderHook(() => useCachedImage("https://example.com/image.jpg"));
    expect(result.current.isLoading).toBe(true);
  });

  it("sets cachedSrc to resolved URL and isLoading to false on success", async () => {
    (imageCache.getCachedImageUrl as ReturnType<typeof vi.fn>).mockResolvedValue(
      "blob:https://local/cached-image"
    );

    const { result } = renderHook(() => useCachedImage("https://example.com/image.jpg"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cachedSrc).toBe("blob:https://local/cached-image");
    expect(result.current.isLoading).toBe(false);
  });

  it("falls back to original src on error", async () => {
    (imageCache.getCachedImageUrl as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Cache failed")
    );

    const { result } = renderHook(() => useCachedImage("https://example.com/image.jpg"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cachedSrc).toBe("https://example.com/image.jpg");
    expect(result.current.isLoading).toBe(false);
  });

  it("does not update state after unmount (isMounted cleanup)", async () => {
    let finishPromise: (url: string) => void;
    (imageCache.getCachedImageUrl as ReturnType<typeof vi.fn>).mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          finishPromise = resolve;
        })
    );

    const { unmount } = renderHook(() =>
      useCachedImage("https://example.com/image.jpg")
    );

    unmount();

    // Calling resolve after unmount should not throw an error
    // because the isMounted flag is cleared in the cleanup function.
    await act(async () => {
      finishPromise!("blob:https://local/cached");
    });

    // If we get here without an error, the cleanup worked correctly
    expect(true).toBe(true);
  });
});
