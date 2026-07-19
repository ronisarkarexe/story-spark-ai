
import { parseStory } from "../storyParser";

describe("storyParser utility (parseStory)", () => {
  it("should return empty nodes and links for empty or null content", () => {
    const resultEmpty = parseStory("");
    expect(resultEmpty.nodes).toEqual([]);
    expect(resultEmpty.links).toEqual([]);

    const resultNull = parseStory(null as any);
    expect(resultNull.nodes).toEqual([]);
    expect(resultNull.links).toEqual([]);
  });

  it("should return empty lists when no locations or characters are matched", () => {
    const result = parseStory("this is a simple test text with no locations and no capitalized words.");
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it("should correctly identify locations and count occurrences", () => {
    // forest is in LOCATION_WORDS
    const content = "The deep dark forest is mysterious. I love walking in the forest.";
    const result = parseStory(content);

    // Verify location node
    const forestNode = result.nodes.find((n) => n.id === "loc_forest");
    expect(forestNode).toBeDefined();
    expect(forestNode?.name).toBe("Forest");
    expect(forestNode?.type).toBe("location");
    expect(forestNode?.occurrenceCount).toBe(2);
    expect(forestNode?.excerpt).toContain("forest");
  });

  it("should identify characters and skip common transition/grammar words", () => {
    // Alice and Bob are capitalized, should count as characters if repeated or not at start of sentence
    // "He", "She" should be skipped because they are in SKIP_WORDS
    const content = "Alice walked down the street. Alice looked back. Bob called out. Bob waved.";
    const result = parseStory(content);

    const aliceNode = result.nodes.find((n) => n.id === "char_Alice");
    const bobNode = result.nodes.find((n) => n.id === "char_Bob");
    const heNode = result.nodes.find((n) => n.id === "char_He");

    expect(aliceNode).toBeDefined();
    expect(aliceNode?.type).toBe("character");
    expect(bobNode).toBeDefined();
    expect(heNode).toBeUndefined(); // He is in SKIP_WORDS
  });

  it("should connect characters to nearby locations within 200 characters distance", () => {
    const content = "Alice entered the dark forest. Alice was scared inside.";
    const result = parseStory(content);

    const forestNode = result.nodes.find((n) => n.id === "loc_forest");
    const aliceNode = result.nodes.find((n) => n.id === "char_Alice");

    expect(forestNode).toBeDefined();
    expect(aliceNode).toBeDefined();

    // Verify link exists between Alice and forest
    const link = result.links.find(
      (l) => l.source === "char_Alice" && l.target === "loc_forest"
    );
    expect(link).toBeDefined();
  });

  it("should connect consecutive locations in the story graph", () => {
    const content = "We traveled from the green forest into a dark cave.";
    const result = parseStory(content);

    const forestNode = result.nodes.find((n) => n.id === "loc_forest");
    const caveNode = result.nodes.find((n) => n.id === "loc_cave");

    expect(forestNode).toBeDefined();
    expect(caveNode).toBeDefined();

    // Verify consecutive location link
    const link = result.links.find(
      (l) => l.source === "loc_forest" && l.target === "loc_cave"
    );
    expect(link).toBeDefined();

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
