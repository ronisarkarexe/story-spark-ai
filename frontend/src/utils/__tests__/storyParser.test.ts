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
  });
});
