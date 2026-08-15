import { describe, it, expect } from "vitest";
import { generateChecklist } from "../storyChecklist";

describe("generateChecklist", () => {
  it("returns a checklist with all six items", () => {
    const r = generateChecklist({ title: "", content: "" });
    expect(r.map((c) => c.id)).toEqual([
      "title",
      "characters",
      "setting",
      "conflict",
      "climax",
      "conclusion",
    ]);
  });

  it("each item has id, label, and a boolean completed", () => {
    const r = generateChecklist({ title: "T", content: "c" });
    for (const c of r) {
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBeGreaterThan(0);
      expect(typeof c.label).toBe("string");
      expect(c.label.length).toBeGreaterThan(0);
      expect(typeof c.completed).toBe("boolean");
    }
  });

  it("ids are unique", () => {
    const r = generateChecklist({ title: "", content: "" });
    const ids = r.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marks all items complete for a fully-formed story", () => {
    const story = {
      title: "The Hero's Journey",
      content:
        "The hero met a friend in the city. A villain caused a problem and a fight broke out. The battle was the climax, and the story had a happy ending.",
    };
    const r = generateChecklist(story);
    expect(r.every((c) => c.completed)).toBe(true);
  });

  it("marks only the title complete for an empty-content story with a title", () => {
    const r = generateChecklist({ title: "My Story", content: "" });
    const byId = Object.fromEntries(r.map((c) => [c.id, c.completed]));
    expect(byId.title).toBe(true);
    expect(byId.characters).toBe(false);
    expect(byId.setting).toBe(false);
    expect(byId.conflict).toBe(false);
    expect(byId.climax).toBe(false);
    expect(byId.conclusion).toBe(false);
  });

  it("marks title incomplete for whitespace-only title", () => {
    const r = generateChecklist({ title: "   ", content: "hero city fight battle finally ended" });
    expect(r.find((c) => c.id === "title")!.completed).toBe(false);
  });

  it("detects characters/setting/conflict/climax/conclusion case-insensitively", () => {
    const r = generateChecklist({
      title: "T",
      content: "HERO in the CITY faced a PROBLEM; the BATTLE was the CLIMAX and it ENDED.",
    });
    expect(r.find((c) => c.id === "characters")!.completed).toBe(true);
    expect(r.find((c) => c.id === "setting")!.completed).toBe(true);
    expect(r.find((c) => c.id === "conflict")!.completed).toBe(true);
    expect(r.find((c) => c.id === "climax")!.completed).toBe(true);
    expect(r.find((c) => c.id === "conclusion")!.completed).toBe(true);
  });

  it("is deterministic for the same input", () => {
    const story = { title: "T", content: "A story with a hero." };
    expect(generateChecklist(story)).toEqual(generateChecklist(story));
  });
});
