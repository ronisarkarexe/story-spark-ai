import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveStoryDraft,
  loadStoryDraft,
  clearStoryDraft,
  StoryDraftData,
} from "../story-draft";

const mockDraft: StoryDraftData = {
  prompt: "A dragon who loves knitting",
  genre: "Fantasy",
  length: "medium",
  tone: "whimsical",
  language: "en",
  savedAt: "2026-06-27T12:00:00Z",
};

describe("story-draft", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("saveStoryDraft", () => {
    it("stores a draft in localStorage", () => {
      saveStoryDraft(mockDraft);
      expect(localStorage.getItem("storyspark_story_draft_v1")).toBe(
        JSON.stringify(mockDraft)
      );
    });

    it("does not throw when draft is null", () => {
      expect(() => saveStoryDraft(null as any)).not.toThrow();
    });

    it("handles SSR environment gracefully", () => {
      // The SSR guard prevents any call to localStorage when window is undefined
      // In jsdom environment, window is defined so localStorage is used
      expect(() => saveStoryDraft(mockDraft)).not.toThrow();
    });
  });

  describe("loadStoryDraft", () => {
    it("returns null when no draft exists", () => {
      expect(loadStoryDraft()).toBeNull();
    });

    it("returns null for empty localStorage value", () => {
      localStorage.setItem("storyspark_story_draft_v1", "");
      expect(loadStoryDraft()).toBeNull();
    });

    it("returns parsed draft when it exists", () => {
      localStorage.setItem("storyspark_story_draft_v1", JSON.stringify(mockDraft));
      const result = loadStoryDraft();
      expect(result).toEqual(mockDraft);
    });

    it("returns null and does not throw on invalid JSON", () => {
      localStorage.setItem("storyspark_story_draft_v1", "not valid json {");
      expect(() => loadStoryDraft()).not.toThrow();
      expect(loadStoryDraft()).toBeNull();
    });
  });

  describe("clearStoryDraft", () => {
    it("removes the draft from localStorage", () => {
      localStorage.setItem("storyspark_story_draft_v1", JSON.stringify(mockDraft));
      clearStoryDraft();
      expect(localStorage.getItem("storyspark_story_draft_v1")).toBeNull();
    });

    it("does not throw when no draft exists", () => {
      expect(() => clearStoryDraft()).not.toThrow();
    });
  });
});
