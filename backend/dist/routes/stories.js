"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const validate_request_1 = __importDefault(require("../app/middleware/validate.request"));
const storyBranchingController_1 = require("../controllers/storyBranchingController");
const auth_middleware_1 = __importDefault(require("../app/middleware/auth.middleware"));
const user_1 = require("../enums/user");
const router = express_1.default.Router();
const branchingStorySchema = zod_1.z.object({
    body: zod_1.z.object({
        storyContext: zod_1.z.string({ required_error: "storyContext is required!" }).max(8000),
        selectedChoice: zod_1.z.string({ required_error: "selectedChoice is required!" }),
        genre: zod_1.z.string().max(120).optional(),
    }),
});
router.post("/branching", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(branchingStorySchema), storyBranchingController_1.StoryBranchingController.createBranchingStory);
exports.StoriesRouter = router;
