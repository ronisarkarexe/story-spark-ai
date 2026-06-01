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
exports.RecommendationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const post_model_1 = require("../post/post.model");
const user_model_1 = require("../user/user.model");
// Optimization: Define field selection constants for reuse and performance
const USER_RECOMMENDATION_FIELDS = "readingPreferences readingHistory";
const POST_RECOMMENDATION_FIELDS = "_id title imageURL author emotions genre likesCount viewsCount publishedAt createdAt";
const AUTHOR_RECOMMENDATION_FIELDS = "name profile.avatar";
const getPersonalizedRecommendations = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Optimization: Use select() and lean() for user profile retrieval
    const user = yield user_model_1.User.findById(token._id)
        .select(USER_RECOMMENDATION_FIELDS)
        .lean();
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const { readingPreferences, readingHistory } = user;
    // Base query: not deleted and published
    const query = { isDeleted: false, isPublished: true };
    // Exclude read posts
    if (readingHistory && readingHistory.length > 0) {
        query._id = { $nin: readingHistory };
    }
    let recommendations = [];
    // If user has preferences, try to match them
    if (readingPreferences) {
        const favoriteGenres = [...(readingPreferences.favoriteGenres || [])]
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(g => g.name);
        const favoriteEmotions = [...(readingPreferences.favoriteEmotions || [])]
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(e => e.name);
        if (favoriteGenres.length > 0 || favoriteEmotions.length > 0) {
            const orConditions = [];
            if (favoriteGenres.length > 0) {
                orConditions.push({ genre: { $in: favoriteGenres } });
            }
            if (favoriteEmotions.length > 0) {
                orConditions.push({ emotions: { $in: favoriteEmotions } });
            }
            const prefQuery = Object.assign(Object.assign({}, query), { $or: orConditions });
            // Optimization: Use populate with selected fields, select specific post fields, and lean()
            recommendations = (yield post_model_1.Post.find(prefQuery)
                .populate("author", AUTHOR_RECOMMENDATION_FIELDS)
                .select(POST_RECOMMENDATION_FIELDS)
                .sort({ likesCount: -1, viewsCount: -1 })
                .limit(10)
                .lean());
        }
    }
    // Fallback: If no preferences or not enough recommendations, get top popular posts
    if (recommendations.length < 10) {
        const limit = 10 - recommendations.length;
        const recommendationIds = recommendations.map(r => r._id);
        // Add existing recommendations to exclusion list to avoid duplicates
        const fallbackQuery = Object.assign(Object.assign({}, query), (recommendationIds.length > 0 && {
            _id: {
                $nin: [...(readingHistory || []), ...recommendationIds]
            }
        }));
        // Optimization: Use populate with selected fields, select specific post fields, and lean()
        const popularPosts = yield post_model_1.Post.find(fallbackQuery)
            .populate("author", AUTHOR_RECOMMENDATION_FIELDS)
            .select(POST_RECOMMENDATION_FIELDS)
            .sort({ likesCount: -1, viewsCount: -1 })
            .limit(limit)
            .lean();
        recommendations = [...recommendations, ...popularPosts];
    }
    return recommendations;
});
exports.RecommendationService = {
    getPersonalizedRecommendations,
};
