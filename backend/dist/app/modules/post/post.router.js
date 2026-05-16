"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("./post.controller");
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const post_validation_1 = require("./post.validation");
const user_1 = require("../../../enums/user");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const router = express_1.default.Router();
// Create a new post
router.post("/create", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validate_request_1.default)(post_validation_1.PostValidator.createPost), post_controller_1.PostController.createPost);
// Get Posts
router.get("/lists", post_controller_1.PostController.getPosts);
router.get("/platform-stats", post_controller_1.PostController.getPlatformStats);
router.get("/latest-lists", post_controller_1.PostController.getLatestPosts);
router.get("/feature-lists", post_controller_1.PostController.getFeaturedPosts);
router.post("/:postId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), post_controller_1.PostController.doFeaturedPosts);
router.get("/:id", post_controller_1.PostController.getSinglePost);
router.get("/tag/:tag", post_controller_1.PostController.getPostsByTag);
exports.PostRouter = router;
