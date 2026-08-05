import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useRevisionTimeline from "../useRevisionTimeline";

describe("useRevisionTimeline", () => {
  it("returns empty revisions array initially", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    expect(result.current.revisions).toEqual([]);
  });

  it("saveRevision adds a revision to the top of the list", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("First chapter content.");
    });
    expect(result.current.revisions.length).toBe(1);
    expect(result.current.revisions[0].content).toBe("First chapter content.");
    expect(result.current.revisions[0].id).toBeDefined();
    expect(result.current.revisions[0].timestamp).toBeDefined();
  });

  it("saveRevision prepends new revision, keeping older ones below", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("First revision");
    });
    act(() => {
      result.current.saveRevision("Second revision");
    });
    expect(result.current.revisions.length).toBe(2);
    expect(result.current.revisions[0].content).toBe("Second revision");
    expect(result.current.revisions[1].content).toBe("First revision");
  });

  it("saveRevision assigns unique ids to each revision", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("First");
    });
    act(() => {
      result.current.saveRevision("Second");
    });
    const ids = result.current.revisions.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(2);
  });

  it("saveRevision assigns a timestamp to each revision", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("Test content");
    });
    expect(typeof result.current.revisions[0].timestamp).toBe("string");
    expect(result.current.revisions[0].timestamp.length).toBeGreaterThan(0);
  });
});
