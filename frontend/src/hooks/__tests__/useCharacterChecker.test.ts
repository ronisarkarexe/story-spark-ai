import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCharacterChecker from "../useCharacterChecker";

describe("useCharacterChecker", () => {
  it("returns empty issues array initially", () => {
    const { result } = renderHook(() => useCharacterChecker());
    expect(result.current.issues).toEqual([]);
  });

  it("analyzeStory populates issues when name variations are found", () => {
    const { result } = renderHook(() => useCharacterChecker());
    act(() => {
      result.current.analyzeStory("Jon went to the store. Micheal called.");
    });
    expect(result.current.issues.length).toBe(2);
    expect(result.current.issues).toContainEqual({
      original: "Jon",
      suggestion: "John",
    });
    expect(result.current.issues).toContainEqual({
      original: "Micheal",
      suggestion: "Michael",
    });
  });

  it("analyzeStory does not add issues when no known names are found", () => {
    const { result } = renderHook(() => useCharacterChecker());
    act(() => {
      result.current.analyzeStory("Alice and Bob went to the park.");
    });
    expect(result.current.issues).toEqual([]);
  });

  it("replaceName replaces all occurrences of old name with new name", () => {
    const { result } = renderHook(() => useCharacterChecker());
    const replaced = result.current.replaceName(
      "Jon and Jon went to school. Jon was happy.",
      "Jon",
      "John"
    );
    expect(replaced).toBe("John and John went to school. John was happy.");
  });

  it("replaceName handles names with punctuation attached", () => {
    const { result } = renderHook(() => useCharacterChecker());
    const replaced = result.current.replaceName(
      "Hello, Sara! How are you?",
      "Sara",
      "Sarah"
    );
    expect(replaced).toBe("Hello, Sarah! How are you?");
  });

  it("analyzeStory updates issues state correctly", () => {
    const { result } = renderHook(() => useCharacterChecker());
    act(() => {
      result.current.analyzeStory("Jon was here.");
    });
    expect(result.current.issues[0].original).toBe("Jon");
    expect(result.current.issues[0].suggestion).toBe("John");
  });

  it("replaceName returns unchanged string when oldName not found", () => {
    const { result } = renderHook(() => useCharacterChecker());
    const replaced = result.current.replaceName(
      "Alice went home.",
      "Bob",
      "Robert"
    );
    expect(replaced).toBe("Alice went home.");
  });

  it("analyzeStory is idempotent across multiple calls", () => {
    const { result } = renderHook(() => useCharacterChecker());
    act(() => {
      result.current.analyzeStory("Jon was here.");
    });
    const firstCount = result.current.issues.length;
    act(() => {
      result.current.analyzeStory("Micheal was here.");
    });
    // Second call replaces issues, not appends
    expect(result.current.issues.length).toBe(1);
    expect(result.current.issues[0].original).toBe("Micheal");
  });
});
