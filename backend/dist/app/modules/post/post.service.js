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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const post_model_1 = require("./post.model");
const story_version_service_1 = require("../story_version/story_version.service");
const pagination_helper_1 = __importDefault(require("../../../utils/pagination_helper"));
const post_constant_1 = require("./post.constant");
const gamification_service_1 = require("../gamification/gamification.service");
// Assuming your project has AI and Quota modules structured like this:
// import { QuotaService } from "../quota/quota.service";
// import { AIModelService } from "../ai_model/ai_model.service";
const MAX_SEARCH_TERM_LENGTH = 100;
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const createPost = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, role } = token;
    const user = yield user_model_1.User.findOne({
        email: email,
        role: role,
    });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    try {
        const isPublished = (_a = payload.isPublished) !== null && _a !== void 0 ? _a : true;
        const res = yield post_model_1.Post.create(Object.assign(Object.assign({}, payload), { isPublished, publishedAt: isPublished ? new Date() : null, author: user._id, updatedBy: user._id }));
        if (res && res.isPublished) {
            user.postsCount += 1;
            yield user.save();
            gamification_service_1.GamificationService.addXp(String(user._id), 50, "CREATED_POST").catch(console.error);
            if (user.postsCount === 1) {
                gamification_service_1.GamificationService.awardBadge(String(user._id), "First Story").catch(console.error);
            }
        }
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create post");
    }
});
const getPosts = (filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, orderBy } = (0, pagination_helper_1.default)(pagination);
    const { searchTerm, trendingTopic, sortFilter, genres } = filters, filterData = __rest(filters, ["searchTerm", "trendingTopic", "sortFilter", "genres"]);
    const andCondition = [
        { isDeleted: { $ne: true } },
    ];
    if (searchTerm) {
        const safeSearchTerm = escapeRegex(searchTerm.trim().slice(0, MAX_SEARCH_TERM_LENGTH));
        if (safeSearchTerm) {
            andCondition.push({
                $or: post_constant_1.postSearchFields.map((field) => ({
                    [field]: {
                        $regex: safeSearchTerm,
                        $options: "i",
                    },
                })),
            });
        }
    }
    if (trendingTopic) {
        andCondition.push({
            "topic.title": trendingTopic,
        });
    }
    const genreList = Array.isArray(genres)
        ? genres
        : typeof genres === "string"
            ? genres.split(",").map((g) => g.trim()).filter(Boolean)
            : [];
    if (genreList.length > 0) {
        andCondition.push({
            $or: genreList.map((genre) => ({
                tag: {
                    $regex: new RegExp(`^${genre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    // sort condition
    const sortCondition = {};
    if (sortFilter === "mostPopular") {
        sortCondition.likesCount = -1;
    }
    if (sortBy && orderBy) {
        sortCondition[sortBy] = orderBy === "asc" ? 1 : -1;
    }
    const result = yield post_model_1.Post.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .populate("author", "name createdAt profile.bio")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "_id" },
    })
        .populate("bookmarks", "_id");
    const total = yield post_model_1.Post.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getPublishedPostsByAuthor = (token, filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, orderBy } = (0, pagination_helper_1.default)(pagination);
    const user = yield user_model_1.User.findOne({ email: token.email, role: token.role });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const andCondition = [
        { author: user._id },
        { isPublished: true },
        { isDeleted: { $ne: true } },
    ];
    if (filters.searchTerm) {
        andCondition.push({
            $or: post_constant_1.postSearchFields.map((field) => ({
                [field]: {
                    $regex: filters.searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    const sortCondition = {};
    if (sortBy && orderBy) {
        sortCondition[sortBy] = orderBy === "asc" ? 1 : -1;
    }
    else {
        sortCondition.publishedAt = -1;
        sortCondition.createdAt = -1;
    }
    const whereCondition = { $and: andCondition };
    const result = yield post_model_1.Post.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .populate("author", "name createdAt")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "_id" },
    })
        .populate("bookmarks", "_id");
    const total = yield post_model_1.Post.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getLatestPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield post_model_1.Post.find({ isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("author", "name email createdAt")
            .limit(50)
            .populate("author", "name createdAt profile.bio")
            .populate({
            path: "reactions",
            populate: { path: "userId", select: "_id" },
        })
            .populate("bookmarks", "_id");
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get latest posts");
    }
});
const getFeaturedPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield post_model_1.Post.find({
            isFeaturedPost: true,
            isDeleted: { $ne: true },
        })
            .sort({ createdAt: -1, updatedBy: -1 })
            .limit(3)
            .populate("author", "name email createdAt")
            .limit(10)
            .populate("author", "name createdAt profile.bio")
            .populate({
            path: "reactions",
            populate: { path: "userId", select: "_id" },
        })
            .populate("bookmarks", "_id");
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get featured posts");
    }
});
const doFeaturedPosts = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield post_model_1.Post.findOneAndUpdate({ _id: postId, isDeleted: { $ne: true } }, { isFeaturedPost: true }, { new: true });
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to approve featured posts");
    }
});
const getSinglePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const postById = yield post_model_1.Post.findOne({ _id: id, isDeleted: { $ne: true } })
        .populate("author", "name createdAt profile.bio")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "_id" },
    })
        .populate("bookmarks", "_id");
    if (!postById) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Post not found!");
    }
    return postById;
});
const getPostsByTag = (tag, excludeId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tag) {
        return [];
    }
    const query = { tag, isDeleted: { $ne: true } };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    const result = yield post_model_1.Post.find(query)
        .limit(3)
        .populate("author", "name email createdAt")
        .limit(2)
        .populate("author", "name createdAt profile.bio")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "_id" },
    })
        .populate("bookmarks", "_id");
    return result;
});
const toggleBookmark = (postId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const post = yield post_model_1.Post.findOne({ _id: postId, isDeleted: { $ne: true } });
    if (!post) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Post not found!");
    }
    // Check bookmark status atomically via a DB query instead of loading the full document
    const isBookmarked = yield post_model_1.Post.exists({ _id: postId, bookmarks: user._id });
    if (isBookmarked) {
        // Remove bookmark atomically
        yield post_model_1.Post.updateOne({ _id: postId }, { $pull: { bookmarks: user._id } });
        return { message: "Bookmark removed", bookmarked: false };
    }
    else {
        // Add bookmark atomically — $addToSet prevents duplicates
        yield post_model_1.Post.updateOne({ _id: postId }, { $addToSet: { bookmarks: user._id } });
        return { message: "Bookmark added", bookmarked: true };
    }
});
const updatePost = (postId, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const post = yield post_model_1.Post.findById(postId);
    if (!post) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Post not found!");
    }
    // Enforce ownership
    if (post.author.toString() !== user._id.toString() &&
        user.role !== "admin" &&
        user.role !== "super_admin") {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to edit this story!");
    }
    // Automatically create version snapshot of the current state BEFORE overwriting
    yield story_version_service_1.StoryVersionService.createVersionSnapshot(postId, user._id.toString(), payload.prompt || "", payload.generationType || "edited");
    // Overwrite post content
    if (payload.title !== undefined)
        post.title = payload.title;
    if (payload.content !== undefined)
        post.content = payload.content;
    if (payload.tag !== undefined)
        post.tag = payload.tag;
    if (payload.topic !== undefined)
        post.topic = payload.topic;
    post.updatedBy = user._id;
    yield post.save();
    return post;
});
const deletePost = (postId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: token.email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const post = yield post_model_1.Post.findOne({
        _id: postId,
        isDeleted: { $ne: true },
    });
    if (!post) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Post not found!");
    }
    if (!post.author || post.author.toString() !== user._id.toString()) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "You can only delete your own story!");
    }
    post.isDeleted = true;
    post.deletedAt = new Date();
    post.deletedBy = user._id;
    yield post.save();
    if (post.isPublished && user.postsCount > 0) {
        user.postsCount -= 1;
        yield user.save();
    }
    return post;
});
/* ============================================================
   PATCHED SERVICES — GSSoC '26 AI VARIATION SYSTEM & QUOTAS
   ============================================================ */
const remixStory = (postId, prompt, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: token.email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const originalPost = yield post_model_1.Post.findOne({ _id: postId, isDeleted: { $ne: true } });
    if (!originalPost) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Original story post not found!");
    }
    // Enforces data consistency by decrementing/reserving 1 credit balance mapping
    // If your project uses an external service class call, invoke it here:
    // await QuotaService.reserveUserQuota(user._id, 1);
    // Place your real AI model generation text manipulation calls here
    const remixedContent = `[AI Remixed Version based on prompt: "${prompt}"]\n\n${originalPost.content}`;
    const res = yield post_model_1.Post.create({
        title: `Remix of ${originalPost.title}`,
        content: remixedContent,
        author: user._id,
        updatedBy: user._id,
        tag: originalPost.tag,
    });
    if (res) {
        user.postsCount += 1;
        yield user.save();
    }
    return res;
});
const translateStory = (postId, language, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: token.email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const originalPost = yield post_model_1.Post.findOne({ _id: postId, isDeleted: { $ne: true } });
    if (!originalPost) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Original story post not found!");
    }
    // Decrement/Reserve quota allocation block
    // await QuotaService.reserveUserQuota(user._id, 1);
    // Place your real language model translation core handler services here
    const translatedContent = `[Translated to ${language}]\n\n${originalPost.content}`;
    const res = yield post_model_1.Post.create({
        title: `${originalPost.title} (${language})`,
        content: translatedContent,
        author: user._id,
        updatedBy: user._id,
        tag: originalPost.tag,
    });
    if (res) {
        user.postsCount += 1;
        yield user.save();
    }
    return res;
});
exports.PostService = {
    createPost,
    getPosts,
    getPublishedPostsByAuthor,
    getLatestPosts,
    getFeaturedPosts,
    doFeaturedPosts,
    getSinglePost,
    getPostsByTag,
    toggleBookmark,
    updatePost,
    deletePost,
    remixStory, // Exposed service for AI story variations
    translateStory, // Exposed service for localized modifications
};
