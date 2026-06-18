import { get_encoding } from "tiktoken";
import { contextCompressor } from "../../../utils/contextCompressor";
import { enhancePromptWithGemini, enhancePromptWithOpenAI, enhancePromptWithAnthropic } from "./enhance_prompt.utils";
import { raceGenerationWithTimeout, GenerationTimeoutError } from "../../../utils/generation_timeout";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { Post } from "../post/post.model";
import { StoryVersion } from "./story_version.model";
import { IStoryVersion } from "./story_version.interface";
import { IPost } from "../post/post.interface";
import paginationHelper from "../../../utils/pagination_helper";
import {
  IPaginationOptions,
  IGenericResponse,
} from "../../../interfaces/pagination";
import { analyzeCharacterNetwork, ICharacterNetworkResponse } from "./character_network.utils";
import { Types } from "mongoose";

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

interface IBranchTreeNode{
  id: string;
  parentId: string | null;
  title: string;
  versionNumber: number;
  branchName: string | null;
  branchDepth: number;
}

interface IBranchTreeEdge{
  source: string;
  target: string;
}

interface IStoryTreeResponse{
  nodes: IBranchTreeNode[];
  edges: IBranchTreeEdge[];
}

const createVersionSnapshot = async (
  storyId: string,
  userId: string,
  prompt: string = "",
  generationType: string = "edited"
): Promise<IStoryVersion | null> => {
  try {
    if (!Types.ObjectId.isValid(storyId)) {
      return null;
    }
    const post = await Post.findById(storyId);
    if (!post) {
      return null;
    }

    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
      try {
        // Re-read the latest version number on each attempt so concurrent writers
        // that win the race cause a retry instead of silently skipping a snapshot.
        const lastVersion = await StoryVersion.findOne({ storyId })
          .sort({ versionNumber: -1 })
          .select("versionNumber");

        const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        const snapshot = await StoryVersion.create({
          storyId: post._id,
          content: post.content,
          title: post.title,
          prompt: prompt,
          generationType: generationType,
          versionNumber: nextVersionNumber,
          createdBy: userId,
        });

        return snapshot;
      } catch (error: any) {
        if (error?.code === 11000 && attempt < maxRetries - 1) {
          continue;
        }
        throw error;
      }
    }
    return null;
  } catch (error) {
    // Non-blocking catch to ensure AI generation routes do not crash due to versioning failures
    console.error("Story version snapshot creation failed:", error);
    return null;
  }
};


const createBranchVersion = async (
  parentVersionId: string,
  userId: string,
  branchName: string
): Promise<IStoryVersion> => {
  if (!Types.ObjectId.isValid(parentVersionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid parent version ID!");
  }
  const parentVersion = await StoryVersion.findById(parentVersionId);

  if (!parentVersion) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Parent story version not found!"
    );
  }

  const post = await Post.findById(parentVersion.storyId);

  if (!post) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Associated story not found!"
    );
  }

  if (post.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have permission to create a branch for this story!"
    );
  }

  const latestVersion = await StoryVersion.findOne({
    storyId: parentVersion.storyId,
  })
    .sort({ versionNumber: -1 })
    .select("versionNumber");

  const nextVersionNumber = latestVersion
    ? latestVersion.versionNumber + 1
    : 1;

  const branchVersion = await StoryVersion.create({
    storyId: parentVersion.storyId,
    content: parentVersion.content,
    title: parentVersion.title,
    prompt: parentVersion.prompt ?? "",
    generationType: "branch",
    versionNumber: nextVersionNumber,
    createdBy: userId,
    parentVersionId: parentVersion._id,
    branchName: branchName.trim(),
    branchDepth: (parentVersion.branchDepth ?? 0) + 1,
  });

  return branchVersion;
};

const getStoryTree = async (
  storyId: string,
  userId: string
): Promise<IStoryTreeResponse> => {
  if (!Types.ObjectId.isValid(storyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid story ID!");
  }
  const post = await Post.findById(storyId);

  if (!post) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Story not found!"
    );
  }

  if (post.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this story!"
    );
  }

  const versions = await StoryVersion.find({ storyId }).sort({ versionNumber: 1 });
  const nodes: IBranchTreeNode[] = [];
  const edges: IBranchTreeEdge[] = [];

  for (const version of versions) {
    nodes.push({
      id: version._id.toString(),
      parentId: version.parentVersionId? version.parentVersionId.toString(): null,
      title: version.title,
      versionNumber: version.versionNumber,
      branchName: version.branchName ?? null,
      branchDepth: version.branchDepth ?? 0,
    });

    if (version.parentVersionId) {
      edges.push({
        source: version.parentVersionId.toString(),
        target: version._id.toString(),
      });
    }
  }

  return {nodes,edges,};
};

const getBranchPath = async (
  versionId: string,
  userId: string
): Promise<IStoryVersion[]> => {
  if (!Types.ObjectId.isValid(versionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid version ID!");
  }
  const version = await StoryVersion.findById(versionId);

  if (!version) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Story version not found!"
    );
  }

  const post = await Post.findById(version.storyId);

  if (!post || post.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this story!"
    );
  }

  const path: IStoryVersion[] = [];
  let current: IStoryVersion | null = version;

  while (current) {
    path.unshift(current);
    if (!current.parentVersionId) {
      break;
    }

    current = await StoryVersion.findById(current.parentVersionId);
  }

  return path;
};

const getVersionsByStoryId = async (
  storyId: string,
  userId: string,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IStoryVersion[]>> => {
  if (!Types.ObjectId.isValid(storyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid story ID!");
  }
  const { page, limit, skip } = paginationHelper(pagination);
  const post = await Post.findById(storyId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found!");
  }

  // Enforce access control - users can only view their own stories
  if (post.author.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have access to this story history!");
  }

  const data = await StoryVersion.find({ storyId })
    .sort({ versionNumber: -1 })
    .skip(skip)
    .limit(limit);

  const total = await StoryVersion.countDocuments({ storyId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getVersionById = async (
  versionId: string,
  userId: string
): Promise<IStoryVersion> => {
  if (!Types.ObjectId.isValid(versionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid version ID!");
  }
  const version = await StoryVersion.findById(versionId);
  if (!version) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story version snapshot not found!");
  }

  // Fetch the post to verify ownership
  const post = await Post.findById(version.storyId);
  if (!post || post.author.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have access to this story version!");
  }

  return version;
};

const restoreVersion = async (
  versionId: string,
  userId: string
): Promise<IPost> => {
  if (!Types.ObjectId.isValid(versionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid version ID!");
  }
  const version = await StoryVersion.findById(versionId);
  if (!version) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story version snapshot not found!");
  }

  const post = await Post.findById(version.storyId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Original story not found!");
  }

  // Access check
  if (post.author.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to restore this story!");
  }

  // 1. Create a version snapshot of the CURRENT active post content so we preserve it (avoiding data loss)
  await createVersionSnapshot(
    post._id.toString(),
    userId,
    "Snapshot created automatically before restoration",
    "pre-restoration"
  );

  // 2. Overwrite active post with chosen version
  post.content = version.content;
  post.title = version.title;
  await post.save();

  // 3. Create a final snapshot documenting that a restore event occurred
  await createVersionSnapshot(
    post._id.toString(),
    userId,
    `Restored to Version ${version.versionNumber}`,
    "restored"
  );

  return post;
};

const ENHANCE_TIMEOUT_MS = 60000;

const enhancePrompt = async (
  prompt: string,
  provider?: string,
  storyContent?: string
): Promise<string> => {
  try {
    const compressed = storyContent ? contextCompressor(storyContent) : null;

    const enhanced = await raceGenerationWithTimeout(
      (signal) => {
        const p = provider?.toLowerCase();
        if (p === "anthropic" || p === "claude") {
          return enhancePromptWithAnthropic(prompt, signal);
        } else if (p === "openai") {
          return enhancePromptWithOpenAI(prompt, signal);
        } else {
          return enhancePromptWithGemini(prompt, signal, compressed?.compressedText);
        }
      },
      ENHANCE_TIMEOUT_MS
    );

    if (!enhanced || typeof enhanced !== "string" || enhanced.trim() === "") {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        "Prompt enhancement returned empty result."
      );
    }

    return enhanced.trim();
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof GenerationTimeoutError) {
      throw new ApiError(
        httpStatus.GATEWAY_TIMEOUT,
        "Prompt enhancement timed out. Please try again."
      );
    }

    const msg = error instanceof Error ? error.message : String(error);
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      `Prompt enhancement failed. (${msg})`
    );
  }
};

const getCharacterNetwork = async (
  storyId: string,
  userId: string
): Promise<ICharacterNetworkResponse> => {
  if (!Types.ObjectId.isValid(storyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid story ID!");
  }
  const post = await Post.findById(storyId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found!");
  }

  if (post.author.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have access to this story history!");
  }

  return await analyzeCharacterNetwork(post.content || "");
};

export const StoryVersionService = {
  createVersionSnapshot,
  createBranchVersion,
  getStoryTree,
  getBranchPath,
  getVersionsByStoryId,
  getVersionById,
  restoreVersion,
  enhancePrompt,
  getCharacterNetwork,
};