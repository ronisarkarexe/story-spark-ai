import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("parseStory", () => {
  // 1. Test empty string input (should return empty nodes and links)
  it("should return empty nodes and links for empty input", () => {
    const result = parseStory("");
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  // 2. Test known locations (should extract locations from story text)
  it("should detect known locations (castle, forest, city)", () => {
    const story = "The knight rode from the castle, through the deep forest, and into the busy city.";
    const result = parseStory(story);

    // Verify location nodes exist
    const locationNames = result.nodes
      .filter(node => node.type === "location")
      .map(node => node.name);

    expect(locationNames).toContain("Castle");
    expect(locationNames).toContain("Forest");
    expect(locationNames).toContain("City");

    // Verify occurrence count and IDs are correct
    const castleNode = result.nodes.find(node => node.id === "loc_castle");
    expect(castleNode).toBeDefined();
    expect(castleNode?.occurrenceCount).toBe(1);
    expect(castleNode?.excerpt).toContain("castle");
  });

  // 3. Test character detection (with names appearing multiple times)
  it("should detect characters who appear multiple times (Alice, Bob)", () => {
    const story = "Alice went to the park. Bob saw Alice. Bob waved at Alice and Bob smiled.";
    const result = parseStory(story);

    const characters = result.nodes.filter(node => node.type === "character");
    const characterNames = characters.map(node => node.name);

    expect(characterNames).toContain("Alice");
    expect(characterNames).toContain("Bob");

    // Verify excerpt content
    const aliceNode = result.nodes.find(node => node.id === "char_Alice");
    expect(aliceNode).toBeDefined();
    expect(aliceNode?.excerpt).toContain("Alice");
  });

  // 4. Test skip words (pronouns, common capitalized words should not be characters)
  it("should not count skip words as characters", () => {
    const story = "He went to the house. She went too. They saw it. The adventure started. Once upon a time.";
    const result = parseStory(story);

    const characterNames = result.nodes
      .filter(node => node.type === "character")
      .map(node => node.name);

    expect(characterNames).not.toContain("He");
    expect(characterNames).not.toContain("She");
    expect(characterNames).not.toContain("They");
    expect(characterNames).not.toContain("The");
    expect(characterNames).not.toContain("Once");
  });

  // 5. Test character occurrence filter (>= 2 validation vs sentence start)
  it("should filter out single-occurrence capitalized words that start sentences, but keep others", () => {
    // "Charlie" starts a sentence and only appears once -> should be filtered out
    // "Dave" appears once but does NOT start a sentence -> should be kept
    // "Edward" appears twice -> should be kept
    const story = "Charlie is very happy. The loyal servant Dave went to fetch water. Edward went out. Edward came back.";
    const result = parseStory(story);

    const characterNames = result.nodes
      .filter(node => node.type === "character")
      .map(node => node.name);

    expect(characterNames).not.toContain("Charlie");
    expect(characterNames).toContain("Dave");
    expect(characterNames).toContain("Edward");
  });

  // 6. Test character-to-location proximity linking
  it("should link characters to nearby locations within 200 characters", () => {
    // In this story, Alice is very close to castle (within 200 chars).
    // Bob is far away from castle (separated by a very long padding of words).
    const padding = "x ".repeat(150); // 300 characters padding
    const story = `Alice went to the castle. ${padding} Bob also exists.`;
    
    // We need both Alice and Bob to appear at least twice so they are detected as characters
    const fullStory = `${story} Alice saw Bob. Alice spoke to Bob.`;
    const result = parseStory(fullStory);

    // Verify we have a link from Alice to castle
    const aliceToCastleLink = result.links.find(
      link => link.source === "char_Alice" && link.target === "loc_castle"
    );
    expect(aliceToCastleLink).toBeDefined();

    // Verify we do NOT have a link from Bob to castle
    const bobToCastleLink = result.links.find(
      link => link.source === "char_Bob" && link.target === "loc_castle"
    );
    expect(bobToCastleLink).toBeUndefined();
  });

  // 7. Test consecutive location linking
  it("should link consecutive locations in order of discovery", () => {
    // Story contains forest and castle.
    // Since forest and castle are found, they should be linked sequentially.
    const story = "The path led through the forest to the castle.";
    const result = parseStory(story);

    const consecutiveLink = result.links.find(
      link => link.source === "loc_forest" && link.target === "loc_castle"
    );
    expect(consecutiveLink).toBeDefined();
  });
});
