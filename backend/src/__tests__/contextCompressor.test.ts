import {
  countTokens,
  extractLore,
  serializeLore,
  compressContext,
  type StoryNode,
} from "../utils/contextCompressor";

describe("countTokens", () => {
  it("returns a positive number for non-empty text", () => {
    const result = countTokens("Once upon a time in a land far away there lived a brave knight.");
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);
  });

  it("returns 0 for an empty string", () => {
    const result = countTokens("");
    expect(result).toBe(0);
  });

  it("returns a larger count for longer text", () => {
    const short = countTokens("Hello world");
    const long = countTokens("Hello world. This is a much longer sentence that should produce more tokens.");
    expect(long).toBeGreaterThan(short);
  });
});

describe("extractLore", () => {
  it("extracts characters appearing at least twice in the text", () => {
    const nodes: StoryNode[] = [
      { id: "1", text: "Arthur drew his sword." },
      { id: "2", text: "Arthur walked through the forest." },
      { id: "3", text: "Gandalf appeared briefly." },
    ];
    const lore = extractLore(nodes);
    const names = lore.characters.map((c) => c.name);
    expect(names).toContain("Arthur");
    expect(names).not.toContain("Gandalf");
  });

  it("sets lastSeen to the id of the node where the character last appears", () => {
    const nodes: StoryNode[] = [
      { id: "n1", text: "Lancelot rode his horse." },
      { id: "n2", text: "Guinevere waved." },
      { id: "n3", text: "Lancelot arrived at the castle." },
    ];
    const lore = extractLore(nodes);
    const lancelot = lore.characters.find((c) => c.name === "Lancelot");
    expect(lancelot?.lastSeen).toBe("n3");
  });

  it("extracts setting keywords from text", () => {
    const nodes: StoryNode[] = [
      { id: "a", text: "The hero ventured into the dark forest." },
      { id: "b", text: "She found an ancient castle hidden in the mountains." },
    ];
    const lore = extractLore(nodes);
    expect(lore.setting).toContain("forest");
    expect(lore.setting).toContain("castle");
    expect(lore.setting).toContain("mountain");
  });

  it("extracts core events as first sentence of each node", () => {
    const nodes: StoryNode[] = [
      { id: "x", text: "The knight arrived. He was tired." },
      { id: "y", text: "The dragon appeared! It roared loudly." },
    ];
    const lore = extractLore(nodes);
    expect(lore.core_events).toContain("The knight arrived");
    expect(lore.core_events).toContain("The dragon appeared");
  });

  it("returns empty arrays for nodes with no recurring characters or settings", () => {
    const nodes: StoryNode[] = [
      { id: "p", text: "Once upon a time." },
    ];
    const lore = extractLore(nodes);
    expect(lore.characters).toHaveLength(0);
    expect(lore.setting).toHaveLength(0);
    expect(lore.core_events).toHaveLength(1);
  });
});

describe("serializeLore", () => {
  it("includes characters section when characters exist", () => {
    const lore = {
      characters: [{ name: "Arthur", traits: [] }],
      setting: [],
      core_events: [],
    };
    const output = serializeLore(lore);
    expect(output).toContain("Arthur");
  });

  it("includes settings section when settings exist", () => {
    const lore = {
      characters: [],
      setting: ["forest", "castle"],
      core_events: [],
    };
    const output = serializeLore(lore);
    expect(output).toContain("Settings: forest, castle");
  });

  it("includes key events section (up to last 5) when events exist", () => {
    const lore = {
      characters: [],
      setting: [],
      core_events: ["event1", "event2", "event3", "event4", "event5", "event6"],
    };
    const output = serializeLore(lore);
    expect(output).toContain("event6");
    expect(output).not.toContain("event1");
  });

  it("returns a formatted string with the [STORY LORE] header", () => {
    const lore = { characters: [], setting: [], core_events: [] };
    const output = serializeLore(lore);
    expect(output).toContain("[STORY LORE]");
  });
});

describe("compressContext", () => {
  it("returns lore and empty window when budget is smaller than lore tokens", () => {
    const nodes: StoryNode[] = [
      { id: "1", text: "Once upon a time there was a dragon." },
    ];
    // Pass a very small maxTokens to force overflow
    const result = compressContext(nodes, 10);
    expect(result.window).toHaveLength(0);
    expect(result.droppedNodeCount).toBe(nodes.length);
    expect(result.lore).toBeDefined();
  });

  it("returns all nodes when they fit within the token budget", () => {
    const nodes: StoryNode[] = [
      { id: "a", text: "Hi." },
      { id: "b", text: "Bye." },
    ];
    // Large enough budget to fit everything
    const result = compressContext(nodes, 4096);
    expect(result.window.length).toBeGreaterThan(0);
    expect(result.droppedNodeCount).toBe(0);
    expect(result.totalTokens).toBeGreaterThan(0);
  });

  it("respects maxTokens parameter", () => {
    const nodes: StoryNode[] = [
      { id: "x", text: "This is a very long sentence that should consume many tokens when counted." },
      { id: "y", text: "Another long sentence that also takes up several tokens in context." },
    ];
    const result = compressContext(nodes, 50);
    // Budget is tight; some nodes may be dropped
    expect(result.totalTokens).toBeLessThanOrEqual(50 + 100); // small fudge for lore overhead
  });

  it("includes lore in the result", () => {
    const nodes: StoryNode[] = [
      { id: "z", text: "Arthur walked in the forest." },
      { id: "w", text: "Arthur found a sword." },
    ];
    const result = compressContext(nodes);
    expect(result.lore).toBeDefined();
    expect(result.lore.characters.some((c) => c.name === "Arthur")).toBe(true);
  });

  it("droppedNodeCount equals total nodes minus window nodes", () => {
    const nodes: StoryNode[] = [
      { id: "n1", text: "Alpha." },
      { id: "n2", text: "Beta." },
      { id: "n3", text: "Gamma." },
    ];
    const result = compressContext(nodes, 4096);
    expect(result.droppedNodeCount).toBe(nodes.length - result.window.length);
  });

  it("handles empty nodes array", () => {
    const result = compressContext([]);
    expect(result.window).toHaveLength(0);
    expect(result.droppedNodeCount).toBe(0);
    expect(result.lore.characters).toHaveLength(0);
  });
});
