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
exports.isSuccessfulGeneration = exports.refundGuestQuota = exports.reserveGuestQuota = exports.refundUserQuota = exports.reserveUserQuota = exports.subscriptionLimitExpression = exports.effectiveCountExpression = exports.effectiveRequestCount = exports.getFirstDayOfMonth = exports.FREE_GUEST_LIMIT = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const ai_model_request_limit_1 = require("../../../interfaces/ai_model_request_limit");
const user_model_1 = require("../user/user.model");
const guest_usage_model_1 = require("./guest_usage.model");
exports.FREE_GUEST_LIMIT = 3;
const getFirstDayOfMonth = (referenceDate = new Date()) => new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
exports.getFirstDayOfMonth = getFirstDayOfMonth;
const effectiveRequestCount = (requestsThisMonth, lastRequestDate, firstDayOfMonth) => {
    if (!lastRequestDate || lastRequestDate < firstDayOfMonth) {
        return 0;
    }
    return requestsThisMonth;
};
exports.effectiveRequestCount = effectiveRequestCount;
/** MongoDB expression: effective monthly usage (handles month rollover). */
const effectiveCountExpression = (firstDayOfMonth) => ({
    $cond: {
        if: {
            $or: [
                { $eq: [{ $ifNull: ["$lastRequestDate", null] }, null] },
                { $lt: ["$lastRequestDate", firstDayOfMonth] },
            ],
        },
        then: 0,
        else: "$requestsThisMonth",
    },
});
exports.effectiveCountExpression = effectiveCountExpression;
/** MongoDB expression: tier limit read from the same document in one atomic update. */
const subscriptionLimitExpression = () => ({
    $switch: {
        branches: [
            {
                case: { $eq: ["$subscriptionType", "pro"] },
                then: ai_model_request_limit_1.REQUEST_LIMITS.pro,
            },
            {
                case: { $eq: ["$subscriptionType", "premium"] },
                then: ai_model_request_limit_1.REQUEST_LIMITS.premium,
            },
        ],
        default: ai_model_request_limit_1.REQUEST_LIMITS.free,
    },
});
exports.subscriptionLimitExpression = subscriptionLimitExpression;
/**
 * Atomically reserves one monthly request slot.
 * Tier limit and usage count are evaluated from the document in a single findOneAndUpdate.
 */
const reserveUserQuota = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const firstDayOfMonth = (0, exports.getFirstDayOfMonth)();
    const now = new Date();
    const effectiveCount = (0, exports.effectiveCountExpression)(firstDayOfMonth);
    const reserved = yield user_model_1.User.findOneAndUpdate({
        email,
        $expr: {
            $lt: [effectiveCount, (0, exports.subscriptionLimitExpression)()],
        },
    }, [
        {
            $set: {
                requestsThisMonth: { $add: [effectiveCount, 1] },
                lastRequestDate: now,
            },
        },
    ], { new: true });
    if (!reserved) {
        const userExists = yield user_model_1.User.exists({ email });
        if (!userExists) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
        }
        throw new api_error_1.default(http_status_1.default.CONFLICT, "Monthly request limit exceeded!");
    }
});
exports.reserveUserQuota = reserveUserQuota;
/**
 * Refunds a previously reserved slot (idempotent when paired with QuotaRefundGuard).
 */
const refundUserQuota = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.User.findOneAndUpdate({ email, requestsThisMonth: { $gt: 0 } }, [
        {
            $set: {
                requestsThisMonth: {
                    $max: [0, { $subtract: ["$requestsThisMonth", 1] }],
                },
            },
        },
    ]);
});
exports.refundUserQuota = refundUserQuota;
/**
 * Atomically reserves one guest free-generation slot (persisted in MongoDB).
 */
const reserveGuestQuota = (guestId) => __awaiter(void 0, void 0, void 0, function* () {
    const reserved = yield guest_usage_model_1.GuestUsage.findOneAndUpdate({ guestId, requestCount: { $lt: exports.FREE_GUEST_LIMIT } }, {
        $inc: { requestCount: 1 },
        $set: { lastRequestAt: new Date() },
    }, { new: true, upsert: true, setDefaultsOnInsert: true });
    if (!reserved) {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "You have reached the maximum limit of 3 story generations.");
    }
});
exports.reserveGuestQuota = reserveGuestQuota;
const refundGuestQuota = (guestId) => __awaiter(void 0, void 0, void 0, function* () {
    yield guest_usage_model_1.GuestUsage.findOneAndUpdate({ guestId, requestCount: { $gt: 0 } }, [
        {
            $set: {
                requestCount: {
                    $max: [0, { $subtract: ["$requestCount", 1] }],
                },
            },
        },
    ]);
});
exports.refundGuestQuota = refundGuestQuota;
const isSuccessfulGeneration = (result) => Array.isArray(result) && result.length > 0;
exports.isSuccessfulGeneration = isSuccessfulGeneration;
