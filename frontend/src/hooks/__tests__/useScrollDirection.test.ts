import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDirection } from "../useScrollDirection";

describe("useScrollDirection hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns initial state with scrollDirection=up and isAtTop=true", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.scrollDirection).toBe("up");
    expect(result.current.isAtTop).toBe(true);
  });

  it("detects scroll down when scrollY increases", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 0, writable: true, configurable: true });

      const scrollHandler = addEventListenerSpy.mock.calls.find(
        ([event]) => event === "scroll"
      )?.[1] as EventListener;

      Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 100, writable: true, configurable: true });

      scrollHandler(new Event("scroll"));
    });

    expect(result.current.scrollDirection).toBe("down");
  });

  it("detects scroll up when scrollY decreases", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 100, writable: true, configurable: true });

      const scrollHandler = addEventListenerSpy.mock.calls.find(
        ([event]) => event === "scroll"
      )?.[1] as EventListener;

      Object.defineProperty(window, "scrollY", { value: 50, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 50, writable: true, configurable: true });

      scrollHandler(new Event("scroll"));
    });

    expect(result.current.scrollDirection).toBe("up");
  });

  it("sets isAtTop=false when scrollY >= 10", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 0, writable: true, configurable: true });

      const scrollHandler = addEventListenerSpy.mock.calls.find(
        ([event]) => event === "scroll"
      )?.[1] as EventListener;

      Object.defineProperty(window, "scrollY", { value: 10, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 10, writable: true, configurable: true });
      scrollHandler(new Event("scroll"));
    });

    expect(result.current.isAtTop).toBe(false);
  });

  it("sets isAtTop=true when scrollY < 10", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 50, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 50, writable: true, configurable: true });

      const scrollHandler = addEventListenerSpy.mock.calls.find(
        ([event]) => event === "scroll"
      )?.[1] as EventListener;

      Object.defineProperty(window, "scrollY", { value: 5, writable: true, configurable: true });
      Object.defineProperty(window, "pageYOffset", { value: 5, writable: true, configurable: true });
      scrollHandler(new Event("scroll"));
    });

    expect(result.current.isAtTop).toBe(true);
  });

  it("removes scroll event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    const { unmount } = renderHook(() => useScrollDirection());

    const scrollHandler = addEventListenerSpy.mock.calls.find(
      ([event]) => event === "scroll"
    )?.[1] as EventListener;

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", scrollHandler, { passive: true });
  });

  it("uses passive event listener", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useScrollDirection());

    const scrollCall = addEventListenerSpy.mock.calls.find(
      ([event]) => event === "scroll"
    );

    expect(scrollCall).toBeDefined();
    const options = (scrollCall as unknown[])[2] as AddEventListenerOptions;
    expect(options?.passive).toBe(true);
  });
});
