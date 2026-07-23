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
  }) as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("useAutoSave", () => {
  it("uses the autosave endpoint and includes the draft identifier", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useAutoSave("draft-1", "Hello", "World"));

    await act(async () => {
      vi.advanceTimersByTime(1500);
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.saveStatus).toBe("saved"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/stories/save",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ draftId: "draft-1", title: "Hello", content: "World" }),
      })
    );
  });

  it("queues offline edits and flushes them once after reconnect", async () => {
    const onlineSpy = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result, rerender } = renderHook(
      ({ id, title, content }: { id: string; title: string; content: string }) =>
        useAutoSave(id, title, content),
      { initialProps: { id: "draft-2", title: "A", content: "B" } }
    );

    rerender({ id: "draft-2", title: "A", content: "Offline edit" });

    await act(async () => {
      vi.advanceTimersByTime(1500);
      await Promise.resolve();
    });

    expect(result.current.pendingCount).toBe(1);
    expect(offlineQueue).toHaveLength(1);

    onlineSpy.mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event("online"));
      await Promise.resolve();
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/stories/save",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ draftId: "draft-2", title: "A", content: "Offline edit" }),
      })
    );
    expect(result.current.pendingCount).toBe(0);
  });

  it("flushes the queue only once when multiple hook instances are mounted", async () => {
    const onlineSpy = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderHook(() => useAutoSave("draft-a", "A", "First"));
    renderHook(() => useAutoSave("draft-b", "B", "Second"));

    await act(async () => {
      vi.advanceTimersByTime(1500);
      await Promise.resolve();
    });

    expect(offlineQueue).toHaveLength(2);

    onlineSpy.mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event("online"));
      window.dispatchEvent(new Event("online"));
      await Promise.resolve();
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
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