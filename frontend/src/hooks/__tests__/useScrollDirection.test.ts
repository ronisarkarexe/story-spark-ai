import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDirection } from "../useScrollDirection";

describe("useScrollDirection", () => {
  beforeEach(() => {
    window.scrollY = 0;
  });

  it("returns isAtTop as true when scrollY is 0", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.isAtTop).toBe(true);
    expect(result.current.scrollDirection).toBe("up");
  });

  it("detects scroll down direction", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => {
      window.scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("down");
  });

  it("detects scroll up direction", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => {
      window.scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });
    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("up");
  });

  it("sets isAtTop to false when scrolled past threshold", () => {
    const { result } = renderHook(() => useScrollDirection());
    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.isAtTop).toBe(false);
  });
});
