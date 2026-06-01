"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterApplication = void 0;
const mongoose_1 = require("mongoose");
const WriterApplicationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    portfolioLink: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
exports.WriterApplication = (0, mongoose_1.model)("WriterApplication", WriterApplicationSchema);
