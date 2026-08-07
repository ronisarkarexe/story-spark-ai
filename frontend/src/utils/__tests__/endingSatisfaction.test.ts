import { describe, it, expect } from "vitest";
import { getEndingMetrics } from "../endingSatisfaction";

describe("getEndingMetrics", () => {
  it("returns a non-empty list of metrics", () => {
    const metrics = getEndingMetrics();
    expect(metrics.length).toBeGreaterThan(0);
  });

  it("returns metrics with the expected shape", () => {
    const metrics = getEndingMetrics();
    const metric = metrics[0];
    expect(metric).toHaveProperty("title");
    expect(metric).toHaveProperty("score");
    expect(metric).toHaveProperty("description");
    expect(metric).toHaveProperty("suggestion");
  });

  it("keeps scores within 0-100", () => {
    const metrics = getEndingMetrics();
    for (const metric of metrics) {
      expect(metric.score).toBeGreaterThanOrEqual(0);
      expect(metric.score).toBeLessThanOrEqual(100);
    }
  });

  it("includes a conflict-resolution metric", () => {
    const metrics = getEndingMetrics();
    expect(metrics.some((m) => m.title === "Conflict Resolution")).toBe(true);
  });

  it("includes a character-arc metric", () => {
    const metrics = getEndingMetrics();
    expect(metrics.some((m) => m.title === "Character Arc")).toBe(true);
  });

  it("provides a non-empty suggestion for every metric", () => {
    const metrics = getEndingMetrics();
    for (const metric of metrics) {
      expect(metric.suggestion.length).toBeGreaterThan(0);
    }
  });
});
