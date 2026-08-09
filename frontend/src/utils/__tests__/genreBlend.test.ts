import { describe, it, expect } from "vitest";
import { blendGenres, validateGenres, regenerateBlend } from "../genreBlend";
import {
  blendGenres,
  validateGenres,
  regenerateBlend,
  validatePromptLength,
  DEFAULT_MAX_PROMPT_LENGTH,
} from "../genreBlend";


describe("blendGenres", () => {
  it("returns selectedGenres and blendedPrompt unchanged", () => {
    const request = { genres: ["fantasy", "sci-fi"], prompt: "write a story" };
    const result = blendGenres(request);
    expect(result.selectedGenres).toEqual(["fantasy", "sci-fi"]);
    expect(result.blendedPrompt).toBe("write a story");
  });

  it("handles an empty genres array", () => {
    const request = { genres: [], prompt: "write a story" };
    const result = blendGenres(request);
    expect(result.selectedGenres).toEqual([]);
    expect(result.blendedPrompt).toBe("write a story");
  });

  it("preserves prompt whitespace and casing", () => {
    const request = { genres: ["horror"], prompt: "  A   Dark   Tale  " };
    const result = blendGenres(request);
    expect(result.blendedPrompt).toBe("  A   Dark   Tale  ");
  });

  it("returns correct shape with single genre", () => {
    const request = { genres: ["romance"], prompt: "a love story" };
    const result = blendGenres(request);
    expect(result).toHaveProperty("selectedGenres");
    expect(result).toHaveProperty("blendedPrompt");
    expect(Array.isArray(result.selectedGenres)).toBe(true);
    expect(typeof result.blendedPrompt).toBe("string");
  });
});

describe("validateGenres", () => {
  it("returns true for array with exactly 2 genres", () => {
    expect(validateGenres(["fantasy", "sci-fi"])).toBe(true);
  });

  it("returns true for array with more than 2 genres", () => {
    expect(validateGenres(["fantasy", "sci-fi", "horror", "romance"])).toBe(true);
  });

  it("returns false for empty array", () => {
    expect(validateGenres([])).toBe(false);
  });

  it("returns false for array with only 1 genre", () => {
    expect(validateGenres(["fantasy"])).toBe(false);
  });

  it("throws when given null input", () => {
    expect(() => validateGenres(null as unknown as string[])).toThrow();
  });

  it("throws when given undefined input", () => {
    expect(() => validateGenres(undefined as unknown as string[])).toThrow();
  });
});

describe("regenerateBlend", () => {
  it("returns the same shape as blendGenres", () => {
    const request = { genres: ["mystery", "thriller"], prompt: "solve the case" };
    const result = regenerateBlend(request);
    expect(result).toHaveProperty("selectedGenres");
    expect(result).toHaveProperty("blendedPrompt");
  });

  it("delegates to blendGenres for empty genres", () => {
    const request = { genres: [] as string[], prompt: "" };
    const result = regenerateBlend(request);
    expect(result.selectedGenres).toEqual([]);
    expect(result.blendedPrompt).toBe("");
  });

  it("preserves genres and prompt through regeneration", () => {
    const request = { genres: ["comedy", "drama"], prompt: "a funny drama" };
    const result = regenerateBlend(request);
    expect(result.selectedGenres).toEqual(request.genres);
    expect(result.blendedPrompt).toBe(request.prompt);
  });
});

describe("validatePromptLength", () => {
  it("returns true for prompt within default max length", () => {
    expect(validatePromptLength("a short prompt")).toBe(true);
  });

  it("returns true for prompt exactly at default max length", () => {
    const prompt = "a".repeat(DEFAULT_MAX_PROMPT_LENGTH);
    expect(validatePromptLength(prompt)).toBe(true);
  });

  it("returns false for prompt exceeding default max length", () => {
    const prompt = "a".repeat(DEFAULT_MAX_PROMPT_LENGTH + 1);
    expect(validatePromptLength(prompt)).toBe(false);
  });

  it("returns true for prompt within custom max length", () => {
    expect(validatePromptLength("short", 10)).toBe(true);
  });

  it("returns false for prompt exceeding custom max length", () => {
    expect(validatePromptLength("this is too long", 5)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(validatePromptLength("")).toBe(false);
  });

  it("returns false for null input", () => {
    expect(validatePromptLength(null as unknown as string)).toBe(false);
  });

  it("returns false for undefined input", () => {
    expect(validatePromptLength(undefined as unknown as string)).toBe(false);
  });

  it("handles prompt with multibyte characters correctly", () => {
    // Each multibyte char counts as one character in JS string.length
    const prompt = "\u4e2d\u6587".repeat(500); // 1000 characters
    expect(validatePromptLength(prompt, 2000)).toBe(true);
    expect(validatePromptLength(prompt, 500)).toBe(false);
  });
});
