// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "./reading-time";

describe("calculateReadingTime", () => {
  it("returns 1 for undefined input", () => {
    expect(calculateReadingTime(undefined)).toBe(1);
  });

  it("returns 1 for empty string", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("returns 1 for whitespace-only string", () => {
    expect(calculateReadingTime("   ")).toBe(1);
    expect(calculateReadingTime("\n\t")).toBe(1);
  });

  it("returns 1 for a single word", () => {
    expect(calculateReadingTime("hello")).toBe(1);
  });

  it("returns 1 for content under 200 words", () => {
    // 199 words -> 1 minute
    const words = Array.from({ length: 199 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(1);
  });

  it("returns 2 for content at 200 words", () => {
    const words = Array.from({ length: 200 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("returns 2 for content between 201 and 400 words", () => {
    const words = Array.from({ length: 350 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("correctly calculates for long content", () => {
    // 1000 words -> ceil(1000/200) = 5 minutes
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(5);
  });

  it("uses ceiling for fractional results", () => {
    // 201 words -> ceil(201/200) = 2 minutes
    const words = Array.from({ length: 201 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });
});
