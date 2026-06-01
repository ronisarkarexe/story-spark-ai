"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const bookmark_controller_1 = require("./bookmark.controller");
const router = express_1.default.Router();
// Toggle bookmark (add/remove)
router.post("/:storyId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), bookmark_controller_1.BookmarkController.toggleBookmark);
// Get user's bookmarked stories
router.get("/", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), bookmark_controller_1.BookmarkController.getBookmarks);
// Check if a specific story is bookmarked
router.get("/status/:storyId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), bookmark_controller_1.BookmarkController.checkBookmarkStatus);
// Delete bookmark directly
router.delete("/:storyId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), bookmark_controller_1.BookmarkController.deleteBookmark);
exports.BookmarkRouter = router;
