import {
  generateContinuationSuggestions,
  regenerateContinuationSuggestions,
  ContinuationSuggestion,
} from "../storyContinuationSuggestions";

describe("generateContinuationSuggestions", () => {
  it("returns empty array for empty string", () => {
    expect(generateContinuationSuggestions("")).toEqual([]);
  });

  it("returns empty array for whitespace-only input", () => {
    expect(generateContinuationSuggestions("   \n\t  ")).toEqual([]);
  });

  it("returns an array of ContinuationSuggestion objects", () => {
    const result = generateContinuationSuggestions("A hero begins a journey.");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s: ContinuationSuggestion) => {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("title");
      expect(s).toHaveProperty("content");
    });
  });

  it("returns suggestions with non-empty id, title, and content", () => {
    const result = generateContinuationSuggestions("The dragon terrorized the village.");
    result.forEach((s: ContinuationSuggestion) => {
      expect(typeof s.id).toBe("number");
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.content.length).toBeGreaterThan(0);
    });
  });

  it("returns suggestions with unique IDs", () => {
    const result = generateContinuationSuggestions("An epic tale unfolds.");
    const ids = result.map((s: ContinuationSuggestion) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe("regenerateContinuationSuggestions", () => {
  it("returns empty array for empty string", () => {
    expect(regenerateContinuationSuggestions("")).toEqual([]);
  });

  it("returns non-empty array for valid story input", () => {
    const result = regenerateContinuationSuggestions("A hero sets out on an adventure.");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns same structure as generateContinuationSuggestions", () => {
    const story = "The knight embarks on a quest.";
    const result = regenerateContinuationSuggestions(story);
    result.forEach((s: ContinuationSuggestion) => {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("title");
      expect(s).toHaveProperty("content");
    });
  });
});
