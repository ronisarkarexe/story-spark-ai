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
exports.PostController = void 0;
const route_param_1 = require("../../../shared/route_param");
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const token_1 = require("../../middleware/token");
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const http_status_1 = __importDefault(require("http-status"));
const post_service_1 = require("./post.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const post_constant_1 = require("./post.constant");
const pagination_1 = require("../../../constants/pagination");
const createPost = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postData = req.body;
    const token = yield (0, token_1.getToken)(req);
    const result = yield post_service_1.PostService.createPost(postData, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post created successfully!",
        data: result,
    });
}));
const getPosts = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, post_constant_1.postFilterFields);
    const pagination = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield post_service_1.PostService.getPosts(filters, pagination);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Posts fetched successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const getPublishedPostsByAuthor = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.getToken)(req);
    const filters = (0, pick_1.default)(req.query, ["searchTerm"]);
    const pagination = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield post_service_1.PostService.getPublishedPostsByAuthor(token, filters, pagination);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Published stories fetched successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
const getLatestPosts = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostService.getLatestPosts();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Posts fetched successfully!",
        data: result,
    });
}));
const getFeaturedPosts = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostService.getFeaturedPosts();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Posts fetched successfully!",
        data: result,
    });
}));
const doFeaturedPosts = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = (0, route_param_1.routeParam)(req.params.postId);
    const result = yield post_service_1.PostService.doFeaturedPosts(postId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Added to featured posts!",
        data: result,
    });
}));
const getSinglePost = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, route_param_1.routeParam)(req.params.id);
    const result = yield post_service_1.PostService.getSinglePost(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post fetched successfully!",
        data: result,
    });
}));
const getPostsByTag = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = (0, route_param_1.routeParam)(req.params.tag);
    const excludeId = req.query.excludeId;
    const result = yield post_service_1.PostService.getPostsByTag(tag, excludeId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post fetched successfully!",
        data: result,
    });
}));
const toggleBookmark = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, route_param_1.routeParam)(req.params.id);
    const token = yield (0, token_1.getToken)(req);
    const result = yield post_service_1.PostService.toggleBookmark(id, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
const updatePost = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, route_param_1.routeParam)(req.params.id);
    const postData = req.body;
    const token = yield (0, token_1.getToken)(req);
    const result = yield post_service_1.PostService.updatePost(id, postData, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Post updated successfully!",
        data: result,
    });
}));
const deletePost = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, route_param_1.routeParam)(req.params.id);
    const token = yield (0, token_1.getToken)(req);
    const result = yield post_service_1.PostService.deletePost(id, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story removed successfully!",
        data: result,
    });
}));
/* ============================================================
   PATCHED CONTROLLERS — GSSoC '26 QUOTA INTERCEPTION
   ============================================================ */
const remixStory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, prompt } = req.body;
    const token = yield (0, token_1.getToken)(req);
    // Passes context forward to trigger AI generation and reserve token balance metrics simultaneously
    const result = yield post_service_1.PostService.remixStory(postId, prompt, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story remixed successfully!",
        data: result,
    });
}));
const translateStory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, language } = req.body;
    const token = yield (0, token_1.getToken)(req);
    // Passes context forward to trigger language engine mutations and check quota boundaries
    const result = yield post_service_1.PostService.translateStory(postId, language, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story translated successfully!",
        data: result,
    });
}));
exports.PostController = {
    createPost,
    getPosts,
    getPublishedPostsByAuthor,
    getLatestPosts,
    getFeaturedPosts,
    doFeaturedPosts,
    getSinglePost,
    getPostsByTag,
    toggleBookmark,
    updatePost,
    deletePost,
    remixStory, // Exposed remix utility route hook
    translateStory, // Exposed translation engine route hook
};
