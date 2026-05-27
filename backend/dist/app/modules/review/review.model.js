"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    imgSrc: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 5,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.Review = (0, mongoose_1.model)("Review", ReviewSchema);
