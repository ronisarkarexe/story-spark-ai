"use strict";
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
const createReview = async (payload, token) => {
    const result = await review_model_1.Review.create({
        ...payload,
        userId: token._id,
    });
    // Invalidate cache (best-effort)
    if (redis_client_1.default.status === "ready") {
        try {
            await redis_client_1.default.del(PUBLISHED_REVIEWS_KEY);
        }
        catch (err) {
            console.warn("Redis DEL failed (createReview):", err);
        }
    }
    return result;
};
const getPublishedReviews = async () => {
    // Try cache first
    if (redis_client_1.default.status === "ready") {
        try {
            const cached = await redis_client_1.default.get(PUBLISHED_REVIEWS_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (err) {
            console.warn("Redis GET failed (getPublishedReviews):", err);
        }
    }
    // Fallback to DB
    const result = await review_model_1.Review.find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();
    // Populate cache (best-effort)
    if (redis_client_1.default.status === "ready") {
        try {
            await redis_client_1.default.set(PUBLISHED_REVIEWS_KEY, JSON.stringify(result), "EX", REVIEWS_CACHE_TTL);
        }
        catch (err) {
            console.warn("Redis SET failed (getPublishedReviews):", err);
        }
    }
    return result;
};
const getPendingReviews = async () => {
    const result = await review_model_1.Review.find({
        isPublished: false,
    }).sort({ createdAt: -1 });
    return result;
};
const approveReview = async (id) => {
    const result = await review_model_1.Review.findByIdAndUpdate(id, {
        isPublished: true,
    }, {
        new: true,
    });
    if (!result) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Review not found!");
    }
    // Invalidate cache (best-effort)
    try {
        await redis_client_1.default.del(PUBLISHED_REVIEWS_KEY);
    }
    catch (err) {
        console.warn("Redis DEL failed (approveReview):", err);
    }
    return result;
};
exports.ReviewService = {
    createReview,
    getPublishedReviews,
    getPendingReviews,
    approveReview,
};
