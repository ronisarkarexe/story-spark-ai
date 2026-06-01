"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestUsage = void 0;
const mongoose_1 = require("mongoose");
const GuestUsageSchema = new mongoose_1.Schema({
    guestId: { type: String, required: true, unique: true, index: true },
    requestCount: { type: Number, default: 0, min: 0 },
    lastRequestAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.GuestUsage = (0, mongoose_1.model)("GuestUsage", GuestUsageSchema);
