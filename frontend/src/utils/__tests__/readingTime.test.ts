import { getReadingTime } from "../readingTime";

describe("getReadingTime", () => {
  it("returns wordCount 0 and minutes 1 for empty string", () => {
    const result = getReadingTime("");
    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(1); // minimum floor
  });

  it("returns wordCount 1 and minutes 1 for a single word", () => {
    const result = getReadingTime("hello");
    expect(result.wordCount).toBe(1);
    expect(result.minutes).toBe(1);
  });

  it("returns wordCount 200 and minutes 1 for exactly 200 words", () => {
    const words = Array(200).fill("word").join(" ");
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(200);
    expect(result.minutes).toBe(1);
  });

  it("returns wordCount 400 and minutes 2 for 400 words", () => {
    const words = Array(400).fill("word").join(" ");
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(400);
    expect(result.minutes).toBe(2);
  });

  it("returns wordCount 220 and minutes 2 for 220 words (over 200)", () => {
    const words = Array(220).fill("word").join(" ");
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(220);
    expect(result.minutes).toBe(2);
  });

  it("handles whitespace-only string as having zero words", () => {
    const result = getReadingTime("     \t\n   ");
    expect(result.wordCount).toBe(0);
    expect(result.minutes).toBe(1); // minimum floor
  });

  it("counts words correctly with multiple spaces between words", () => {
    const result = getReadingTime("once  upon   a   time");
    expect(result.wordCount).toBe(4);
    expect(result.minutes).toBe(1);
  });

  it("returns an object with both minutes and wordCount properties", () => {
    const result = getReadingTime("a story begins here");
    expect(result).toHaveProperty("minutes");
    expect(result).toHaveProperty("wordCount");
    expect(typeof result.minutes).toBe("number");
    expect(typeof result.wordCount).toBe("number");
  });
});
