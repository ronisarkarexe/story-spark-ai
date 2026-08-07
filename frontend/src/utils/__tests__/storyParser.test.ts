// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("storyParser utility", () => {
  it("returns empty nodes and links when content is empty", () => {
    const result = parseStory("");
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it("extracts location nodes when location words are present in text", () => {
    const text = "Deep inside the dark forest, there was a ancient castle.";
    const result = parseStory(text);

    const locationNodes = result.nodes.filter((n) => n.type === "location");
    expect(locationNodes.length).toBeGreaterThan(0);
    const names = locationNodes.map((n) => n.name.toLowerCase());
    expect(names).toContain("forest");
    expect(names).toContain("castle");
  });

  it("extracts character nodes for repeated capitalized names", () => {
    const text = "Arthur walked through the woods. Arthur looked up at the sky. Guinevere called out to Arthur.";
    const result = parseStory(text);

    const charNodes = result.nodes.filter((n) => n.type === "character");
    const names = charNodes.map((n) => n.name);
    expect(names).toContain("Arthur");
  });

  it("creates links between characters and nearby locations", () => {
    const text = "Arthur entered the castle and looked around.";
    const result = parseStory(text);

    expect(result.nodes.length).toBeGreaterThan(0);
    expect(result.links).toBeDefined();
  });

  it("tracks occurrence count for locations", () => {
    const text = "The city was peaceful. In the city, everyone was happy. The city prospered.";
    const result = parseStory(text);

    const cityNode = result.nodes.find((n) => n.name.toLowerCase() === "city");
    expect(cityNode).toBeDefined();
    if (cityNode) {
      expect(cityNode.occurrenceCount).toBe(3);
    }
  });
});
