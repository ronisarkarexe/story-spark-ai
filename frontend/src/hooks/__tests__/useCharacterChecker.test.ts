import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCharacterChecker from "../useCharacterChecker";

vi.mock("../../utils/nameConsistency", () => ({
  checkNameConsistency: vi.fn((text: string) => {
    if (text.includes("Jon")) {
      return [{ original: "Jon", suggestion: "John" }];
    }
    return [];
  }),
}));

describe("useCharacterChecker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty issues", () => {
    const { result } = renderHook(() => useCharacterChecker());
    expect(result.current.issues).toEqual([]);
  });

  it("analyzeStory sets issues from checkNameConsistency", async () => {
    const { result } = renderHook(() => useCharacterChecker());

    await act(async () => {
      result.current.analyzeStory("My friend Jon was there.");
    });

    expect(result.current.issues.length).toBeGreaterThan(0);
    expect(result.current.issues[0]).toMatchObject({
      original: "Jon",
      suggestion: "John",
    });
  });

  it("analyzeStory does not set issues for clean story", async () => {
    const { result } = renderHook(() => useCharacterChecker());

    await act(async () => {
      result.current.analyzeStory("My friend John was there.");
    });

    expect(result.current.issues).toEqual([]);
  });

  it("replaceName returns story with oldName replaced by newName", () => {
    const { result } = renderHook(() => useCharacterChecker());
    const modified = result.current.replaceName(
      "Jon went to school.",
      "Jon",
      "John"
    );
    expect(modified).toBe("John went to school.");
  });

  it("replaceName replaces all occurrences of the name", () => {
    const { result } = renderHook(() => useCharacterChecker());
    const modified = result.current.replaceName(
      "Jon said hello to Jon.",
      "Jon",
      "John"
    );
    expect(modified).toBe("John said hello to John.");
  });

  it("replaceName returns original story when oldName not found", () => {
    const { result } = renderHook(() => useCharacterChecker());
    const original = "John went home.";
    const modified = result.current.replaceName(original, "Nobody", "Somebody");
    expect(modified).toBe(original);
  });
});
