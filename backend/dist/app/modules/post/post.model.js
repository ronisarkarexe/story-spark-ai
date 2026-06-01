"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    imageURL: { type: String, required: true },
    language: { type: String, default: "English" },
    emotions: [{ type: String }],
    genre: { type: String },
    topic: [
        {
            title: { type: String, required: true },
            color: { type: String, required: true },
            selected: { type: Boolean, required: true },
        },
    ],
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isFeaturedPost: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    publishedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    attachments: [{ type: String }],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Reaction" }],
    bookmarks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: [] }],
}, {
    timestamps: true,
});
exports.PostSchema.index({ author: 1, publishedAt: -1 });
exports.PostSchema.index({ author: 1, createdAt: -1 });
exports.PostSchema.index({ author: 1, emotions: 1 });
exports.PostSchema.index({
    isPublished: 1,
    isDeleted: 1,
    likesCount: -1,
    viewsCount: -1,
});
exports.PostSchema.index({
    isPublished: 1,
    isDeleted: 1,
    genre: 1,
    likesCount: -1,
    viewsCount: -1,
});
exports.PostSchema.index({
    isPublished: 1,
    isDeleted: 1,
    emotions: 1,
    likesCount: -1,
    viewsCount: -1,
});
exports.Post = (0, mongoose_1.model)("Post", exports.PostSchema);
