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
exports.ReactionService = void 0;
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const reaction_model_1 = require("./reaction.model");
const mongoose_1 = require("mongoose");
const post_model_1 = require("../post/post.model");
const toggleReaction = (postId_1, ...args_1) => __awaiter(void 0, [postId_1, ...args_1], void 0, function* (postId, type = "like", token) {
    const { email } = token;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    const post = yield post_model_1.Post.findOne({ _id: postId });
    if (!post) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Post not found!");
    }
    // Check if reaction already exists
    const existingReaction = yield reaction_model_1.Reaction.findOne({
        postId: postId,
        userId: user._id,
        type: type,
    });
    if (existingReaction) {
        // Remove reaction
        yield reaction_model_1.Reaction.findByIdAndDelete(existingReaction._id);
        post.likesCount = Math.max(0, post.likesCount - 1);
        post.reactions = post.reactions || [];
        post.reactions = post.reactions.filter((rId) => rId.toString() !== existingReaction._id.toString());
        yield post.save();
        return { message: "Reaction removed", likesCount: post.likesCount };
    }
    else {
        // Add reaction
        const newReaction = yield reaction_model_1.Reaction.create({
            postId: new mongoose_1.Types.ObjectId(postId),
            userId: user._id,
            type: type,
        });
        post.likesCount = post.likesCount + 1;
        post.reactions = post.reactions || [];
        post.reactions.push(newReaction._id);
        yield post.save();
        return { message: "Reaction added", likesCount: post.likesCount };
    }
});
exports.ReactionService = {
    toggleReaction,
};
