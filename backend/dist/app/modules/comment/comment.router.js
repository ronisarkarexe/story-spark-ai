"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRouter = void 0;
const express_1 = __importDefault(require("express"));
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const user_1 = require("../../../enums/user");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const comment_controller_1 = require("./comment.controller");
const comment_validation_1 = require("./comment.validation");
const router = express_1.default.Router();
// Create a new comment
router.post("/create", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validate_request_1.default)(comment_validation_1.CommentValidator.createComment), comment_controller_1.CommentController.createComment);
// Get comments by postId
router.get("/get-comments/:postId", comment_controller_1.CommentController.getCommentsByPostId);
// Toggle like on a comment
router.patch("/toggle-like/commentId=:commentId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), comment_controller_1.CommentController.toggleCommentLike);
exports.CommentRouter = router;
