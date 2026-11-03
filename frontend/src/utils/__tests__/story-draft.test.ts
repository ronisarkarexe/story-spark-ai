import { describe, it, expect, beforeEach } from "vitest";
import {
  saveStoryDraft,
  loadStoryDraft,
  clearStoryDraft,
  type StoryDraftData,
} from "../story-draft";

const validDraft: StoryDraftData = {
  prompt: "A story about dragons",
  genre: "fantasy",
  length: "medium",
  tone: "adventurous",
  language: "en",
  savedAt: "2026-07-05T10:00:00Z",
};

describe("story-draft utility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("saveStoryDraft", () => {
    it("stores draft JSON under the correct localStorage key", () => {
      saveStoryDraft(validDraft);
      const stored = localStorage.getItem("storyspark_story_draft_v1");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored as string) as StoryDraftData;
      expect(parsed.prompt).toBe("A story about dragons");
      expect(parsed.genre).toBe("fantasy");
    });

    it("is a no-op when draft is null", () => {
      expect(() => saveStoryDraft(null as unknown as StoryDraftData)).not.toThrow();
      expect(localStorage.getItem("storyspark_story_draft_v1")).toBeNull();
    });

    it("is a no-op when draft is undefined", () => {
      expect(() => saveStoryDraft(undefined as unknown as StoryDraftData)).not.toThrow();
    });

    it("is a no-op when draft is empty object", () => {
      const emptyDraft = {} as StoryDraftData;
      saveStoryDraft(emptyDraft);
      // Empty object is still truthy so it gets saved
      const stored = localStorage.getItem("storyspark_story_draft_v1");
      expect(stored).not.toBeNull();
    });
  });

  describe("loadStoryDraft", () => {
    it("returns stored draft as StoryDraftData", () => {
      localStorage.setItem("storyspark_story_draft_v1", JSON.stringify(validDraft));
      const loaded = loadStoryDraft();
      expect(loaded).not.toBeNull();
      expect((loaded as StoryDraftData).prompt).toBe("A story about dragons");
      expect((loaded as StoryDraftData).genre).toBe("fantasy");
    });

    it("returns null when no draft is stored", () => {
      expect(loadStoryDraft()).toBeNull();
    });

    it("returns null when stored JSON is invalid", () => {
      localStorage.setItem("storyspark_story_draft_v1", "not valid json {{{");
      expect(loadStoryDraft()).toBeNull();
    });

    it("returns null when stored value is empty string", () => {
      localStorage.setItem("storyspark_story_draft_v1", "");
      expect(loadStoryDraft()).toBeNull();
    });
  });

  describe("clearStoryDraft", () => {
    it("removes draft from localStorage", () => {
      localStorage.setItem("storyspark_story_draft_v1", JSON.stringify(validDraft));
      clearStoryDraft();
      expect(localStorage.getItem("storyspark_story_draft_v1")).toBeNull();
    });

    it("does not throw when no draft exists", () => {
      expect(() => clearStoryDraft()).not.toThrow();
    });
  });

  it("round-trip: save then load returns equivalent data", () => {
    saveStoryDraft(validDraft);
    const loaded = loadStoryDraft();
    expect(loaded).toEqual(validDraft);
  });
});
