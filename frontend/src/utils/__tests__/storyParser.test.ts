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
  });
});
