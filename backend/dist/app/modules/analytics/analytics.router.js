"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRouter = void 0;
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("./analytics.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.get("/overview", analytics_controller_1.AnalyticsController.getAnalyticsOverview);
router.get("/heatmap", analytics_controller_1.AnalyticsController.getHeatmap);
router.get("/genres", analytics_controller_1.AnalyticsController.getGenreDistribution);
router.get("/wordcloud", analytics_controller_1.AnalyticsController.getWordCloud);
router.get("/productive-hours", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER), analytics_controller_1.AnalyticsController.getProductiveHours);
router.get("/emotion-distribution", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER), analytics_controller_1.AnalyticsController.getEmotionDistribution);
router.get("/mood-timeline", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER), analytics_controller_1.AnalyticsController.getMoodTimeline);
exports.AnalyticsRouter = router;
