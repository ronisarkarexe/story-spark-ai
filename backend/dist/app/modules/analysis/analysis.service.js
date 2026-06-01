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
exports.AnalysisService = void 0;
const subscription_type_1 = require("../../../enums/subscription_type");
const user_1 = require("../../../enums/user");
const user_status_1 = require("../../../enums/user_status");
const post_model_1 = require("../post/post.model");
const user_model_1 = require("../user/user.model");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
const writer_application_model_1 = require("../writer_application/writer_application.model");
const getDashboardAnalysis = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    // If Admin or Super Admin, return global dashboard analysis
    if (role === user_1.ENUM_USER_ROLE.ADMIN || role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        const [totalUsers, activeUsers, inactiveUsers, blockedUsers, writers, applyForWriter, freeUsers, proUsers, premiumUsers, totalPosts, publishedPosts, featuredPosts, postsPerMonthAgg, topicCountAgg,] = yield Promise.all([
            user_model_1.User.countDocuments({}),
            user_model_1.User.countDocuments({ status: user_status_1.USER_STATUS.ACTIVE }),
            user_model_1.User.countDocuments({ status: user_status_1.USER_STATUS.INACTIVE }),
            user_model_1.User.countDocuments({ status: user_status_1.USER_STATUS.BLOCKED }),
            user_model_1.User.countDocuments({ role: user_1.ENUM_USER_ROLE.WRITER }),
            user_model_1.User.countDocuments({ isApplyForWriter: true, role: user_1.ENUM_USER_ROLE.USER }),
            user_model_1.User.countDocuments({ subscriptionType: subscription_type_1.SUBSCRIPTION_TYPE.FREE, role: { $in: [user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER] } }),
            user_model_1.User.countDocuments({ subscriptionType: subscription_type_1.SUBSCRIPTION_TYPE.PRO, role: { $in: [user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER] } }),
            user_model_1.User.countDocuments({ subscriptionType: subscription_type_1.SUBSCRIPTION_TYPE.PREMIUM, role: { $in: [user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER] } }),
            post_model_1.Post.countDocuments({}),
            post_model_1.Post.countDocuments({ isPublished: true }),
            post_model_1.Post.countDocuments({ isFeaturedPost: true }),
            post_model_1.Post.aggregate([
                { $match: { publishedAt: { $exists: true, $ne: null } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            post_model_1.Post.aggregate([
                { $unwind: "$topic" },
                {
                    $group: {
                        _id: "$topic.title",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),
        ]);
        const postsPerMonth = {};
        for (const entry of postsPerMonthAgg) {
            postsPerMonth[entry._id] = entry.count;
        }
        const topicCount = {};
        for (const entry of topicCountAgg) {
            topicCount[entry._id] = entry.count;
        }
        return {
            role,
            users: { total: totalUsers, active: activeUsers, inactive: inactiveUsers, blocked: blockedUsers, writers, applyForWriter },
            subscriptionTypes: { free: freeUsers, pro: proUsers, premium: premiumUsers },
            posts: { total: totalPosts, published: publishedPosts, featured: featuredPosts, perMonth: postsPerMonth, topics: topicCount },
        };
    }
    // If standard user or writer, return personal/writer metrics
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Fetch their writer applications if any
    const latestApp = yield writer_application_model_1.WriterApplication.findOne({ user: user._id }).sort({ createdAt: -1 });
    let applicationStatus = "Not Applied";
    if (user.role === user_1.ENUM_USER_ROLE.WRITER || user.role === user_1.ENUM_USER_ROLE.ADMIN || user.role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        applicationStatus = "Approved";
    }
    else if (latestApp) {
        applicationStatus = latestApp.status.charAt(0).toUpperCase() + latestApp.status.slice(1);
    }
    if (role === user_1.ENUM_USER_ROLE.WRITER) {
        const writerPosts = yield post_model_1.Post.find({ author: user._id, isDeleted: false });
        const totalReaders = writerPosts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
        const totalPosts = writerPosts.length;
        // Monthly posts for this specific writer
        const postsPerMonthAgg = yield post_model_1.Post.aggregate([
            { $match: { author: user._id, isDeleted: false, publishedAt: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$publishedAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Topic counts for this specific writer
        const topicCountAgg = yield post_model_1.Post.aggregate([
            { $match: { author: user._id, isDeleted: false } },
            { $unwind: "$topic" },
            {
                $group: {
                    _id: "$topic.title",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);
        const postsPerMonth = {};
        for (const entry of postsPerMonthAgg) {
            postsPerMonth[entry._id] = entry.count;
        }
        const topicCount = {};
        for (const entry of topicCountAgg) {
            topicCount[entry._id] = entry.count;
        }
        return {
            role,
            writerStats: {
                totalReaders,
                totalPosts,
                subscriptionStatus: user.subscriptionType.toUpperCase(),
                applicationStatus,
                gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
            },
            posts: {
                perMonth: postsPerMonth,
                topics: topicCount,
            }
        };
    }
    // Else standard user
    return {
        role,
        userStats: {
            subscriptionStatus: user.subscriptionType.toUpperCase(),
            applicationStatus,
            gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
        }
    };
});
exports.AnalysisService = {
    getDashboardAnalysis,
};
