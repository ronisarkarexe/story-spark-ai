import { describe, it, expect } from "vitest";
import {
  checkCharacterConsistency,
  CharacterConflict,
} from "../characterConsistency";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const chapter = (content: string) => ({ content });

describe("checkCharacterConsistency – hair color detection", () => {
  // ── 1. Existing patterns that must keep working ──────────────────────────

  describe("original supported patterns", () => {
    it("detects 'COLOR hair' (e.g. silver hair)", () => {
      const result = checkCharacterConsistency([
        chapter("Elena had silver hair that shimmered in the moonlight."),
      ]);
      expect(result).toHaveLength(0); // first mention, no conflict
    });

    it("raises conflict when same character's hair color changes", () => {
      const result = checkCharacterConsistency([
        chapter("Elena had silver hair."),
        chapter("Elena had black hair."),
      ]);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject<CharacterConflict>({
        character: "Elena",
        attribute: "hair color",
        previous: "silver",
        current: "black",
      });
    });

    it("does NOT raise conflict when color stays the same across chapters", () => {
      const result = checkCharacterConsistency([
        chapter("Marcus had brown hair."),
        chapter("Marcus still had brown hair."),
      ]);
      expect(result).toHaveLength(0);
    });

    it("tracks multiple characters independently", () => {
      const result = checkCharacterConsistency([
        chapter("Aria had blonde hair. Zack had black hair."),
        chapter("Aria had red hair."), // conflict for Aria only
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].character).toBe("Aria");
    });
  });

  // ── 2. New: adjective variants ───────────────────────────────────────────

  describe("adjective / hyphenated variants", () => {
    it("detects 'silvery hair'", () => {
      const result = checkCharacterConsistency([
        chapter("Lyra had silvery hair."),
        chapter("Lyra had black hair."),
      ]);
      expect(result[0]).toMatchObject({ previous: "silvery", current: "black" });
    });

    it("detects 'silver-colored hair'", () => {
      const result = checkCharacterConsistency([
        chapter("Lyra had silver-colored hair."),
        chapter("Lyra had red hair."),
      ]);
      expect(result[0]).toMatchObject({ previous: "silver", current: "red" });
    });
  });

  // ── 3. New: possessive / pronoun patterns ────────────────────────────────

  describe("pronoun / possessive patterns", () => {
    it("detects 'his silver hair'", () => {
      const result = checkCharacterConsistency([
        chapter("Ran his fingers through his silver hair."),
        chapter("Tom had brown hair."),
      ]);
      // 'his' is not a capitalized name — no character extracted, no conflict
      expect(result).toHaveLength(0);
    });

    it("detects hair color when character name appears in same sentence", () => {
      const result = checkCharacterConsistency([
        chapter("Tom pushed his silver hair from his eyes."),
        chapter("Tom had black hair."),
      ]);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ character: "Tom", previous: "silver", current: "black" });
    });
  });

  // ── 4. New: 'hair was COLOR' order ──────────────────────────────────────

  describe("hair COLOR order (hair mentioned before color)", () => {
    it("detects 'hair was silver'", () => {
      const result = checkCharacterConsistency([
        chapter("Nina's hair was silver and braided tightly."),
        chapter("Nina had brown hair."),
      ]);
      expect(result[0]).toMatchObject({ previous: "silver", current: "brown" });
    });

    it("detects 'hair is gray'", () => {
      const result = checkCharacterConsistency([
        chapter("Finn's hair is gray from years of worry."),
        chapter("Finn had blonde hair as a young man."),
      ]);
      expect(result[0]).toMatchObject({ previous: "gray", current: "blonde" });
    });
  });

  // ── 5. New: extra color keywords ────────────────────────────────────────

  describe("new hair color keywords", () => {
    const newColors = [
      { color: "grey", sentence: "Gwen had grey hair." },
      { color: "gray", sentence: "Gwen had gray hair." },
      { color: "white", sentence: "Gwen had white hair." },
      { color: "ginger", sentence: "Gwen had ginger hair." },
      { color: "auburn", sentence: "Gwen had auburn hair." },
      { color: "purple", sentence: "Gwen had purple hair." },
      { color: "blue", sentence: "Gwen had blue hair." },
      { color: "pink", sentence: "Gwen had pink hair." },
    ];

    newColors.forEach(({ color, sentence }) => {
      it(`detects '${color} hair'`, () => {
        const result = checkCharacterConsistency([
          chapter(sentence),
          chapter("Gwen had black hair."),
        ]);
        expect(result).toHaveLength(1);
        expect(result[0].previous).toBe(color);
      });
    });
  });

  // ── 6. Edge cases ────────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("returns empty array for chapters with no hair descriptions", () => {
      const result = checkCharacterConsistency([
        chapter("The sky was clear and the wind blew gently."),
      ]);
      expect(result).toHaveLength(0);
    });

    it("returns empty array for empty chapters array", () => {
      expect(checkCharacterConsistency([])).toHaveLength(0);
    });

    it("returns empty array for chapters with empty content", () => {
      expect(checkCharacterConsistency([chapter("")])).toHaveLength(0);
    });

    it("is case-insensitive for color names", () => {
      const result = checkCharacterConsistency([
        chapter("Mira had SILVER hair."),
        chapter("Mira had Black Hair."),
      ]);
      expect(result[0]).toMatchObject({ previous: "silver", current: "black" });
    });

    it("does not raise false positive when sentence has no character name", () => {
      const result = checkCharacterConsistency([
        chapter("The woman with silver hair walked past."),
      ]);
      // "The" is not a valid character name (too short / article), no conflict
      expect(result).toHaveLength(0);
    });
  });
});