"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reaction = void 0;
const mongoose_1 = require("mongoose");
const ReactionSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["like", "love", "laugh", "angry", "sad"],
        required: true,
    },
}, { timestamps: true });
ReactionSchema.index({ postId: 1, userId: 1, type: 1 }, { unique: true });
exports.Reaction = (0, mongoose_1.model)("Reaction", ReactionSchema);
