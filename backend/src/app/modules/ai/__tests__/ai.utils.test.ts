import { z } from "zod";
import {
  safeParseAIResponse,
  parseAIResponseOrThrow,
  stripMarkdownCodeBlocks,
} from "../ai.utils";

const TestSchema = z.object({
  title: z.string().min(1),
  score: z.number().int().min(0).max(100),
});

type TestObject = z.infer<typeof TestSchema>;

const fallback: TestObject = { title: "Fallback", score: 0 };

describe("stripMarkdownCodeBlocks", () => {
  it("strips ```json code fences", () => {
    const raw = '```json\n{ "title": "A", "score": 10 }\n```';
    expect(stripMarkdownCodeBlocks(raw)).toBe('{ "title": "A", "score": 10 }');
  });

  it("strips plain ``` code fences", () => {
    const raw = '```\n{ "title": "A", "score": 10 }\n```';
    expect(stripMarkdownCodeBlocks(raw)).toBe('{ "title": "A", "score": 10 }');
  });

  it("returns already-clean text unchanged", () => {
    const raw = '{ "title": "A", "score": 10 }';
    expect(stripMarkdownCodeBlocks(raw)).toBe(raw);
  });

  it("does not alter text with only inline single backticks", () => {
    const raw = '`{ "title": "A", "score": 10 }`';
    // Inline single backticks are not valid markdown code blocks for JSON output.
    expect(stripMarkdownCodeBlocks(raw)).toBe(raw);
  });
});

describe("safeParseAIResponse", () => {
  it("returns validated object for clean JSON", () => {
    const raw = JSON.stringify({ title: "Hello", score: 75 });
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual({
      title: "Hello",
      score: 75,
    });
  });

  it("strips markdown fences before parsing", () => {
    const raw = '```json\n{ "title": "Hello", "score": 75 }\n```';
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual({
      title: "Hello",
      score: 75,
    });
  });

  it("recovers embedded JSON from surrounding text", () => {
    const raw = 'Here is your result:\n```json\n{ "title": "Hello", "score": 75 }\n```\nHope this helps!';
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual({
      title: "Hello",
      score: 75,
    });
  });

  it("returns fallback on truncated JSON", () => {
    const raw = '{ "title": "Hello", "score": ';
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual(fallback);
  });

  it("returns fallback when schema validation fails", () => {
    const raw = JSON.stringify({ title: "Hello", score: 999 });
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual(fallback);
  });

  it("returns fallback when object has unexpected keys but still fails required validation", () => {
    const raw = JSON.stringify({ title: "", score: 50 });
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual(fallback);
  });

  it("returns fallback on completely invalid input", () => {
    const raw = "not json at all";
    expect(safeParseAIResponse(raw, TestSchema, fallback)).toEqual(fallback);
  });

  it("validates arrays when schema is an array", () => {
    const arraySchema = z.array(z.string().min(1));
    const raw = '["one", "two", "three"]';
    expect(safeParseAIResponse(raw, arraySchema, [])).toEqual([
      "one",
      "two",
      "three",
    ]);
  });
});

describe("parseAIResponseOrThrow", () => {
  it("returns validated object for valid JSON", () => {
    const raw = JSON.stringify({ title: "Hello", score: 75 });
    expect(parseAIResponseOrThrow(raw, TestSchema)).toEqual({
      title: "Hello",
      score: 75,
    });
  });

  it("throws when JSON is invalid", () => {
    const raw = "not json";
    expect(() => parseAIResponseOrThrow(raw, TestSchema)).toThrow(
      "AI returned invalid JSON"
    );
  });

  it("throws with custom error message when provided", () => {
    const raw = "not json";
    expect(() =>
      parseAIResponseOrThrow(raw, TestSchema, {
        errorMessage: "Custom parse failure",
      })
    ).toThrow("Custom parse failure");
  });
});
