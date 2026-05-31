import { enhancePromptWithGemini } from "./enhance_prompt.utils";
import { raceGenerationWithTimeout, GenerationTimeoutError } from "../../../utils/generation_timeout";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { Post } from "../post/post.model";
import { StoryVersion } from "./story_version.model";
import { IStoryVersion } from "./story_version.interface";
import { IPost } from "../post/post.interface";

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

const getVersionsByStoryId = async (
  storyId: string,
  userId: string
): Promise<IStoryVersion[]> => {
  const post = await Post.findById(storyId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found!");
  }

  // Enforce access control - users can only view their own stories
  if (post.author.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not have access to this story history!");
  }

  return await StoryVersion.find({ storyId }).sort({ versionNumber: -1 });
};

const getVersionById = async (
  versionId: string,
  userId: string
): Promise<IStoryVersion> => {
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

const enhancePrompt = async (prompt: string): Promise<string> => {
  try {
    const enhanced = await raceGenerationWithTimeout(
      (signal) => enhancePromptWithGemini(prompt, signal),
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

export const StoryVersionService = {
  createVersionSnapshot,
  getVersionsByStoryId,
  getVersionById,
  restoreVersion,
  enhancePrompt,
};
