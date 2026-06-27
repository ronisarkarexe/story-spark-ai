import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("storyParser", () => {
  describe("parseStory", () => {
    it("empty string returns graph with empty nodes and links", () => {
      const result = parseStory("");
      expect(result.nodes).toEqual([]);
      expect(result.links).toEqual([]);
    });

    it("correctly identifies location words from LOCATION_WORDS list", () => {
      const content = "The hero entered the dark forest and found a hidden cave.";
      const result = parseStory(content);
      const locationNames = result.nodes
        .filter((n) => n.type === "location")
        .map((n) => n.name.toLowerCase());
      expect(locationNames).toContain("forest");
      expect(locationNames).toContain("cave");
    });

    it("correctly identifies repeated capitalised names as characters", () => {
      const content =
        "Aldric drew his sword. Aldric stepped forward. Then Aldric shouted.";
      const result = parseStory(content);
      const charNames = result.nodes
        .filter((n) => n.type === "character")
        .map((n) => n.name);
      expect(charNames).toContain("Aldric");
    });

    it("skips names in SKIP_WORDS (pronouns, articles, common verbs)", () => {
      const content =
        "He went to the market. She walked away. They said hello. It was dark.";
      const result = parseStory(content);
      const charNames = result.nodes
        .filter((n) => n.type === "character")
        .map((n) => n.name);
      expect(charNames).not.toContain("He");
      expect(charNames).not.toContain("She");
      expect(charNames).not.toContain("They");
      expect(charNames).not.toContain("The");
    });

    it("limits characters to 6 entries", () => {
      const names = [
        "Aldric", "Brom", "Cedric", "Doran", "Eldric", "Fenric", "Gareth",
      ];
      const content = names
        .map((name) => `${name} walked. ${name} spoke. ${name} rested.`)
        .join(" ");
      const result = parseStory(content);
      const characters = result.nodes.filter((n) => n.type === "character");
      expect(characters.length).toBeLessThanOrEqual(6);
    });

    it("builds character-to-location links when character and location appear within 200 chars", () => {
      const content =
        "Aldric ventured into the dark forest. Aldric found a hidden path.";
      const result = parseStory(content);
      const characterLinks = result.links.filter(
        (l) => l.source.startsWith("char_") && l.target.startsWith("loc_")
      );
      expect(characterLinks.length).toBeGreaterThan(0);
    });

    it("builds consecutive location links", () => {
      const content = "The castle stood near the forest. Beyond the forest lay a dark cave.";
      const result = parseStory(content);
      const locationLinks = result.links.filter(
        (l) => l.source.startsWith("loc_") && l.target.startsWith("loc_")
      );
      expect(locationLinks.length).toBeGreaterThan(0);
    });

    it("handles input with no locations", () => {
      const content = "Aldric walked. Aldric talked. Aldric rested.";
      const result = parseStory(content);
      const locations = result.nodes.filter((n) => n.type === "location");
      expect(locations.length).toBe(0);
    });

    it("handles input with only common words (no characters found)", () => {
      const content = "The cat sat on the mat. The dog ran in the park.";
      const result = parseStory(content);
      const characters = result.nodes.filter((n) => n.type === "character");
      expect(characters.length).toBe(0);
    });
  });
});
