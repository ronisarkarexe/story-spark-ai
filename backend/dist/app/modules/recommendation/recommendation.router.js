"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationRouter = void 0;
const express_1 = __importDefault(require("express"));
const recommendation_controller_1 = require("./recommendation.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.get("/personalized", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER), recommendation_controller_1.RecommendationController.getPersonalizedRecommendations);
exports.RecommendationRouter = router;
