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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const post_model_1 = require("./post.model");
const pagination_helper_1 = __importDefault(require("../../../utils/pagination_helper"));
const post_constant_1 = require("./post.constant");
const createPost = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = token;
    const user = yield user_model_1.User.findOne({
        email: email,
        role: role,
    });
    if (!user) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    }
    try {
        const res = yield post_model_1.Post.create(Object.assign(Object.assign({}, payload), { author: user._id, updatedBy: user._id }));
        if (res) {
            user.postsCount += 1;
            yield user.save();
        }
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create post");
    }
});
const getPosts = (filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, orderBy } = (0, pagination_helper_1.default)(pagination);
    const { searchTerm, trendingTopic, sortFilter, genres } = filters, filterData = __rest(filters, ["searchTerm", "trendingTopic", "sortFilter", "genres"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: post_constant_1.postSearchFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (trendingTopic) {
        andCondition.push({
            "topic.title": trendingTopic,
        });
    }
    if (genres && genres.length > 0) {
        andCondition.push({
            tag: { $in: genres },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    // sort condition
    const sortCondition = {};
    if (sortFilter === "mostPopular") {
        sortCondition.likesCount = -1;
    }
    if (sortBy && orderBy) {
        sortCondition[sortBy] = orderBy;
    }
    const result = yield post_model_1.Post.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .populate("author", "name email createdAt")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
    });
    const total = yield post_model_1.Post.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getLatestPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield post_model_1.Post.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .populate("author", "name email createdAt")
            .populate({
            path: "reactions",
            populate: { path: "userId", select: "email" },
        });
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get latest posts");
    }
});
const getFeaturedPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield post_model_1.Post.find({ isFeaturedPost: true })
            .sort({ createdAt: -1, updatedBy: -1 })
            .limit(2)
            .populate("author", "name email createdAt")
            .populate({
            path: "reactions",
            populate: { path: "userId", select: "email" },
        });
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to get featured posts");
    }
});
const doFeaturedPosts = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield post_model_1.Post.findByIdAndUpdate(postId, { isFeaturedPost: true }, { new: true });
        return res;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to approve featured posts");
    }
});
const getSinglePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const postById = yield post_model_1.Post.findOne({ _id: id })
        .populate("author", "name email createdAt")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
    });
    if (!postById) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Post not found!");
    }
    return postById;
});
const getPostsByTag = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.find({ tag })
        .limit(2)
        .populate("author", "name email createdAt")
        .populate({
        path: "reactions",
        populate: { path: "userId", select: "email" },
    });
    return result;
});
exports.PostService = {
    createPost,
    getPosts,
    getLatestPosts,
    getFeaturedPosts,
    doFeaturedPosts,
    getSinglePost,
    getPostsByTag,
};
