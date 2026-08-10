import { describe, it, expect } from "vitest";
import { analyzeEmotionJourney } from "../emotionAnalyzer";

describe("analyzeEmotionJourney", () => {
  it("returns an empty array for empty string", () => {
    const result = analyzeEmotionJourney("");
    expect(result).toEqual([]);
  });

  it("returns an empty array for whitespace-only string", () => {
    const result = analyzeEmotionJourney("   \n\t\n  ");
    expect(result).toEqual([]);
  });

  it("returns one EmotionPoint per scene separated by blank lines", () => {
    const story = "Alice was happy and smiling.\n\nBob was afraid of the dark.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(2);
    expect(result[0].scene).toBe(1);
    expect(result[1].scene).toBe(2);
  });

  it("detects joy keywords correctly", () => {
    const story = "She was happy and smiling at the sunrise.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    expect(result[0].joy).toBeGreaterThan(0);
    expect(result[0].fear).toBe(0);
  });

  it("detects fear keywords correctly", () => {
    const story = "The dark forest was terrifying.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    expect(result[0].fear).toBeGreaterThan(0);
    expect(result[0].joy).toBe(0);
  });

  it("detects sadness keywords correctly", () => {
    const story = "He felt sad and lonely after the loss.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    expect(result[0].sadness).toBeGreaterThan(0);
  });

  it("detects anger keywords correctly", () => {
    const story = "She was angry and furious at the unfairness.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    expect(result[0].anger).toBeGreaterThan(0);
  });

  it("detects hope keywords correctly", () => {
    const story = "She believed in her dream for the future.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    expect(result[0].hope).toBeGreaterThan(0);
  });

  it("detects suspense keywords correctly", () => {
    const story = "Suddenly a mystery appeared from the unknown.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    expect(result[0].suspense).toBeGreaterThan(0);
  });

  it("scene indices are 1-based", () => {
    const story = "Scene one.\n\nScene two.\n\nScene three.";
    const result = analyzeEmotionJourney(story);
    expect(result[0].scene).toBe(1);
    expect(result[1].scene).toBe(2);
    expect(result[2].scene).toBe(3);
  });

  it("each EmotionPoint has all emotion fields", () => {
    const story = "A normal scene.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    const point = result[0];
    expect(typeof point.scene).toBe("number");
    expect(typeof point.joy).toBe("number");
    expect(typeof point.fear).toBe("number");
    expect(typeof point.sadness).toBe("number");
    expect(typeof point.anger).toBe("number");
    expect(typeof point.hope).toBe("number");
    expect(typeof point.suspense).toBe("number");
  });

  it("multiple keywords in one scene are counted separately", () => {
    // Uses keywords that match the regex patterns: happy, smile, laugh, celebrate
    const story = "She was happy, she smiled, and they celebrated with laughter.";
    const result = analyzeEmotionJourney(story);
    expect(result.length).toBe(1);
    // happy + smile + celebrate = 3 joy matches
    expect(result[0].joy).toBeGreaterThanOrEqual(3);
  });
});
