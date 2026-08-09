import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

// Mock localStorage before importing the hook
const mockStore = {};

global.localStorage = {
  getItem: vi.fn((key) => mockStore[key] ?? null),
  setItem: vi.fn((key, value) => {
    mockStore[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete mockStore[key];
  }),
};

const { useAccessibility } = await import("../useAccessibility.js");

describe("useAccessibility hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockStore).forEach((k) => delete mockStore[k]);
  });

  it("should initialize with highContrast and reducedMotion as false", () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.highContrast).toBe(false);
    expect(result.current.reducedMotion).toBe(false);
  });

  it("should load saved highContrast from localStorage on mount", () => {
    mockStore["accessibility-contrast"] = "true";
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.highContrast).toBe(true);
  });

  it("should toggle highContrast to true and persist to localStorage", () => {
    const { result } = renderHook(() => useAccessibility());
    result.current.toggleContrast();
    expect(result.current.highContrast).toBe(true);
    expect(mockStore["accessibility-contrast"]).toBe("true");
  });

  it("should toggle highContrast back to false", () => {
    mockStore["accessibility-contrast"] = "true";
    const { result } = renderHook(() => useAccessibility());
    result.current.toggleContrast();
    expect(result.current.highContrast).toBe(false);
    expect(mockStore["accessibility-contrast"]).toBe("false");
  });

  it("should toggle reducedMotion and persist to localStorage", () => {
    const { result } = renderHook(() => useAccessibility());
    result.current.toggleMotion();
    expect(result.current.reducedMotion).toBe(true);
    expect(mockStore["accessibility-motion"]).toBe("true");
  });

  it("should toggle reducedMotion back to false", () => {
    mockStore["accessibility-motion"] = "true";
    const { result } = renderHook(() => useAccessibility());
    result.current.toggleMotion();
    expect(result.current.reducedMotion).toBe(false);
    expect(mockStore["accessibility-motion"]).toBe("false");
  });
});
