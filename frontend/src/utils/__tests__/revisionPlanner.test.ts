import { describe, it, expect } from "vitest";
import { generateRevisionPlan } from "../revisionPlanner";

const VALID_PRIORITIES = ["High", "Medium", "Low"] as const;
const VALID_CATEGORIES = [
  "Introduction",
  "Dialogue",
  "Characters",
  "Plot",
  "Ending",
  "Grammar",
] as const;

describe("generateRevisionPlan", () => {
  it("always includes the 'Review Ending' task", () => {
    const r = generateRevisionPlan("");
    expect(r.some((t) => t.title === "Review Ending")).toBe(true);
  });

  it("adds a Strengthen Introduction task for a short story (< 1500 chars)", () => {
    const r = generateRevisionPlan("a short story");
    expect(r.some((t) => t.category === "Introduction")).toBe(true);
  });

  it("does NOT add the Introduction task for a story >= 1500 chars", () => {
    const long = "a".repeat(1500);
    const r = generateRevisionPlan(long);
    expect(r.some((t) => t.category === "Introduction")).toBe(false);
  });

  it("adds an Improve Scene Transition task when 'suddenly' is present", () => {
    const r = generateRevisionPlan("a".repeat(1500) + " suddenly");
    expect(r.some((t) => t.category === "Plot")).toBe(true);
  });

  it("does NOT add the Plot task when 'suddenly' is absent", () => {
    const long = "a".repeat(1500);
    const r = generateRevisionPlan(long);
    expect(r.some((t) => t.category === "Plot")).toBe(false);
  });

  it("adds an Enhance Dialogue task when there are fewer than 8 double-quotes", () => {
    const r = generateRevisionPlan('a "b" c');
    expect(r.some((t) => t.category === "Dialogue")).toBe(true);
  });

  it("does NOT add the Dialogue task when there are >= 8 double-quotes (4 lines)", () => {
    const many = '"a" "b" "c" "d" "e" "f" "g" "h"';
    const r = generateRevisionPlan(many);
    expect(r.some((t) => t.category === "Dialogue")).toBe(false);
  });

  it("each task has the required fields and valid priority/category", () => {
    const r = generateRevisionPlan("a short story with suddenly and few quotes");
    for (const t of r) {
      expect(typeof t.id).toBe("number");
      expect(typeof t.title).toBe("string");
      expect(t.title.length).toBeGreaterThan(0);
      expect(typeof t.description).toBe("string");
      expect(t.description.length).toBeGreaterThan(0);
      expect(VALID_PRIORITIES).toContain(t.priority);
      expect(VALID_CATEGORIES).toContain(t.category);
      expect(typeof t.completed).toBe("boolean");
      expect(t.completed).toBe(false);
    }
  });

  it("task ids are unique", () => {
    const r = generateRevisionPlan("short suddenly");
    const ids = r.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is deterministic for the same input", () => {
    const story = "a short story with suddenly";
    expect(generateRevisionPlan(story)).toEqual(generateRevisionPlan(story));
  });
});
