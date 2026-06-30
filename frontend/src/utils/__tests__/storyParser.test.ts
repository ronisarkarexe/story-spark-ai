/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("parseStory", () => {
  it("returns empty nodes and links for empty string", () => {
    const result = parseStory("");
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it("extracts known locations from story content", () => {
    const content = "The hero walked through a dark forest toward the ancient castle.";
    const result = parseStory(content);

    const locationNodes = result.nodes.filter((n) => n.type === "location");
    expect(locationNodes.length).toBeGreaterThanOrEqual(2);

    const forestNode = locationNodes.find((n) => n.name === "Forest");
    expect(forestNode).toBeDefined();
    expect(forestNode?.occurrenceCount).toBeGreaterThanOrEqual(1);

    const castleNode = locationNodes.find((n) => n.name === "Castle");
    expect(castleNode).toBeDefined();
  });

  it("extracts character names that appear multiple times", () => {
    const content =
      "Alice walked into the forest. Alice felt brave. Alice met Bob in the castle.";
    const result = parseStory(content);

    const characterNodes = result.nodes.filter((n) => n.type === "character");
    expect(characterNodes.length).toBeGreaterThanOrEqual(2);

    const aliceNode = characterNodes.find((n) => n.name === "Alice");
    expect(aliceNode).toBeDefined();
  });

  it("does not classify skip words as characters", () => {
    const content = "The hero walked through the forest. He was brave.";
    const result = parseStory(content);

    const characterNodes = result.nodes.filter((n) => n.type === "character");
    const skipWords = ["He", "She", "They", "The", "It", "His", "Her"];
    const skipCharNodes = characterNodes.filter((n) =>
      skipWords.includes(n.name)
    );
    expect(skipCharNodes).toHaveLength(0);
  });

  it("links characters to nearby locations", () => {
    const content =
      "Alice walked through the forest toward the castle. She was determined. Alice was brave.";
    const result = parseStory(content);

    const charLinks = result.links.filter((l) =>
      l.source.startsWith("char_")
    );
    expect(charLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("links consecutive locations", () => {
    const content = "The hero traveled from the forest to the castle then to the city.";
    const result = parseStory(content);

    const locationNodes = result.nodes.filter((n) => n.type === "location");
    const locLinks = result.links.filter((l) =>
      l.source.startsWith("loc_") && l.target.startsWith("loc_")
    );
    expect(locLinks.length).toBeGreaterThanOrEqual(2);
  });

  it("tracks occurrenceCount for locations appearing multiple times", () => {
    const content =
      "The forest was dark. She left the forest. Back in the forest again.";
    const result = parseStory(content);

    const forestNode = result.nodes.find(
      (n) => n.name === "Forest" && n.type === "location"
    );
    expect(forestNode).toBeDefined();
    expect(forestNode?.occurrenceCount).toBeGreaterThanOrEqual(3);
  });

  it("returns a valid IStoryGraph structure", () => {
    const result = parseStory("A short story.");
    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("links");
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(Array.isArray(result.links)).toBe(true);
  });
});
