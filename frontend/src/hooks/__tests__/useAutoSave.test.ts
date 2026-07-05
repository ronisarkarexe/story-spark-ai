/**
 * useAutoSave.test.ts
 * Unit tests for the useAutoSave React hook and draft helpers.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutoSave, loadDraft, clearDraft, offlineQueue } from "../useAutoSave";

const DRAFT_KEY = "story_draft_";

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  offlineQueue.length = 0;
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });
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

  it("should queue edits when offline and flush them to server on reconnect", async () => {
    const onlineSpy = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = mockFetch;

    const { result, rerender } = renderHook(
      ({ id, title, content }: { id: string; title: string; content: string }) =>
        useAutoSave(id, title, content),
      { initialProps: { id: "draft-online-test", title: "A", content: "Initial Content" } }
    );

    rerender({ id: "draft-online-test", title: "A", content: "Edited Content Offline" });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(result.current.saveStatus).toBe("saved");
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.isOnline).toBe(false);
    expect(result.current.pendingCount).toBe(1);

    onlineSpy.mockReturnValue(true);
    
    await act(async () => {
      window.dispatchEvent(new Event("online"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/stories/save", expect.objectContaining({
      method: "PUT",
      body: JSON.stringify({ content: "Edited Content Offline" }),
    }));

    expect(result.current.isOnline).toBe(true);
    expect(result.current.pendingCount).toBe(0);
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
