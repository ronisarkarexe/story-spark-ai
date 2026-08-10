import { describe, it, expect } from "vitest";
import { analyzeNarrativeFlow } from "../narrativeFlowAnalyzer";

describe("analyzeNarrativeFlow - Suddenly detection", () => {
  it("detects capitalized 'Suddenly'", () => {
    const issues = analyzeNarrativeFlow("Suddenly, the door opened.");
    expect(
      issues.some((i) => i.type === "Abrupt Transition")
    ).toBe(true);
  });

  it("detects lowercase 'suddenly' (case-insensitive)", () => {
    const issues = analyzeNarrativeFlow("and then suddenly the lights went out.");
    expect(
      issues.some((i) => i.type === "Abrupt Transition")
    ).toBe(true);
  });

  it("detects uppercase 'SUDDENLY' (case-insensitive)", () => {
    const issues = analyzeNarrativeFlow("SUDDENLY everything changed.");
    expect(
      issues.some((i) => i.type === "Abrupt Transition")
    ).toBe(true);
  });

  it("does not flag text without 'suddenly'", () => {
    const issues = analyzeNarrativeFlow("The sun set slowly over the hills.");
    expect(
      issues.some((i) => i.type === "Abrupt Transition")
    ).toBe(false);
  });
});
