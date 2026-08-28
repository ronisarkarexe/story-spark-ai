import { describe, it, expect } from "vitest";
import {
  hasTitle,
  hasCharacters,
  hasSetting,
  hasConflict,
  hasClimax,
  hasConclusion,
  generateChecklist,
} from "../storyChecklist";

const sampleStory = {
  title: "The Dragon Slayer",
  content:
    "A hero and her friend faced a villain in the forest. Finally, the battle began and ended with a happy ending.",
};

describe("hasTitle", () => {
  it("returns true for a non-empty title", () => {
    expect(hasTitle({ title: "Title", content: "" })).toBe(true);
  });

  it("returns false for an empty title", () => {
    expect(hasTitle({ title: "", content: "" })).toBe(false);
  });

  it("returns false for a whitespace-only title", () => {
    expect(hasTitle({ title: "   ", content: "" })).toBe(false);
  });
});

describe("hasCharacters", () => {
  it("detects character keywords", () => {
    expect(hasCharacters({ title: "", content: "A hero appeared." })).toBe(true);
  });

  it("returns false when no character keywords are present", () => {
    expect(hasCharacters({ title: "", content: "It rained all day." })).toBe(false);
  });
});

describe("hasSetting", () => {
  it("detects setting keywords", () => {
    expect(hasSetting({ title: "", content: "They arrived at the castle." })).toBe(true);
  });

  it("returns false when no setting keywords are present", () => {
    expect(hasSetting({ title: "", content: "A quiet moment passed." })).toBe(false);
  });
});

describe("hasConflict", () => {
  it("detects conflict keywords", () => {
    expect(hasConflict({ title: "", content: "A dangerous enemy approached." })).toBe(true);
  });

  it("returns false when no conflict keywords are present", () => {
    expect(hasConflict({ title: "", content: "They sat by the fire." })).toBe(false);
  });
});

describe("hasClimax", () => {
  it("detects climax keywords", () => {
    expect(hasClimax({ title: "", content: "The final battle began." })).toBe(true);
  });

  it("returns false when no climax keywords are present", () => {
    expect(hasClimax({ title: "", content: "A peaceful morning." })).toBe(false);
  });
});

describe("hasConclusion", () => {
  it("detects conclusion keywords", () => {
    expect(hasConclusion({ title: "", content: "It all ended with a happy ending." })).toBe(true);
  });

  it("returns false when no conclusion keywords are present", () => {
    expect(hasConclusion({ title: "", content: "The story continues..." })).toBe(false);
  });
});

describe("generateChecklist", () => {
  it("returns six checklist items", () => {
    const checklist = generateChecklist(sampleStory);
    expect(checklist).toHaveLength(6);
  });

  it("marks the title item complete for a titled story", () => {
    const checklist = generateChecklist(sampleStory);
    const titleItem = checklist.find((i) => i.id === "title");
    expect(titleItem?.completed).toBe(true);
  });

  it("uses the expected item ids", () => {
    const checklist = generateChecklist(sampleStory);
    const ids = checklist.map((i) => i.id);
    expect(ids).toEqual(["title", "characters", "setting", "conflict", "climax", "conclusion"]);
  });

  it("marks every item incomplete for an empty story", () => {
    const checklist = generateChecklist({ title: "", content: "" });
    for (const item of checklist) {
      expect(item.completed).toBe(false);
    }
  });
});
