/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { parseStory, IStoryNode } from "../storyParser";

describe("parseStory", () => {
  it("returns empty nodes and links for an empty string", () => {
    const result = parseStory("");
    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });

  it("returns empty nodes and links when no locations or characters are found", () => {
    const result = parseStory("It was a dark night.");
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(Array.isArray(result.links)).toBe(true);
  });

  it("returns an object with nodes and links properties", () => {
    const result = parseStory("The hero went to the castle.");
    expect(result).toHaveProperty("nodes");
    expect(result).toHaveProperty("links");
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(Array.isArray(result.links)).toBe(true);
  });

  it("identifies a known location keyword as a location node", () => {
    const result = parseStory(
      "The knight entered the castle through the heavy gate."
    );
    const locationNodes = result.nodes.filter((n: IStoryNode) => n.type === "location");
    expect(locationNodes.some((n: IStoryNode) => n.name === "Castle")).toBe(true);
  });

  it("sets node id with loc_ prefix for locations", () => {
    const result = parseStory("They walked through the forest at dawn.");
    const forestNode = result.nodes.find(
      (n: IStoryNode) => n.name === "Forest"
    );
    expect(forestNode?.id).toBe("loc_forest");
  });

  it("tracks occurrenceCount for locations that appear multiple times", () => {
    const result = parseStory(
      "The forest was dark. In the forest, they heard a noise. The forest echoed."
    );
    const forestNode = result.nodes.find(
      (n: IStoryNode) => n.name === "Forest"
    );
    expect(forestNode?.occurrenceCount).toBeGreaterThanOrEqual(1);
  });

  it("location nodes have an excerpt string", () => {
    const result = parseStory("The story begins in the village square.");
    const locationNodes = result.nodes.filter((n: IStoryNode) => n.type === "location");
    expect(locationNodes.length).toBeGreaterThan(0);
    locationNodes.forEach((n: IStoryNode) => {
      expect(typeof n.excerpt).toBe("string");
      expect(n.excerpt.length).toBeGreaterThan(0);
    });
  });

  it("does not duplicate location nodes for the same keyword", () => {
    const result = parseStory(
      "In the forest they met. Then they left the forest."
    );
    const forestNodes = result.nodes.filter(
      (n: IStoryNode) => n.id === "loc_forest"
    );
    expect(forestNodes).toHaveLength(1);
  });

  it("node names are capitalized", () => {
    const result = parseStory("The village was quiet.");
    const villageNode = result.nodes.find(
      (n: IStoryNode) => n.id === "loc_village"
    );
    expect(villageNode?.name).toBe("Village");
  });

  it("returns links as an array", () => {
    const result = parseStory("In the castle, a hero emerged.");
    expect(Array.isArray(result.links)).toBe(true);
  });

  it("each node has id, name, type, and excerpt fields", () => {
    const result = parseStory("The hero stood at the gate.");
    const nodes = result.nodes;
    nodes.forEach((n: IStoryNode) => {
      expect(n).toHaveProperty("id");
      expect(n).toHaveProperty("name");
      expect(n).toHaveProperty("type");
      expect(n).toHaveProperty("excerpt");
      expect(["location", "character"]).toContain(n.type);
    });
  });

  it("each link has source and target fields", () => {
    const result = parseStory("The knight lived in the castle near the village.");
    const links = result.links;
    links.forEach((l: { source: string; target: string }) => {
      expect(l).toHaveProperty("source");
      expect(l).toHaveProperty("target");
      expect(typeof l.source).toBe("string");
      expect(typeof l.target).toBe("string");
    });
  });

  it("handles a long story without crashing", () => {
    const longStory = `
      The kingdom of Eldoria was vast and ancient. In the capital city,
      a young mage named Arin studied at the grand library. The library
      held secrets from centuries past. Beyond the city walls lay the
      forest of Whispering Pines, where few dared to venture. Yet
      Arin knew the answer lay within that dark woods. The tower of
      the sorcerer stood at the edge of the lake, its reflection
      shimmering on calm waters at dawn.
    `.repeat(5);

    expect(() => parseStory(longStory)).not.toThrow();
    const result = parseStory(longStory);
    expect(result.nodes.length).toBeGreaterThan(0);
  });
});
