"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshSession = void 0;
const mongoose_1 = require("mongoose");
const refreshSessionSchema = new mongoose_1.Schema({
    jti: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    used: { type: Boolean, default: false },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true,
});
// TTL index: Mongo removes a session once it expires, so used and revoked
// records are cleaned up automatically.
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.RefreshSession = (0, mongoose_1.model)("RefreshSession", refreshSessionSchema);
