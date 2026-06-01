"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryInspirationRouter = void 0;
const express_1 = __importDefault(require("express"));
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const story_inspiration_controller_1 = require("./story_inspiration.controller");
const story_inspiration_validation_1 = require("./story_inspiration.validation");
const router = express_1.default.Router();
router.post("/", (0, validate_request_1.default)(story_inspiration_validation_1.StoryInspirationValidation.createStoryInspirationSchema), story_inspiration_controller_1.StoryInspirationController.createStoryInspiration);
exports.StoryInspirationRouter = router;
