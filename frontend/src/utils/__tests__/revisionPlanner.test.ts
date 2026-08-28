import { describe, it, expect } from "vitest";
import { generateRevisionPlan } from "../revisionPlanner";

describe("generateRevisionPlan", () => {
  it("always includes a review-ending task", () => {
    const tasks = generateRevisionPlan("A complete story with plenty of content.");
    const ending = tasks.find((t) => t.category === "Ending");
    expect(ending).toBeDefined();
  });

  it("adds an introduction task for short stories", () => {
    const tasks = generateRevisionPlan("short");
    expect(tasks.some((t) => t.category === "Introduction")).toBe(true);
  });

  it("does not add an introduction task for long stories", () => {
    const longStory = "word ".repeat(1600);
    const tasks = generateRevisionPlan(longStory);
    expect(tasks.some((t) => t.category === "Introduction")).toBe(false);
  });

  it("adds a scene-transition task when the story contains 'suddenly'", () => {
    const tasks = generateRevisionPlan("suddenly the door opened.");
    expect(tasks.some((t) => t.title === "Improve Scene Transition")).toBe(true);
  });

  it("adds a dialogue task when the story has few quote marks", () => {
    const tasks = generateRevisionPlan("A story without much dialogue here.");
    expect(tasks.some((t) => t.category === "Dialogue")).toBe(true);
  });

  it("does not add a dialogue task when the story has enough quotes", () => {
    const story = '"Hello," she said. "Goodbye," he replied. "Come back," she called. "Wait for me," he shouted. "I am coming," she answered.';
    const tasks = generateRevisionPlan(story);
    expect(tasks.some((t) => t.category === "Dialogue")).toBe(false);
  });

  it("marks every task as incomplete by default", () => {
    const tasks = generateRevisionPlan("A brand new story for testing.");
    for (const task of tasks) {
      expect(task.completed).toBe(false);
    }
  });
});
