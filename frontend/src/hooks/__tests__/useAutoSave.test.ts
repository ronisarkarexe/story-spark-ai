/**
 * useAutoSave.test.ts
 * Unit tests for the useAutoSave React hook and draft helpers.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutoSave, loadDraft, clearDraft } from "../useAutoSave";

const DRAFT_KEY = "story_draft_";

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useAutoSave", () => {
  it("initializes with idle saveStatus", () => {
    const { result } = renderHook(() =>
      useAutoSave("draft-1", "My Title", "My content")
    );
    expect(result.current.saveStatus).toBe("idle");
    expect(result.current.lastSaved).toBeNull();
  });

  it("transitions through saving and saved on explicit save()", async () => {
    const { result } = renderHook(() =>
      useAutoSave("draft-2", "Title", "Content")
    );
    act(() => {
      result.current.save();
    });
    await waitFor(() => {
      expect(result.current.saveStatus).toBe("saved");
    });
    expect(result.current.lastSaved).not.toBeNull();
  });

  it("debounces saves on title change", async () => {
    const { result, rerender } = renderHook(
      ({ id, title, content }: { id: string; title: string; content: string }) =>
        useAutoSave(id, title, content),
      { initialProps: { id: "draft-3", title: "A", content: "B" } }
    );
    // Advance just under debounce threshold — should not save yet
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    // Rerender with changed title — resets debounce timer
    rerender({ id: "draft-3", title: "B Updated", content: "B" });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await waitFor(() => {
      expect(result.current.saveStatus).toBe("saved");
    });
  });

  it("sets error status when localStorage throws quota exceeded", async () => {
    const { result } = renderHook(() =>
      useAutoSave("draft-4", "Title", "Content")
    );
    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("QuotaExceededError");
    });
    act(() => {
      result.current.save();
    });
    await waitFor(() => {
      expect(result.current.saveStatus).toBe("error");
    });
  });
});

describe("loadDraft", () => {
  it("returns null for a non-existent draft", () => {
    expect(loadDraft("nonexistent")).toBeNull();
  });

  it("returns parsed DraftData for a valid draft", () => {
    const draftData = {
      title: "Test Title",
      content: "Test content",
      savedAt: "2026-01-01T00:00:00.000Z",
    };
    localStorage.setItem(DRAFT_KEY + "draft-5", JSON.stringify(draftData));
    expect(loadDraft("draft-5")).toEqual(draftData);
  });

  it("returns null when localStorage contains invalid JSON", () => {
    localStorage.setItem(DRAFT_KEY + "bad-draft", "not valid json {{{");
    expect(loadDraft("bad-draft")).toBeNull();
  });
});

describe("clearDraft", () => {
  it("removes the draft from localStorage", () => {
    localStorage.setItem(DRAFT_KEY + "draft-6", JSON.stringify({ title: "A", content: "B", savedAt: "" }));
    clearDraft("draft-6");
    expect(localStorage.getItem(DRAFT_KEY + "draft-6")).toBeNull();
  });
});
