"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryVersion = exports.StoryVersionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.StoryVersionSchema = new mongoose_1.Schema({
    storyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    title: { type: String, required: true },
    prompt: { type: String, default: "" },
    generationType: { type: String, required: true },
    versionNumber: { type: Number, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
});
// Compound index for unique constraints and optimized chronological order retrievals
exports.StoryVersionSchema.index({ storyId: 1, versionNumber: -1 }, { unique: true });
exports.StoryVersion = (0, mongoose_1.model)("StoryVersion", exports.StoryVersionSchema);
