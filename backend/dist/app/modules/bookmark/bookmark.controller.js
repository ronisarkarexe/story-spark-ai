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
exports.BookmarkController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const route_param_1 = require("../../../shared/route_param");
const token_1 = require("../../middleware/token");
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const bookmark_service_1 = require("./bookmark.service");
const toggleBookmark = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = (0, route_param_1.routeParam)(req.params.storyId);
    const token = yield (0, token_1.getToken)(req);
    const result = yield bookmark_service_1.BookmarkService.toggleBookmark(storyId, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: { isBookmarked: result.isBookmarked },
    });
}));
const getBookmarks = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const token = yield (0, token_1.getToken)(req);
    const result = yield bookmark_service_1.BookmarkService.getBookmarks(token, page, limit);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bookmarks fetched successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const checkBookmarkStatus = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = (0, route_param_1.routeParam)(req.params.storyId);
    const token = yield (0, token_1.getToken)(req);
    const result = yield bookmark_service_1.BookmarkService.checkBookmarkStatus(storyId, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bookmark status checked successfully!",
        data: result,
    });
}));
const deleteBookmark = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = (0, route_param_1.routeParam)(req.params.storyId);
    const token = yield (0, token_1.getToken)(req);
    const result = yield bookmark_service_1.BookmarkService.deleteBookmark(storyId, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
    });
}));
exports.BookmarkController = {
    toggleBookmark,
    getBookmarks,
    checkBookmarkStatus,
    deleteBookmark,
};
