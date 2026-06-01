"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryVersionService = void 0;
const enhance_prompt_utils_1 = require("./enhance_prompt.utils");
const generation_timeout_1 = require("../../../utils/generation_timeout");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
const post_model_1 = require("../post/post.model");
const story_version_model_1 = require("./story_version.model");
const createVersionSnapshot = (storyId_1, userId_1, ...args_1) => __awaiter(void 0, [storyId_1, userId_1, ...args_1], void 0, function* (storyId, userId, prompt = "", generationType = "edited") {
    try {
        const post = yield post_model_1.Post.findById(storyId);
        if (!post) {
            return null;
        }
        const maxRetries = 5;
        for (let attempt = 0; attempt < maxRetries; attempt += 1) {
            try {
                // Re-read the latest version number on each attempt so concurrent writers
                // that win the race cause a retry instead of silently skipping a snapshot.
                const lastVersion = yield story_version_model_1.StoryVersion.findOne({ storyId })
                    .sort({ versionNumber: -1 })
                    .select("versionNumber");
                const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;
                const snapshot = yield story_version_model_1.StoryVersion.create({
                    storyId: post._id,
                    content: post.content,
                    title: post.title,
                    prompt: prompt,
                    generationType: generationType,
                    versionNumber: nextVersionNumber,
                    createdBy: userId,
                });
                return snapshot;
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.code) === 11000 && attempt < maxRetries - 1) {
                    continue;
                }
                throw error;
            }
        }
        return null;
    }
    catch (error) {
        // Non-blocking catch to ensure AI generation routes do not crash due to versioning failures
        console.error("Story version snapshot creation failed:", error);
        return null;
    }
});
const getVersionsByStoryId = (storyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(storyId);
    if (!post) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Story not found!");
    }
    // Enforce access control - users can only view their own stories
    if (post.author.toString() !== userId) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "You do not have access to this story history!");
    }
    return yield story_version_model_1.StoryVersion.find({ storyId }).sort({ versionNumber: -1 });
});
const getVersionById = (versionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const version = yield story_version_model_1.StoryVersion.findById(versionId);
    if (!version) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Story version snapshot not found!");
    }
    // Fetch the post to verify ownership
    const post = yield post_model_1.Post.findById(version.storyId);
    if (!post || post.author.toString() !== userId) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "You do not have access to this story version!");
    }
    return version;
});
const restoreVersion = (versionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const version = yield story_version_model_1.StoryVersion.findById(versionId);
    if (!version) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Story version snapshot not found!");
    }
    const post = yield post_model_1.Post.findById(version.storyId);
    if (!post) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Original story not found!");
    }
    // Access check
    if (post.author.toString() !== userId) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to restore this story!");
    }
    // 1. Create a version snapshot of the CURRENT active post content so we preserve it (avoiding data loss)
    yield createVersionSnapshot(post._id.toString(), userId, "Snapshot created automatically before restoration", "pre-restoration");
    // 2. Overwrite active post with chosen version
    post.content = version.content;
    post.title = version.title;
    yield post.save();
    // 3. Create a final snapshot documenting that a restore event occurred
    yield createVersionSnapshot(post._id.toString(), userId, `Restored to Version ${version.versionNumber}`, "restored");
    return post;
});
const ENHANCE_TIMEOUT_MS = 60000;
const enhancePrompt = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enhanced = yield (0, generation_timeout_1.raceGenerationWithTimeout)((signal) => (0, enhance_prompt_utils_1.enhancePromptWithGemini)(prompt, signal), ENHANCE_TIMEOUT_MS);
        if (!enhanced || typeof enhanced !== "string" || enhanced.trim() === "") {
            throw new api_error_1.default(http_status_1.default.BAD_GATEWAY, "Prompt enhancement returned empty result.");
        }
        return enhanced.trim();
    }
    catch (error) {
        if (error instanceof api_error_1.default)
            throw error;
        if (error instanceof generation_timeout_1.GenerationTimeoutError) {
            throw new api_error_1.default(http_status_1.default.GATEWAY_TIMEOUT, "Prompt enhancement timed out. Please try again.");
        }
        const msg = error instanceof Error ? error.message : String(error);
        throw new api_error_1.default(http_status_1.default.BAD_GATEWAY, `Prompt enhancement failed. (${msg})`);
    }
});
exports.StoryVersionService = {
    createVersionSnapshot,
    getVersionsByStoryId,
    getVersionById,
    restoreVersion,
    enhancePrompt,
};
