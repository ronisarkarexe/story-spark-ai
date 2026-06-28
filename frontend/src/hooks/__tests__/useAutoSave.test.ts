import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutoSave, loadDraft, clearDraft } from "../useAutoSave";

describe("useAutoSave", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

  it("loads an existing draft", () => {
    localStorage.setItem(
      "story_draft_demo",
      JSON.stringify({
        title: "Hello",
        content: "World",
        savedAt: "2025-01-01",
      })
    );

    expect(loadDraft("demo")).toEqual({
      title: "Hello",
      content: "World",
      savedAt: "2025-01-01",
    });
  });

  it("returns null when draft does not exist", () => {
    expect(loadDraft("missing")).toBeNull();
  });

  it("clears a draft", () => {
    localStorage.setItem("story_draft_demo", "{}");

    clearDraft("demo");

    expect(localStorage.getItem("story_draft_demo")).toBeNull();
  });

  it("autosaves after debounce", () => {
    renderHook(() => useAutoSave("demo", "Title", "Content"));

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const saved = JSON.parse(
      localStorage.getItem("story_draft_demo")!
    );

    expect(saved.title).toBe("Title");
    expect(saved.content).toBe("Content");
  });

  it("changes saveStatus to saved", () => {
    const { result } = renderHook(() =>
      useAutoSave("demo", "Title", "Content")
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.saveStatus).toBe("saved");
    expect(result.current.lastSaved).not.toBeNull();
  });

  it("sets saveStatus to error when localStorage fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    const { result } = renderHook(() =>
      useAutoSave("demo", "Title", "Content")
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.saveStatus).toBe("error");
  });
});