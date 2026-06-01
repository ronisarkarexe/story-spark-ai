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
exports.consumeRateLimit = void 0;
const mongoose_1 = require("mongoose");
const logger_util_1 = __importDefault(require("../../utils/logger.util"));
const rateLimitSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    firstRequestAt: { type: Date, default: null },
    blockedUntil: { type: Date, default: null },
    expireAt: { type: Date, required: true },
});
// TTL index: Mongo removes the document once expireAt passes, so stale keys are
// cleaned up automatically without an in-process interval.
rateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const RateLimitRecord = (0, mongoose_1.model)("RateLimitRecord", rateLimitSchema);
// Atomically records one hit for a key and decides whether it is allowed.
// The whole window-and-block state transition runs in a single pipeline update
// so concurrent requests cannot race. Fails open on store errors.
const consumeRateLimit = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { key, windowMs, maxRequests, blockTimeMs } = opts;
    const now = new Date();
    const ttlMs = Math.max(windowMs, blockTimeMs) + 60000;
    try {
        const prevCount = { $ifNull: ["$count", 0] };
        const prevFirst = { $ifNull: ["$firstRequestAt", now] };
        const prevBlocked = { $ifNull: ["$blockedUntil", null] };
        const currentlyBlocked = {
            $and: [{ $ne: [prevBlocked, null] }, { $gt: [prevBlocked, now] }],
        };
        const windowElapsed = { $gt: [{ $subtract: [now, prevFirst] }, windowMs] };
        const updated = yield RateLimitRecord.findOneAndUpdate({ key }, [
            {
                $set: {
                    _blocked: currentlyBlocked,
                    _prevBlocked: prevBlocked,
                    _count: {
                        $cond: [
                            currentlyBlocked,
                            prevCount,
                            { $cond: [windowElapsed, 1, { $add: [prevCount, 1] }] },
                        ],
                    },
                    _first: {
                        $cond: [
                            currentlyBlocked,
                            prevFirst,
                            { $cond: [windowElapsed, now, prevFirst] },
                        ],
                    },
                },
            },
            {
                $set: {
                    count: "$_count",
                    firstRequestAt: "$_first",
                    blockedUntil: {
                        $cond: [
                            "$_blocked",
                            "$_prevBlocked",
                            {
                                $cond: [
                                    { $gt: ["$_count", maxRequests] },
                                    new Date(now.getTime() + blockTimeMs),
                                    null,
                                ],
                            },
                        ],
                    },
                    expireAt: new Date(now.getTime() + ttlMs),
                },
            },
            { $unset: ["_blocked", "_prevBlocked", "_count", "_first"] },
        ], { new: true, upsert: true, setDefaultsOnInsert: true });
        const blockedUntil = (_a = updated === null || updated === void 0 ? void 0 : updated.blockedUntil) !== null && _a !== void 0 ? _a : null;
        if (blockedUntil && blockedUntil.getTime() > now.getTime()) {
            return {
                allowed: false,
                retryAfterSec: Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000),
            };
        }
        return { allowed: true, retryAfterSec: 0 };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger_util_1.default.error(`Rate limit store error for ${key}: ${message}`);
        return { allowed: true, retryAfterSec: 0 };
    }
});
exports.consumeRateLimit = consumeRateLimit;
