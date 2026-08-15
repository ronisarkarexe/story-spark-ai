import { describe, it, expect } from "vitest";
import { detectScenes, renameScene } from "../storySceneNavigator";

describe("detectScenes", () => {
  it("returns an empty array for an empty story", () => {
    expect(detectScenes("")).toEqual([]);
  });

  it("returns an empty array for whitespace-only content", () => {
    expect(detectScenes("   \n\n   \n   ")).toEqual([]);
  });

  it("detects a single scene for a single paragraph", () => {
    const r = detectScenes("A single scene of story text.");
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
    expect(r[0].title).toBe("Scene 1");
    expect(r[0].content).toBe("A single scene of story text.");
  });

  it("splits by blank lines into sequential scenes", () => {
    const r = detectScenes("Scene one.\n\nScene two.\n\nScene three.");
    expect(r.map((s) => s.id)).toEqual([1, 2, 3]);
    expect(r.map((s) => s.title)).toEqual(["Scene 1", "Scene 2", "Scene 3"]);
  });

  it("preserves the full section text as content", () => {
    const r = detectScenes("First scene text here.");
    expect(r[0].content).toBe("First scene text here.");
  });

  it("ignores blank/whitespace-only sections", () => {
    const r = detectScenes("real scene\n\n   \n\nanother real scene");
    expect(r).toHaveLength(2);
  });

  it("is deterministic for the same input", () => {
    const story = "Scene one.\n\nScene two.";
    expect(detectScenes(story)).toEqual(detectScenes(story));
  });
});

describe("renameScene", () => {
  it("renames the scene matching the given id", () => {
    const scenes = detectScenes("Scene one.\n\nScene two.\n\nScene three.");
    const r = renameScene(scenes, 2, "The Turning Point");
    expect(r[0].title).toBe("Scene 1");
    expect(r[1].title).toBe("The Turning Point");
    expect(r[2].title).toBe("Scene 3");
  });

  it("preserves content of the renamed scene", () => {
    const scenes = detectScenes("Scene one.\n\nScene two.");
    const r = renameScene(scenes, 1, "Opening");
    expect(r[0].content).toBe("Scene one.");
  });

  it("leaves all scenes unchanged when id does not match", () => {
    const scenes = detectScenes("Scene one.\n\nScene two.");
    const r = renameScene(scenes, 999, "Nope");
    expect(r.every((s) => s.title.startsWith("Scene"))).toBe(true);
  });

  it("returns an empty array for empty input", () => {
    expect(renameScene([], 1, "Title")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const scenes = detectScenes("Scene one.\n\nScene two.");
    renameScene(scenes, 1, "New");
    expect(scenes[0].title).toBe("Scene 1");
  });
});
