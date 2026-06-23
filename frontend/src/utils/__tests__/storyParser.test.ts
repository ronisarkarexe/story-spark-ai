/* eslint-disable */
import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("storyParser", () => {
  describe("parseStory", () => {
    it("returns empty nodes and links for empty content", () => {
      const result = parseStory("");
      expect(result.nodes).toEqual([]);
      expect(result.links).toEqual([]);
    });

    it("detects locations from story content", () => {
      const content = "The hero walked through the forest and entered the castle.";
      const result = parseStory(content);

      const locations = result.nodes.filter(n => n.type === "location");
      expect(locations.length).toBeGreaterThan(0);
      const forestNode = locations.find(n => n.id === "loc_forest");
      expect(forestNode).toBeDefined();
      expect(forestNode!.name).toBe("Forest");

      const castleNode = locations.find(n => n.id === "loc_castle");
      expect(castleNode).toBeDefined();
      expect(castleNode!.name).toBe("Castle");
    });

    it("extracts character names that appear multiple times", () => {
      const content =
        "Arthur was a brave knight. Arthur traveled far. " +
        "Arthur met Merlin in the castle.";
      const result = parseStory(content);

      const characters = result.nodes.filter(n => n.type === "character");
      expect(characters.length).toBeGreaterThan(0);
      const arthurNode = characters.find(n => n.name === "Arthur");
      expect(arthurNode).toBeDefined();
    });

    it("skips single-occurrence capitalised words", () => {
      const content = "Alice walked into the room. The room was dark.";
      const result = parseStory(content);

      const characters = result.nodes.filter(n => n.type === "character");
      const alice = characters.find(n => n.name === "Alice");
      expect(alice).toBeUndefined();
    });

    it("skips words in SKIP_WORDS list", () => {
      const content = "The hero went to the castle. He was brave.";
      const result = parseStory(content);

      const characters = result.nodes.filter(n => n.type === "character");
      const he = characters.find(n => n.name === "He");
      const the = characters.find(n => n.name === "The");
      expect(he).toBeUndefined();
      expect(the).toBeUndefined();
    });

    it("creates links between consecutive locations", () => {
      const content = "The hero left the forest and entered the castle. " +
        "Then he journeyed to the city.";
      const result = parseStory(content);

      const locations = result.nodes.filter(n => n.type === "location");
      expect(locations.length).toBeGreaterThan(0);

      // Links should connect consecutive locations
      const links = result.links;
      expect(links.length).toBeGreaterThan(0);
    });

    it("creates links between characters and nearby locations", () => {
      // Use a character that appears within 200 chars of a location
      const content =
        "Merlin appeared in the castle. The castle was ancient. " +
        "Merlin studied its stones. The ancient castle held secrets.";
      const result = parseStory(content);

      const characters = result.nodes.filter(n => n.type === "character");
      const merlin = characters.find(n => n.name === "Merlin");
      expect(merlin).toBeDefined();

      const locations = result.nodes.filter(n => n.type === "location");
      expect(locations.length).toBeGreaterThan(0);

      const characterLinks = result.links.filter(l => l.source.startsWith("char_"));
      expect(characterLinks.length).toBeGreaterThan(0);
    });

    it("limits characters to 6", () => {
      const content =
        "Alice Bob Carol Dave Eve Frank George Henry Ida." +
        " Alice Bob Carol Dave Eve Frank. Alice Bob Carol.";
      const result = parseStory(content);

      const characters = result.nodes.filter(n => n.type === "character");
      expect(characters.length).toBeLessThanOrEqual(6);
    });

    it("handles content with no locations or characters", () => {
      const content = "The quick brown fox jumps over the lazy dog.";
      const result = parseStory(content);
      expect(result.nodes).toEqual([]);
      expect(result.links).toEqual([]);
    });

    it("returns IStoryGraph with nodes and links arrays", () => {
      const result = parseStory("The forest is dark.");
      expect(result).toHaveProperty("nodes");
      expect(result).toHaveProperty("links");
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });
  });
});
