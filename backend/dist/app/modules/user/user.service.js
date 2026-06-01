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
exports.UserService = void 0;
const user_1 = require("../../../enums/user");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("./user.model");
const post_model_1 = require("../post/post.model");
const http_status_1 = __importDefault(require("http-status"));
const comment_model_1 = require("../comment/comment.model");
const reaction_model_1 = require("../reaction/reaction.model");
const bookmark_model_1 = require("../bookmark/bookmark.model");
const notification_model_1 = require("../notification/notification.model");
const story_version_model_1 = require("../story_version/story_version.model");
const report_model_1 = require("../report/report.model");
const allowedSocialFields = ["facebook", "twitter", "linkedin", "instagram"];
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({}).select("-password");
    return result;
});
const getUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ _id: payload });
    return result;
});
const updateUser = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = {};
    if (typeof payload.name === "string") {
        const trimmedName = payload.name.trim();
        if (!trimmedName) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Full Name cannot be empty!");
        }
        updateData.name = trimmedName;
    }
    if (payload.profile) {
        if (typeof payload.profile.avatar === "string") {
            updateData["profile.avatar"] = payload.profile.avatar;
        }
        if (typeof payload.profile.bio === "string") {
            updateData["profile.bio"] = payload.profile.bio;
        }
        if (payload.profile.social) {
            for (const field of allowedSocialFields) {
                const value = payload.profile.social[field];
                if (typeof value === "string") {
                    updateData[`profile.social.${field}`] = value;
                }
            }
        }
    }
    // ─── ADDED: PARSE WRITING GOALS PAYLOADS FOR INJECTION ───
    if (payload.writingGoals) {
        if (typeof payload.writingGoals.dailyWordCount === "number") {
            updateData["writingGoals.dailyWordCount"] = payload.writingGoals.dailyWordCount;
        }
        if (typeof payload.writingGoals.weeklyWordCount === "number") {
            updateData["writingGoals.weeklyWordCount"] = payload.writingGoals.weeklyWordCount;
        }
    }
    if (Object.keys(updateData).length === 0) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "No valid user fields provided!");
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email: token.email }, { $set: updateData }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_model_1.User.exists({ _id: id });
    if (!userExists) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const userPosts = yield post_model_1.Post.find({ author: id }).select("_id").lean();
    const postIds = userPosts.map((p) => p._id);
    yield story_version_model_1.StoryVersion.deleteMany({ storyId: { $in: postIds } });
    yield reaction_model_1.Reaction.deleteMany({ postId: { $in: postIds } });
    yield comment_model_1.Comment.deleteMany({ postId: { $in: postIds } });
    yield bookmark_model_1.Bookmark.deleteMany({ storyId: { $in: postIds } });
    yield post_model_1.Post.updateMany({ bookmarks: id }, { $pull: { bookmarks: id } });
    yield bookmark_model_1.Bookmark.deleteMany({ userId: id });
    yield reaction_model_1.Reaction.deleteMany({ userId: id });
    yield comment_model_1.Comment.deleteMany({ userId: id });
    yield report_model_1.Report.deleteMany({ reportedBy: id });
    yield notification_model_1.Notification.deleteMany({ userId: id });
    yield post_model_1.Post.deleteMany({ author: id });
    const result = yield user_model_1.User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
});
const applyForWriter = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    if (user.isApplyForWriter) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "You have already applied for writer!");
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email: email }, { isApplyForWriter: true }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const approveWriterApplication = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistUser = yield user_model_1.User.findOne({ email: email });
        if (!isExistUser) {
            throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
        }
        if (isExistUser.role === user_1.ENUM_USER_ROLE.WRITER) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User is already a writer!");
        }
        const result = yield user_model_1.User.findOneAndUpdate({ email: email }, { role: user_1.ENUM_USER_ROLE.WRITER }, {
            new: true,
            runValidators: true,
        });
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, error.message);
        }
        else {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "An unknown error occurred");
        }
    }
});
const getAllWriterApplicationUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ isApplyForWriter: true });
    return result;
});
const getProfileInfo = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const publishedPostsCount = yield post_model_1.Post.countDocuments({
        author: user._id,
        isPublished: true,
        isDeleted: { $ne: true },
    });
    if (user.postsCount !== publishedPostsCount) {
        user.postsCount = publishedPostsCount;
        yield user.save();
    }
    return user;
});
const toggleFollow = (token, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield user_model_1.User.findOne({ email: token.email });
    if (!currentUser) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const author = yield user_model_1.User.findById(authorId);
    if (!author) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Author not found!");
    }
    const isFollowing = currentUser.following.includes(author._id);
    if (isFollowing) {
        yield user_model_1.User.findByIdAndUpdate(currentUser._id, {
            $pull: { following: author._id },
        });
        yield user_model_1.User.findByIdAndUpdate(author._id, {
            $pull: { followers: currentUser._id },
        });
        return { isFollowing: false };
    }
    else {
        yield user_model_1.User.findByIdAndUpdate(currentUser._id, {
            $addToSet: { following: author._id },
        });
        yield user_model_1.User.findByIdAndUpdate(author._id, {
            $addToSet: { followers: currentUser._id },
        });
        return { isFollowing: true };
    }
});
const getFollowStatus = (token, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield user_model_1.User.findOne({ email: token.email });
    if (!currentUser) {
        return { isFollowing: false };
    }
    const isFollowing = currentUser.following.some((id) => id.toString() === authorId);
    return { isFollowing };
});
exports.UserService = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getProfileInfo,
    applyForWriter,
    approveWriterApplication,
    getAllWriterApplicationUsers,
    toggleFollow,
    getFollowStatus,
};
