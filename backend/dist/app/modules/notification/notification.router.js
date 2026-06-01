"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.get("/", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.USER), notification_controller_1.NotificationController.getUserNotifications);
router.patch("/:id/read", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.USER), notification_controller_1.NotificationController.markNotificationAsRead);
exports.NotificationRouter = router;
