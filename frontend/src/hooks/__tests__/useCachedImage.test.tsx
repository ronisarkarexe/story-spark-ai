import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCachedImage } from "../useCachedImage";

vi.mock("../../utils/imageCache", () => ({
  getCachedImageUrl: vi.fn(),
}));

import { getCachedImageUrl } from "../../utils/imageCache";

describe("useCachedImage hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined cachedSrc and false isLoading when src is undefined", async () => {
    const { result } = renderHook(() => useCachedImage(undefined));

    expect(result.current.cachedSrc).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("returns undefined cachedSrc and false isLoading when src is empty string", async () => {
    const { result } = renderHook(() => useCachedImage(""));

    expect(result.current.cachedSrc).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("sets isLoading true when src is provided", async () => {
    vi.mocked(getCachedImageUrl).mockReturnValue(
      new Promise((resolve) => setTimeout(() => resolve("blob:http://cached"), 100))
    );

    const { result } = renderHook(() => useCachedImage("https://example.com/image.png"));

    expect(result.current.isLoading).toBe(true);
  });

  it("sets cachedSrc when getCachedImageUrl resolves", async () => {
    vi.mocked(getCachedImageUrl).mockResolvedValue("blob:http://cached-url");

    const { result } = renderHook(() => useCachedImage("https://example.com/image.png"));

    // Allow the effect to run and promise to resolve
    await act(async () => {
      await Promise.resolve();
      vi.runAllTimers();
    });

    expect(result.current.cachedSrc).toBe("blob:http://cached-url");
    expect(result.current.isLoading).toBe(false);
  });

  it("falls back to original src when getCachedImageUrl rejects", async () => {
    vi.mocked(getCachedImageUrl).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCachedImage("https://example.com/image.png"));

    await act(async () => {
      await Promise.resolve();
      vi.runAllTimers();
    });

    expect(result.current.cachedSrc).toBe("https://example.com/image.png");
    expect(result.current.isLoading).toBe(false);
  });

  it("does not update state after unmount during fetch", async () => {
    const deferred = {
      resolve: (value: string) => {},
      reject: (error: Error) => {},
      promise: null as Promise<string>,
    };
    deferred.promise = new Promise<string>((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    vi.mocked(getCachedImageUrl).mockReturnValue(deferred.promise);

    const { result, unmount } = renderHook(() =>
      useCachedImage("https://example.com/image.png")
    );

    expect(result.current.isLoading).toBe(true);

    // Unmount before the promise resolves
    unmount();

    // Resolve after unmount - should not cause state update
    deferred.resolve("blob:http://late-resolve");

    await act(async () => {
      await Promise.resolve();
      vi.runAllTimers();
    });

    // Unmounted, no error thrown
  });

  it("re-runs effect when src changes", async () => {
    vi.mocked(getCachedImageUrl)
      .mockResolvedValueOnce("blob:http://first")
      .mockResolvedValueOnce("blob:http://second");

    const { result, rerender } = renderHook(
      ({ src }: { src: string | undefined }) => useCachedImage(src),
      { initialProps: { src: "https://example.com/first.png" } }
    );

    await act(async () => {
      await Promise.resolve();
      vi.runAllTimers();
    });

    expect(result.current.cachedSrc).toBe("blob:http://first");

    rerender({ src: "https://example.com/second.png" });

    await act(async () => {
      await Promise.resolve();
      vi.runAllTimers();
    });

    expect(result.current.cachedSrc).toBe("blob:http://second");
  });
});
