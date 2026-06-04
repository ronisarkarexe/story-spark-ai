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
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const redis_client_1 = __importDefault(require("../../utils/redis.client"));
const review_model_1 = require("./review.model");
const PUBLISHED_REVIEWS_KEY = "reviews:published:v1";
const REVIEWS_CACHE_TTL = Number(process.env.REVIEWS_CACHE_TTL) || 300; // seconds
const createReview = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.create(Object.assign(Object.assign({}, payload), { userId: token._id }));
    // Invalidate cache (best-effort)
    try {
        yield redis_client_1.default.del(PUBLISHED_REVIEWS_KEY);
    }
    catch (err) {
        console.warn("Redis DEL failed (createReview):", err);
    }
    return result;
});
const getPublishedReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    // Try cache first
    try {
        const cached = yield redis_client_1.default.get(PUBLISHED_REVIEWS_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
    }
    catch (err) {
        console.warn("Redis GET failed (getPublishedReviews):", err);
    }
    // Fallback to DB
    const result = yield review_model_1.Review.find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();
    // Populate cache (best-effort)
    try {
        yield redis_client_1.default.set(PUBLISHED_REVIEWS_KEY, JSON.stringify(result), "EX", REVIEWS_CACHE_TTL);
    }
    catch (err) {
        console.warn("Redis SET failed (getPublishedReviews):", err);
    }
    return result;
});
const getPendingReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find({
        isPublished: false,
    }).sort({ createdAt: -1 });
    return result;
});
const approveReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findByIdAndUpdate(id, {
        isPublished: true,
    }, {
        new: true,
    });
    if (!result) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Review not found!");
    }
    // Invalidate cache (best-effort)
    try {
        yield redis_client_1.default.del(PUBLISHED_REVIEWS_KEY);
    }
    catch (err) {
        console.warn("Redis DEL failed (approveReview):", err);
    }
    return result;
});
exports.ReviewService = {
    createReview,
    getPublishedReviews,
    getPendingReviews,
    approveReview,
};
