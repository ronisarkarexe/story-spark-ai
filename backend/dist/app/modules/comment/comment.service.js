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
exports.CommentService = void 0;
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const comment_model_1 = require("./comment.model");
const mongoose_1 = require("mongoose");
const post_model_1 = require("../post/post.model");
const createComment = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email } = token;
    const user = _id ? yield user_model_1.User.findById(_id) : yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const post = yield post_model_1.Post.findOne({
        _id: payload.postId,
        isDeleted: { $ne: true },
    });
    if (!post) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Post not found!");
    }
    // Use an atomic $inc update instead of the read-modify-write pattern.
    // With concurrent requests, both would read the same commentsCount value
    // and both would write count + 1, losing one increment per race.
    // findByIdAndUpdate with $inc is a single atomic MongoDB operation.
    yield post_model_1.Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });
    const commentData = {
        postId: new mongoose_1.Types.ObjectId(payload.postId),
        userId: user._id,
        comment: payload.comment,
    };
    if (payload.parentCommentId) {
        commentData.parentCommentId = new mongoose_1.Types.ObjectId(payload.parentCommentId);
    }
    const res = yield comment_model_1.Comment.create(commentData);
    return res;
});
const getCommentsByPostId = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const allComments = (yield comment_model_1.Comment.find({ postId })
        .populate("userId", "name email")
        .populate("likes")
        .sort({ createdAt: -1 })
        .lean());
    const totalComments = allComments.length;
    const topLevelComments = [];
    const replyMap = new Map();
    // Distribute comments into top-level list and replies map
    for (const comment of allComments) {
        if (!comment.parentCommentId) {
            comment.replies = [];
            topLevelComments.push(comment);
        }
        else {
            const parentIdStr = comment.parentCommentId.toString();
            if (!replyMap.has(parentIdStr)) {
                replyMap.set(parentIdStr, []);
            }
            replyMap.get(parentIdStr).push(comment);
        }
    }
    // Attach replies to their corresponding top-level comments and sort them chronologically (createdAt: 1)
    for (const comment of topLevelComments) {
        const idStr = comment._id.toString();
        const replies = replyMap.get(idStr) || [];
        // Sort replies in ascending chronological order
        replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        comment.replies = replies;
    }
    return { comments: topLevelComments, totalComments };
});
const toggleCommentLike = (commentId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, email } = token;
    const user = _id ? yield user_model_1.User.findById(_id) : yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const comment = yield comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Comment not found!");
    }
    const post = yield post_model_1.Post.findOne({
        _id: comment.postId,
        isDeleted: { $ne: true },
    });
    if (!post) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Post not found!");
    }
    // Replace the read-modify-write likes toggle with atomic MongoDB operators.
    // The original pattern read likes, checked membership with includes, mutated
    // the array, and saved. Two concurrent toggles by the same user can both pass
    // the includes check (both see the ID absent), both push, and both save,
    // resulting in a duplicate like entry.
    //
    // $addToSet adds the user ID only if it is not already present (like).
    // $pull removes all matching entries (unlike). Both are atomic.
    // Checking the current state first determines which operation to perform.
    const isCurrentlyLiked = yield comment_model_1.Comment.exists({
        _id: comment._id,
        likes: user._id,
    });
    const updatedComment = yield comment_model_1.Comment.findByIdAndUpdate(comment._id, isCurrentlyLiked
        ? { $pull: { likes: user._id } }
        : { $addToSet: { likes: user._id } }, { new: true });
    return updatedComment;
});
exports.CommentService = {
    createComment,
    getCommentsByPostId,
    toggleCommentLike,
};
