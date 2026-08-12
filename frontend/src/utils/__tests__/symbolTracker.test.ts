import { describe, it, expect } from "vitest";
import { analyzeSymbols } from "../symbolTracker";

describe("symbolTracker utility", () => {
  it("returns an array of symbol analysis results", () => {
    const result = analyzeSymbols("A story about a ring and the moon");
    expect(Array.isArray(result)).toBe(true);
  });

  it("only returns symbols with at least 1 occurrence", () => {
    const result = analyzeSymbols("A story with no tracked symbols");
    expect(result.length).toBe(0);
  });

  it("returns a symbol with status Resolved when occurrences > 1", () => {
    const result = analyzeSymbols("The ring is precious. The ring is golden. Find the ring.");
    const ringSymbol = result.find((s) => s.symbol === "ring");
    expect(ringSymbol).toBeDefined();
    expect(ringSymbol!.occurrences).toBe(3);
    expect(ringSymbol!.status).toBe("Resolved");
  });

  it("returns a symbol with status Unresolved when occurrences == 1", () => {
    const result = analyzeSymbols("The moon shone bright");
    const moonSymbol = result.find((s) => s.symbol === "moon");
    expect(moonSymbol).toBeDefined();
    expect(moonSymbol!.occurrences).toBe(1);
    expect(moonSymbol!.status).toBe("Unresolved");
  });

  it("handles an empty string input", () => {
    const result = analyzeSymbols("");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("handles case-insensitive matching", () => {
    const result = analyzeSymbols("The RING and the Ring and the ring");
    const ringSymbol = result.find((s) => s.symbol === "ring");
    expect(ringSymbol).toBeDefined();
    expect(ringSymbol!.occurrences).toBe(3);
  });

  it("includes expected properties on each result item", () => {
    const result = analyzeSymbols("A sword appeared");
    if (result.length > 0) {
      const symbol = result[0];
      expect(symbol).toHaveProperty("symbol");
      expect(symbol).toHaveProperty("occurrences");
      expect(symbol).toHaveProperty("status");
      expect(typeof symbol.symbol).toBe("string");
      expect(typeof symbol.occurrences).toBe("number");
      expect(["Resolved", "Unresolved"]).toContain(symbol.status);
    }
  });
});
