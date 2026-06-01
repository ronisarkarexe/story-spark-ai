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
exports.BookmarkService = void 0;
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const bookmark_model_1 = require("./bookmark.model");
const post_model_1 = require("../post/post.model");
const mongoose_1 = require("mongoose");
const toggleBookmark = (storyId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const post = yield post_model_1.Post.findOne({
        _id: storyId,
        isDeleted: { $ne: true },
    });
    if (!post) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Story not found!");
    }
    // Atomically find and delete the bookmark if it exists
    const deletedBookmark = yield bookmark_model_1.Bookmark.findOneAndDelete({
        userId: user._id,
        storyId: post._id,
    });
    if (deletedBookmark) {
        // Atomically pull the user from the bookmarks array
        yield post_model_1.Post.findOneAndUpdate({ _id: post._id }, { $pull: { bookmarks: user._id } });
        return { message: "Bookmark removed", isBookmarked: false };
    }
    else {
        // Add bookmark atomically
        try {
            yield bookmark_model_1.Bookmark.create({
                userId: user._id,
                storyId: post._id,
            });
            // Atomically add the user to the bookmarks array if not already present
            yield post_model_1.Post.findOneAndUpdate({ _id: post._id }, { $addToSet: { bookmarks: user._id } });
            return { message: "Story bookmarked!", isBookmarked: true };
        }
        catch (error) {
            // Handle rare duplicate bookmark race condition
            if (error.code === 11000) {
                return { message: "Story bookmarked!", isBookmarked: true };
            }
            throw error;
        }
    }
});
const getBookmarks = (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, page = 1, limit = 10) {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const skip = (page - 1) * limit;
    // Find user's bookmarks
    const bookmarks = yield bookmark_model_1.Bookmark.find({ userId: user._id })
        .skip(skip)
        .limit(limit)
        .populate({
        path: "storyId",
        match: { isDeleted: { $ne: true } },
        populate: [
            { path: "author", select: "name createdAt profile.bio" },
            {
                path: "reactions",
                populate: { path: "userId", select: "_id" },
            },
            { path: "bookmarks", select: "_id" },
        ],
    });
    const total = yield bookmark_model_1.Bookmark.countDocuments({ userId: user._id });
    // Map to extract only the fully populated story objects, filtering out any orphaned references
    const bookmarkedStories = bookmarks
        .map((b) => b.storyId)
        .filter((story) => story !== null);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: bookmarkedStories,
    };
});
const checkBookmarkStatus = (storyId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const bookmark = yield bookmark_model_1.Bookmark.findOne({
        userId: user._id,
        storyId: new mongoose_1.Types.ObjectId(storyId),
    });
    return { isBookmarked: !!bookmark };
});
const deleteBookmark = (storyId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const deletedBookmark = yield bookmark_model_1.Bookmark.findOneAndDelete({
        userId: user._id,
        storyId: new mongoose_1.Types.ObjectId(storyId),
    });
    if (deletedBookmark) {
        yield post_model_1.Post.findOneAndUpdate({ _id: storyId }, { $pull: { bookmarks: user._id } });
    }
    return { message: "Bookmark removed" };
});
exports.BookmarkService = {
    toggleBookmark,
    getBookmarks,
    checkBookmarkStatus,
    deleteBookmark,
};
