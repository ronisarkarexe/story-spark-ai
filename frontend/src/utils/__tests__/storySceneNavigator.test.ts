import { describe, it, expect } from "vitest";
import { detectScenes, renameScene } from "../storySceneNavigator";

describe("detectScenes", () => {
  it("returns an empty array for empty text", () => {
    expect(detectScenes("")).toEqual([]);
    expect(detectScenes("   ")).toEqual([]);
  });

  it("splits scenes by double newline", () => {
    const result = detectScenes("Scene one.\n\nScene two.\n\nScene three.");
    expect(result).toHaveLength(3);
  });

  it("assigns sequential ids starting at 1", () => {
    const result = detectScenes("First.\n\nSecond.");
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it("assigns default titles", () => {
    const result = detectScenes("First scene.");
    expect(result[0].title).toBe("Scene 1");
  });

  it("preserves the section content", () => {
    const result = detectScenes("Once upon a time.");
    expect(result[0].content).toBe("Once upon a time.");
  });
});

describe("renameScene", () => {
  it("renames the scene with the matching id", () => {
    const scenes = detectScenes("One.\n\nTwo.");
    const renamed = renameScene(scenes, 2, "The Climax");
    expect(renamed[1].title).toBe("The Climax");
  });

  it("leaves other scenes untouched", () => {
    const scenes = detectScenes("One.\n\nTwo.");
    const renamed = renameScene(scenes, 1, "Opening");
    expect(renamed[0].title).toBe("Opening");
    expect(renamed[1].title).toBe("Scene 2");
  });

  it("does not mutate the original scenes array", () => {
    const scenes = detectScenes("One.\n\nTwo.");
    const original = scenes[0].title;
    renameScene(scenes, 1, "Changed");
    expect(scenes[0].title).toBe(original);
  });

  it("returns an unchanged list when no scene matches", () => {
    const scenes = detectScenes("One.\n\nTwo.");
    const renamed = renameScene(scenes, 99, "Ghost");
    expect(renamed).toEqual(scenes);
  });
});
