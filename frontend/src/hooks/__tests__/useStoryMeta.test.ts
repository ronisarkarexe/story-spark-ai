import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStoryMeta } from "../useStoryMeta";

describe("useStoryMeta hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset document state before each test
    document.title = "";
    const metas = document.querySelectorAll(
      'meta[name="description"], meta[property="og:description"], meta[name="twitter:description"], meta[property="og:title"], meta[name="twitter:title"], meta[property="og:image"], meta[name="twitter:image"]'
    );
    metas.forEach((m) => m.remove());
    // Add fresh meta elements for testing
    const metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    metaDesc.setAttribute("content", "");
    document.head.appendChild(metaDesc);

    const ogDesc = document.createElement("meta");
    ogDesc.setAttribute("property", "og:description");
    ogDesc.setAttribute("content", "");
    document.head.appendChild(ogDesc);

    const ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    ogTitle.setAttribute("content", "");
    document.head.appendChild(ogTitle);

    const twitterTitle = document.createElement("meta");
    twitterTitle.setAttribute("name", "twitter:title");
    twitterTitle.setAttribute("content", "");
    document.head.appendChild(twitterTitle);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("sets document.title to title with app suffix", () => {
    renderHook(() => useStoryMeta({ title: "My Story" }));
    expect(document.title).toBe("My Story \u2013 Story Spark AI");
  });

  it("sets og:title meta tag", () => {
    renderHook(() => useStoryMeta({ title: "Test Title" }));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).toBeDefined();
    expect((ogTitle as HTMLMetaElement).content).toBe("Test Title \u2013 Story Spark AI");
  });

  it("sets twitter:title meta tag", () => {
    renderHook(() => useStoryMeta({ title: "Test Title" }));
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    expect(twitterTitle).toBeDefined();
    expect((twitterTitle as HTMLMetaElement).content).toBe("Test Title \u2013 Story Spark AI");
  });

  it("sets og:description when description prop is provided", () => {
    renderHook(() => useStoryMeta({ title: "T", description: "A great story" }));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc).toBeDefined();
    expect((ogDesc as HTMLMetaElement).content).toBe("A great story");
  });

  it("sets twitter:description when description prop is provided", () => {
    renderHook(() => useStoryMeta({ title: "T", description: "A great story" }));
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    expect(twitterDesc).toBeDefined();
    expect((twitterDesc as HTMLMetaElement).content).toBe("A great story");
  });

  it("does not set description meta tags when description prop is omitted", () => {
    const { result } = renderHook(() => useStoryMeta({ title: "T" }));
    // The hook should not set description meta when prop is undefined
    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc).toBeDefined();
    expect((ogDesc as HTMLMetaElement).content).toBe("");
  });

  it("updates meta tags when title changes", () => {
    const { rerender } = renderHook(
      ({ title }: { title: string }) => useStoryMeta({ title }),
      { initialProps: { title: "First Title" } }
    );

    expect(document.title).toBe("First Title \u2013 Story Spark AI");

    rerender({ title: "Second Title" });
    expect(document.title).toBe("Second Title \u2013 Story Spark AI");
  });

  it("handles missing meta elements gracefully (no crash)", () => {
    // Remove all meta elements
    document.querySelectorAll("meta").forEach((m) => m.remove());
    expect(() => renderHook(() => useStoryMeta({ title: "T" }))).not.toThrow();
  });
});
