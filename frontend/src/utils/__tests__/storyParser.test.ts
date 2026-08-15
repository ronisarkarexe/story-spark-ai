import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("parseStory", () => {
  it("returns empty nodes and links for empty input", () => {
    const result = parseStory("");
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it("returns no locations or characters for whitespace-only input", () => {
    const result = parseStory("   \n  ");
    expect(result.nodes.filter((n) => n.type === "location")).toHaveLength(0);
    expect(result.nodes.filter((n) => n.type === "character")).toHaveLength(0);
  });

  it("detects known locations (castle, forest, city)", () => {
    const story = "The knight rode from the castle, through the deep forest, and into the busy city.";
    const result = parseStory(story);
    const locationNames = result.nodes
      .filter((n) => n.type === "location")
      .map((n) => n.name);
    expect(locationNames).toContain("Castle");
    expect(locationNames).toContain("Forest");
    expect(locationNames).toContain("City");
  });

  it("assigns location nodes an id prefixed with loc_", () => {
    const result = parseStory("She walked into the castle.");
    const locations = result.nodes.filter((n) => n.type === "location");
    for (const loc of locations) {
      expect(loc.id.startsWith("loc_")).toBe(true);
    }
  });

  it("location nodes include occurrenceCount", () => {
    const result = parseStory("castle castle castle");
    const castle = result.nodes.find(
      (n) => n.type === "location" && n.name === "Castle"
    );
    expect(castle).toBeDefined();
    expect(typeof castle!.occurrenceCount).toBe("number");
    expect(castle!.occurrenceCount).toBeGreaterThanOrEqual(3);
  });

  it("detects repeated capitalized words as characters", () => {
    const result = parseStory("Elena entered the castle. Elena was brave. Elena smiled.");
    const elena = result.nodes.find(
      (n) => n.type === "character" && n.name === "Elena"
    );
    expect(elena).toBeDefined();
    expect(elena!.id.startsWith("char_")).toBe(true);
  });

  it("does not treat common stop words as characters", () => {
    const result = parseStory("The He She They went to the castle.");
    const characterNames = result.nodes
      .filter((n) => n.type === "character")
      .map((n) => n.name);
    expect(characterNames).not.toContain("The");
    expect(characterNames).not.toContain("He");
    expect(characterNames).not.toContain("She");
  });

  it("every node has id, name, type, and excerpt", () => {
    const result = parseStory("Elena entered the castle. Elena was brave.");
    for (const node of result.nodes) {
      expect(typeof node.id).toBe("string");
      expect(node.id.length).toBeGreaterThan(0);
      expect(typeof node.name).toBe("string");
      expect(["location", "character"]).toContain(node.type);
      expect(typeof node.excerpt).toBe("string");
      expect(node.excerpt.length).toBeGreaterThan(0);
    }
  });

  it("location excerpts are wrapped with ellipses", () => {
    const result = parseStory("She walked into the castle.");
    const castle = result.nodes.find(
      (n) => n.type === "location" && n.name === "Castle"
    );
    expect(castle).toBeDefined();
    expect(castle!.excerpt.startsWith("...")).toBe(true);
    expect(castle!.excerpt.endsWith("...")).toBe(true);
  });

  it("creates links between a character and nearby locations", () => {
    const result = parseStory("Elena entered the castle. Elena was brave.");
    const charId = "char_Elena";
    const locId = "loc_castle";
    const hasLink = result.links.some(
      (l) =>
        (l.source === charId && l.target === locId) ||
        (l.source === locId && l.target === charId)
    );
    expect(hasLink).toBe(true);
  });

  it("links have string source and target properties", () => {
    const result = parseStory("Elena entered the castle. Elena was brave.");
    expect(result.links.length).toBeGreaterThan(0);
    for (const link of result.links) {
      expect(typeof link.source).toBe("string");
      expect(typeof link.target).toBe("string");
    }
  });

  it("connects consecutive locations", () => {
    const result = parseStory("castle forest city");
    const locations = result.nodes.filter((n) => n.type === "location");
    if (locations.length >= 2) {
      // At least one link should connect two location ids
      const locLinks = result.links.filter(
        (l) => l.source.startsWith("loc_") && l.target.startsWith("loc_")
      );
      expect(locLinks.length).toBeGreaterThan(0);
    }
  });

  it("limits characters to at most 6", () => {
    const story =
      "Alice went home. Alice smiled. Bob went home. Bob smiled. Carol went home. Carol smiled. " +
      "Dave went home. Dave smiled. Eve went home. Eve smiled. Frank went home. Frank smiled. Grace went home. Grace smiled.";
    const result = parseStory(story);
    const characters = result.nodes.filter((n) => n.type === "character");
    expect(characters.length).toBeLessThanOrEqual(6);
  });

  it("is deterministic for the same input", () => {
    const story = "Elena entered the castle. Elena was brave.";
    expect(parseStory(story)).toEqual(parseStory(story));
  });
});
