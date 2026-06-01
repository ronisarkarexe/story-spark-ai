"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmark = void 0;
const mongoose_1 = require("mongoose");
const BookmarkSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    storyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
});
// Add compound unique index to prevent duplicates at the database level
BookmarkSchema.index({ userId: 1, storyId: 1 }, { unique: true });
exports.Bookmark = (0, mongoose_1.model)("Bookmark", BookmarkSchema);
