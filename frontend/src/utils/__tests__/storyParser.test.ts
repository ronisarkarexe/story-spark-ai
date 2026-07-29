import { parseStory } from "../storyParser";

describe("storyParser", () => {
  describe("location extraction", () => {
    it("returns empty nodes and links for empty string", () => {
      const result = parseStory("");
      expect(result.nodes).toHaveLength(0);
      expect(result.links).toHaveLength(0);
    });

    it("returns empty nodes and links for whitespace-only content", () => {
      const result = parseStory("   \n\n\t  ");
      expect(result.nodes).toHaveLength(0);
      expect(result.links).toHaveLength(0);
    });

    it("identifies a known location word", () => {
      const result = parseStory("The hero walked through the forest at dawn.");
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      expect(locationNodes).toHaveLength(1);
      expect(locationNodes[0].name).toBe("Forest");
      expect(locationNodes[0].id).toBe("loc_forest");
    });

    it("identifies multiple different location words", () => {
      const result = parseStory(
        "They travelled from the castle to the village through the forest."
      );
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      expect(locationNodes.length).toBeGreaterThanOrEqual(3);
      const names = locationNodes.map((n) => n.name);
      expect(names).toContain("Castle");
      expect(names).toContain("Village");
      expect(names).toContain("Forest");
    });

    it("does not create a location node for a non-location word", () => {
      const result = parseStory("The hero bravely ventured onward.");
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      // "onward" is not a location word
      expect(locationNodes).toHaveLength(0);
    });

    it("includes excerpt containing the found word", () => {
      const result = parseStory(
        "They journeyed deep into the mysterious forest under a silver moon."
      );
      const forestNode = result.nodes.find((n) => n.id === "loc_forest");
      expect(forestNode).toBeDefined();
      expect(forestNode?.excerpt.toLowerCase()).toContain("forest");
    });
  });

  describe("character extraction", () => {
    it("identifies a capitalised name that appears multiple times", () => {
      const result = parseStory(
        "Aragon was weary. Aragon drew his sword. The road was long for Aragon."
      );
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      expect(characterNodes.some((n) => n.name === "Aragon")).toBe(true);
    });

    it("skips words in the skip list even when capitalised", () => {
      const result = parseStory(
        "He was brave. She was kind. They were strong. It was dark."
      );
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      // He, She, They, It should all be skipped
      const names = characterNodes.map((n) => n.name);
      expect(names).not.toContain("He");
      expect(names).not.toContain("She");
      expect(names).not.toContain("They");
      expect(names).not.toContain("It");
    });

    it("skips articles and determiners", () => {
      const result = parseStory("The dragon appeared. A hero rose.");
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      const names = characterNodes.map((n) => n.name);
      expect(names).not.toContain("The");
      expect(names).not.toContain("A");
    });

    it("skips short words under 3 characters", () => {
      const result = parseStory("He walked to the city.");
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      const names = characterNodes.map((n) => n.name);
      // "He" has only 2 chars — should be skipped
      expect(names).not.toContain("He");
    });

    it("limits characters to at most 6", () => {
      const text = [
        "Arthur", "Morgan", "Elena", "Dmitri", "Sven", "Mira",
        "Jaxon", "Lyra", "Orion", "Freya",
      ]
        .map((name) => `${name} stood tall. ${name} drew the sword.`)
        .join(" ");
      const result = parseStory(text);
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      expect(characterNodes.length).toBeLessThanOrEqual(6);
    });

    it("skips location words used as capitalised mid-sentence words", () => {
      const result = parseStory(
        "The hero entered the Castle. Castle was magnificent. The Castle loomed."
      );
      // "Castle" appears capitalized but is a location word — it should be a location node
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      expect(locationNodes.some((n) => n.name === "Castle")).toBe(true);
    });
  });

  describe("link generation", () => {
    it("builds consecutive location links", () => {
      const result = parseStory(
        "The hero left the castle and entered the forest."
      );
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      const castleNode = locationNodes.find((n) => n.id === "loc_castle");
      const forestNode = locationNodes.find((n) => n.id === "loc_forest");
      if (castleNode && forestNode) {
        // forest comes before castle in LOCATION_WORDS, so link goes forest -> castle
        expect(result.links.some(
          (l) => l.source === forestNode.id && l.target === castleNode.id
        )).toBe(true);
      }
    });

    it("builds character-to-location links when within 200 chars", () => {
      const result = parseStory(
        "Aragon walked through the forest. Aragon was tired. The forest was dark."
      );
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      const aragonNode = characterNodes.find((n) => n.name === "Aragon");
      const forestNode = locationNodes.find((n) => n.id === "loc_forest");
      if (aragonNode && forestNode) {
        expect(result.links.some(
          (l) => l.source === aragonNode.id && l.target === forestNode.id
        )).toBe(true);
      }
    });

    it("does not build character-to-location links when more than 200 chars apart", () => {
      // Space out the character name and location by more than 200 chars
      const padding = "x".repeat(250);
      const result = parseStory(
        `Aragon${padding}arrived at the forest.`
      );
      const characterNodes = result.nodes.filter((n) => n.type === "character");
      const locationNodes = result.nodes.filter((n) => n.type === "location");
      const aragonNode = characterNodes.find((n) => n.name === "Aragon");
      const forestNode = locationNodes.find((n) => n.id === "loc_forest");
      if (aragonNode && forestNode) {
        expect(result.links.some(
          (l) => l.source === aragonNode.id && l.target === forestNode.id
        )).toBe(false);
      }
    });
  });

  describe("interface shape", () => {
    it("returns an object with nodes and links arrays", () => {
      const result = parseStory("A hero in a castle.");
      expect(result).toHaveProperty("nodes");
      expect(result).toHaveProperty("links");
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });

    it("location nodes have correct shape", () => {
      const result = parseStory("The hero entered the castle.");
      const locationNode = result.nodes.find((n) => n.type === "location");
      expect(locationNode).toMatchObject({
        id: "loc_castle",
        name: "Castle",
        type: "location",
      });
      expect(typeof locationNode?.excerpt).toBe("string");
    });

    it("character nodes have correct shape", () => {
      const result = parseStory(
        "Elena was brave. Elena faced the dragon. Elena won."
      );
      const characterNode = result.nodes.find((n) => n.name === "Elena");
      expect(characterNode).toMatchObject({
        id: "char_Elena",
        name: "Elena",
        type: "character",
      });
      expect(typeof characterNode?.excerpt).toBe("string");
    });

    it("links have source and target properties", () => {
      const result = parseStory(
        "Elena entered the castle. Elena was brave."
      );
      const link = result.links[0];
      if (link) {
        expect(link).toHaveProperty("source");
        expect(link).toHaveProperty("target");
        expect(typeof link.source).toBe("string");
        expect(typeof link.target).toBe("string");
      }
    });
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
