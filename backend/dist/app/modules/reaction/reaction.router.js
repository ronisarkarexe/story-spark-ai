"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const reaction_controller_1 = require("./reaction.controller");
const router = express_1.default.Router();
router.post("/toggle", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), reaction_controller_1.ReactionController.toggleReaction);
exports.ReactionRouter = router;
