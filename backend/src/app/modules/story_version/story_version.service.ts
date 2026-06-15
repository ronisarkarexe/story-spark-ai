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

interface IBranchTreeNode {
  id: string;
  parentId: string | null;
  title: string;
  versionNumber: number;
  branchName: string | null;
  branchDepth: number;
}

interface IBranchTreeEdge {
  source: string;
  target: string;
}

interface IStoryTreeResponse {
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
    const post = await Post.findById(storyId);
    if (!post) {
      return null;
    }

    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
      try {
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
    console.error("Story version snapshot creation failed:", error);
    return null;
  }
};

const createBranchVersion = async (
  parentVersionId: string,
  userId: string,
  branchName: string
): Promise<IStoryVersion> => {
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
      parentId: version.parentVersionId ? version.parentVersionId.toString() : null,
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

  return { nodes, edges };
};

const getBranchPath = async (
  versionId: string,
  userId: string
): Promise<IStoryVersion[]> => {
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
  const { page, limit, skip } = paginationHelper(pagination);
  const post = await Post.findById(storyId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found!");
  }

  if (post.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this story history!"
    );
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
  const version = await StoryVersion.findById(versionId);
  if (!version) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Story version snapshot not found!"
    );
  }

  const post = await Post.findById(version.storyId);
  if (!post || post.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have access to this story version!"
    );
  }

  return version;
};

const restoreVersion = async (
  versionId: string,
  userId: string
): Promise<IPost> => {
  const version = await StoryVersion.findById(versionId);
  if (!version) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Story version snapshot not found!"
    );
  }

  const post = await Post.findById(version.storyId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Original story not found!");
  }

  if (post.author.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have permission to restore this story!"
    );
  }

  await createVersionSnapshot(
    post._id.toString(),
    userId,
    "Snapshot created automatically before restoration",
    "pre-restoration"
  );

  post.content = version.content;
  post.title = version.title;
  await post.save();

  await createVersionSnapshot(
    post._id.toString(),
    userId,
    `Restored to Version ${version.versionNumber}`,
    "restored"
  );

  return post;
};

const ENHANCE_TIMEOUT_MS = 60000;

const enhancePrompt = async (prompt: string, provider?: string): Promise<string> => {
  try {
    const enhanced = await raceGenerationWithTimeout(
      (signal) => {
        const p = provider?.toLowerCase();
        if (p === "anthropic" || p === "claude") {
          return enhancePromptWithAnthropic(prompt, signal);
        } else if (p === "openai") {
          return enhancePromptWithOpenAI(prompt, signal);
        } else {
          return enhancePromptWithGemini(prompt, signal);
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