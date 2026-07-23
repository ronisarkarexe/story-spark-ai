/* eslint-disable */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDirection } from "../useScrollDirection";

describe("useScrollDirection", () => {
  let scrollY = 0;
  const listeners: Record<string, EventListener[]> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    scrollY = 0;
    for (const key of Object.keys(listeners)) {
      delete listeners[key];
    }
    // Use a getter/setter so the value persists
    Object.defineProperty(window, "scrollY", {
      get: () => scrollY,
      set: (v) => { scrollY = v; },
      configurable: true,
    });
    window.addEventListener = vi.fn((event: string, handler: EventListener) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    });
    window.removeEventListener = vi.fn((event: string, handler: EventListener) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(h => h !== handler);
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const fireScroll = (newScrollY: number) => {
    scrollY = newScrollY;
    const event = new Event("scroll");
    listeners["scroll"]?.forEach(handler => handler(event));
  };

  it("initializes with scrollDirection as up", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.scrollDirection).toBe("up");
  });

  it("initializes with isAtTop as true when scrollY is 0", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.isAtTop).toBe(true);
  });

  it("sets isAtTop to false when scrollY >= 10", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => { fireScroll(50); });
    expect(result.current.isAtTop).toBe(false);
  });

  it("sets scrollDirection to down when scrolling down", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => { fireScroll(100); });
    expect(result.current.scrollDirection).toBe("down");
  });

  it("sets scrollDirection to up when scrolling back up", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => { fireScroll(100); });
    expect(result.current.scrollDirection).toBe("down");
    act(() => { fireScroll(50); });
    expect(result.current.scrollDirection).toBe("up");
  });

  it("removes event listener on unmount", () => {
    const { unmount } = renderHook(() => useScrollDirection());
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
