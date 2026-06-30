import { describe, it, expect } from "vitest";
import { parseStory } from "../storyParser";

describe("parseStory", () => {
  it("returns empty graph for empty content", () => {
    const result = parseStory("");
    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it("detects location words in content", () => {
    const content = "The hero entered the dark forest and saw a castle.";
    const result = parseStory(content);
    expect(result.nodes.some((n) => n.name === "Forest")).toBe(true);
    expect(result.nodes.some((n) => n.name === "Castle")).toBe(true);
  });

  it("detects character names that appear multiple times", () => {
    const content = "Arthur drew his sword. Arthur charged forward. Arthur defeated the beast.";
    const result = parseStory(content);
    expect(result.nodes.some((n) => n.name === "Arthur" && n.type === "character")).toBe(true);
  });

  it("skips common words like The, He, She", () => {
    const content = "The hero went to the forest. He walked. She followed.";
    const result = parseStory(content);
    const charNames = result.nodes.filter((n) => n.type === "character").map((n) => n.name);
    expect(charNames).not.toContain("The");
    expect(charNames).not.toContain("He");
    expect(charNames).not.toContain("She");
  });

  it("creates links between characters and nearby locations", () => {
    const content = "Elena entered the dark castle. Elena searched the throne room.";
    const result = parseStory(content);
    expect(result.links.length).toBeGreaterThan(0);
  });
});
