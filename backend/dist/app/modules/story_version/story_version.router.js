"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryVersionRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const story_version_controller_1 = require("./story_version.controller");
const router = express_1.default.Router();
// Retrieve all versions of a story
router.get("/:id/versions", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), story_version_controller_1.StoryVersionController.getVersionsByStoryId);
// Retrieve a specific version snapshot
router.get("/version/:versionId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), story_version_controller_1.StoryVersionController.getVersionById);
// Restore to a specific version snapshot
router.post("/version/:versionId/restore", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), story_version_controller_1.StoryVersionController.restoreVersion);
// Enhance a story prompt using AI
router.post("/enhance-prompt", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), story_version_controller_1.StoryVersionController.enhancePrompt);
exports.StoryVersionRouter = router;
