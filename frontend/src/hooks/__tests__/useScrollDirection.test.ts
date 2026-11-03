import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDirection } from "../useScrollDirection";

const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
};

const fireScroll = (scrollY: number) => {
  setScrollY(scrollY);
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

describe("useScrollDirection", () => {
  beforeEach(() => {
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to isAtTop=true and scrollDirection='up' before any scrolling", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.isAtTop).toBe(true);
    expect(result.current.scrollDirection).toBe("up");
  });

  it("registers a passive scroll listener on mount and removes it on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollDirection());

    expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("returns isAtTop=true when scrollY is less than 10", () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(5);
    expect(result.current.isAtTop).toBe(true);
  });

  it("returns isAtTop=false when scrollY is 10 or greater", () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(10);
    expect(result.current.isAtTop).toBe(false);
  });

  it("returns scrollDirection='down' when scrollY increases", () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(100);
    expect(result.current.scrollDirection).toBe("down");
  });

  it("returns scrollDirection='up' when scrollY decreases", () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(200);
    expect(result.current.scrollDirection).toBe("down");
    fireScroll(50);
    expect(result.current.scrollDirection).toBe("up");
  });

  it("treats equal scrollY as scrollDirection='up'", () => {
    const { result } = renderHook(() => useScrollDirection());
    fireScroll(100);
    expect(result.current.scrollDirection).toBe("down");
    // Same position: currentScrollY (100) is not > lastScrollY (100), so "up"
    fireScroll(100);
    expect(result.current.scrollDirection).toBe("up");
  });
});
