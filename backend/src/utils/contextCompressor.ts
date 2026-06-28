export interface ICompressedContext {
  characters: string[];
  keyEvents: string[];
  setting: string[];
  compressedText: string;
}

export function contextCompressor(fullStory: string): ICompressedContext {
  if (!fullStory) {
    return {
      characters: [],
      keyEvents: [],
      setting: [],
      compressedText: ""
    };
  }

  const sentences = fullStory.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

  const characters = new Set<string>();
  const keyEvents: string[] = [];
  const setting = new Set<string>();

  for (const sentence of sentences) {
    // simple heuristic: capitalized words = characters
    const words = sentence.split(" ");

    for (const w of words) {
      if (/^[A-Z][a-z]+$/.test(w)) {
        characters.add(w);
      }
    }

    // event detection (simple rule-based)
    if (
      sentence.includes("killed") ||
      sentence.includes("found") ||
      sentence.includes("discovered") ||
      sentence.includes("fought")
    ) {
      keyEvents.push(sentence);
    }

    // setting detection
    if (
      sentence.includes("forest") ||
      sentence.includes("castle") ||
      sentence.includes("city") ||
      sentence.includes("kingdom")
    ) {
      setting.add(sentence);
    }
  }

  return {
    characters: Array.from(characters),
    keyEvents,
    setting: Array.from(setting),
    compressedText: `
Characters: ${Array.from(characters).join(", ")}
Events: ${keyEvents.slice(0, 5).join(" | ")}
Settings: ${Array.from(setting).join(" | ")}
    `.trim()
  };
}

import { get_encoding } from "tiktoken";

export interface LorePayload {
  characters: CharacterEntry[];
  setting: string[];
  core_events: string[];
}

export interface CharacterEntry {
  name: string;
  traits: string[];
  lastSeen?: string;
}

export interface StoryNode {
  id: string;
  text: string;
  branchId?: string;
}

export interface CompressedContext {
  lore: LorePayload;
  window: StoryNode[];
  totalTokens: number;
  droppedNodeCount: number;
}

export function countTokens(text: string): number {
  try {
    const enc = get_encoding("cl100k_base");
    const tokens = enc.encode(text).length;
    enc.free();
    return tokens;
  } catch {
    return Math.ceil(text.split(/\s+/).length / 0.75);
  }
}

const CHARACTER_RE = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b/g;
const SETTING_KEYWORDS = [
  "forest", "castle", "city", "village", "mountain", "ocean",
  "realm", "kingdom", "dungeon", "tower", "market", "desert",
  "cave", "ship", "island",
];

export function extractLore(nodes: StoryNode[]): LorePayload {
  const nameFreq: Record<string, number> = {};
  const allText = nodes.map((n) => n.text).join(" ");

  CHARACTER_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CHARACTER_RE.exec(allText)) !== null) {
    const name = match[1];
    nameFreq[name] = (nameFreq[name] ?? 0) + 1;
  }

  const characters: CharacterEntry[] = Object.entries(nameFreq)
    .filter(([, freq]) => freq >= 2)
    .map(([name]) => ({
      name,
      traits: [],
      lastSeen: nodes
        .slice()
        .reverse()
        .find((n) => n.text.includes(name))?.id,
    }));

  const settingSet = new Set<string>();
  nodes.forEach((node) => {
    SETTING_KEYWORDS.forEach((kw) => {
      if (node.text.toLowerCase().includes(kw)) settingSet.add(kw);
    });
  });

  const core_events = nodes
    .map((n) => n.text.split(/[.!?]/)[0]?.trim())
    .filter(Boolean) as string[];

  return {
    characters,
    setting: Array.from(settingSet),
    core_events,
  };
}

export function serializeLore(lore: LorePayload): string {
  const parts: string[] = ["[STORY LORE]"];

  if (lore.characters.length) {
    parts.push("Characters: " + lore.characters.map((c) => c.name).join(", "));
  }
  if (lore.setting.length) {
    parts.push("Settings: " + lore.setting.join(", "));
  }
  if (lore.core_events.length) {
    parts.push("Key events: " + lore.core_events.slice(-5).join(" | "));
  }

  return parts.join("\n");
}

export function compressContext(
  nodes: StoryNode[],
  maxTokens?: number
): CompressedContext {
  const MAX = maxTokens ?? parseInt(process.env.MAX_CONTEXT_TOKENS ?? "4096", 10);

  const lore = extractLore(nodes);
  const loreSummary = serializeLore(lore);
  const loreTokens = countTokens(loreSummary);

  let budget = MAX - loreTokens;
  if (budget <= 0) {
    return {
      lore,
      window: [],
      totalTokens: loreTokens,
      droppedNodeCount: nodes.length,
    };
  }

  const window: StoryNode[] = [];
  let usedTokens = loreTokens;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const nodeTokens = countTokens(nodes[i].text);
    if (nodeTokens > budget) break;
    window.unshift(nodes[i]);
    budget -= nodeTokens;
    usedTokens += nodeTokens;
  }

  return {
    lore,
    window,
    totalTokens: usedTokens,
    droppedNodeCount: nodes.length - window.length,
  };
}
