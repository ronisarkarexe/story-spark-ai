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
exports.CommentController = void 0;
const route_param_1 = require("../../../shared/route_param");
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const comment_service_1 = require("./comment.service");
const token_1 = require("../../middleware/token");
const http_status_1 = __importDefault(require("http-status"));
const createComment = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.getToken)(req);
    const result = yield comment_service_1.CommentService.createComment(req.body, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Comment created successfully!",
        data: result,
    });
}));
const getCommentsByPostId = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = (0, route_param_1.routeParam)(req.params.postId);
    const result = yield comment_service_1.CommentService.getCommentsByPostId(postId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Comments fetched successfully!",
        data: result,
    });
}));
const toggleCommentLike = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = (0, route_param_1.routeParam)(req.params.commentId);
    const token = yield (0, token_1.getToken)(req);
    const result = yield comment_service_1.CommentService.toggleCommentLike(commentId, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Comment like toggled successfully!",
        data: result,
    });
}));
exports.CommentController = {
    createComment,
    getCommentsByPostId,
    toggleCommentLike,
};
