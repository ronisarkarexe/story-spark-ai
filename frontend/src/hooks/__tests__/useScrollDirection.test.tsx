import { describe, it, expect, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDirection } from "../useScrollDirection";

describe("useScrollDirection", () => {
  afterEach(() => {
    // Reset scrollY to 0 for next test
    window.scrollY = 0;
  });

  it("returns isAtTop=true when scrollY is 0 (initial state)", () => {
    window.scrollY = 0;
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.isAtTop).toBe(true);
  });

  it("returns isAtTop=false when scrollY >= 10", () => {
    window.scrollY = 0;
    const { result } = renderHook(() => useScrollDirection());
    // Scroll down to 50 and fire scroll event
    window.scrollY = 50;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.isAtTop).toBe(false);
  });

  it("returns scrollDirection='up' initially", () => {
    window.scrollY = 0;
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current.scrollDirection).toBe("up");
  });

  it("returns scrollDirection='down' when scrollY increases", () => {
    window.scrollY = 0;
    const { result } = renderHook(() => useScrollDirection());
    window.scrollY = 100;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("down");
  });

  it("returns scrollDirection='up' when scrollY decreases", () => {
    window.scrollY = 0;
    const { result } = renderHook(() => useScrollDirection());
    // First scroll down
    window.scrollY = 200;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("down");
    // Then scroll up
    window.scrollY = 50;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current.scrollDirection).toBe("up");
  });
});
