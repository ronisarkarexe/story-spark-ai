"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("./post.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const check_request_limit_1 = __importDefault(require("../../middleware/check.request.limit"));
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const post_validation_1 = require("./post.validation");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
/* ============================================================
   SYSTEM LAYOUT CONFIGURATIONS & CORE INBOUND PUBLIC ENTRIES
   ============================================================ */
router.post("/create-post", (0, auth_middleware_1.default)(), (0, validate_request_1.default)(post_validation_1.PostValidator.createPost), post_controller_1.PostController.createPost);
router.get("/", post_controller_1.PostController.getPosts);
router.get("/latest-posts", post_controller_1.PostController.getLatestPosts);
router.get("/featured-posts", post_controller_1.PostController.getFeaturedPosts);
router.patch("/featured/:postId", (0, auth_middleware_1.default)(), post_controller_1.PostController.doFeaturedPosts);
router.get("/:id", post_controller_1.PostController.getSinglePost);
router.get("/tag/:tag", post_controller_1.PostController.getPostsByTag);
router.patch("/bookmark/:id", (0, auth_middleware_1.default)(), post_controller_1.PostController.toggleBookmark);
router.patch("/:id", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(post_validation_1.PostValidator.updatePost), post_controller_1.PostController.updatePost);
router.delete("/:id", (0, auth_middleware_1.default)(), post_controller_1.PostController.deletePost);
/* ============================================================
   PATCHED MODULE ROUTES — GSSoC '26 RESOURCE MANAGEMENT
   ============================================================ */
/**
 * @route   POST /api/v1/post/remix
 * @desc    Remix an existing story prompt variant using AI models
 * @access  Private (Quota Monitored)
 */
router.post("/remix", (0, auth_middleware_1.default)(), (0, check_request_limit_1.default)(), post_controller_1.PostController.remixStory);
/**
 * @route   POST /api/v1/post/translate
 * @desc    Translate generated story variations across languages
 * @access  Private (Quota Monitored)
 */
router.post("/translate", (0, auth_middleware_1.default)(), (0, check_request_limit_1.default)(), post_controller_1.PostController.translateStory);
exports.PostRouter = router;
