import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useScrollDirection } from "../useScrollDirection";

describe("useScrollDirection", () => {
  const originalScrollY = window.scrollY;

  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "scrollY", {
      value: originalScrollY,
      writable: true,
    });
  });

  it("should initialize with direction up and isAtTop true", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.scrollDirection).toBe("up");
    expect(result.current.isAtTop).toBe(true);
  });

  it("should detect scrolling down", () => {
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.scrollDirection).toBe("down");
    expect(result.current.isAtTop).toBe(false);
  });

  it("should detect scrolling up", () => {
    const { result } = renderHook(() => useScrollDirection());

    // Scroll down first
    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("down");

    // Scroll up
    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("up");
  });

  it("should set isAtTop true when scroll is near top", () => {
    const { result } = renderHook(() => useScrollDirection());

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.isAtTop).toBe(false);

    act(() => {
      window.scrollY = 5;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.isAtTop).toBe(true);
  });
});
