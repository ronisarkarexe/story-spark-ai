import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useRevisionTimeline from "../useRevisionTimeline";
import { createRevision } from "../../utils/revisionTimeline";

describe("useRevisionTimeline", () => {
  it("starts with an empty revisions list", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    expect(result.current.revisions).toEqual([]);
  });

  it("saveRevision prepends a new revision to the list", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("first content");
    });
    expect(result.current.revisions).toHaveLength(1);
    expect(result.current.revisions[0].content).toBe("first content");
  });

  it("saveRevision prepends (most recent first)", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("first");
    });
    act(() => {
      result.current.saveRevision("second");
    });
    expect(result.current.revisions).toHaveLength(2);
    expect(result.current.revisions[0].content).toBe("second");
    expect(result.current.revisions[1].content).toBe("first");
  });

  it("each saved revision has id, timestamp, summary, and content", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("hello world");
    });
    const rev = result.current.revisions[0];
    expect(typeof rev.id).toBe("string");
    expect(rev.id.length).toBeGreaterThan(0);
    expect(typeof rev.timestamp).toBe("string");
    expect(typeof rev.summary).toBe("string");
    expect(rev.content).toBe("hello world");
  });

  it("uses a default summary when none is provided", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    act(() => {
      result.current.saveRevision("content");
    });
    expect(result.current.revisions[0].summary).toBe("Story updated");
  });

  it("createRevision accepts a custom summary", () => {
    const rev = createRevision("content", "custom summary");
    expect(rev.summary).toBe("custom summary");
    expect(rev.content).toBe("content");
  });

  it("saveRevision is a function exposed on the returned object", () => {
    const { result } = renderHook(() => useRevisionTimeline());
    expect(typeof result.current.saveRevision).toBe("function");
  });
});
