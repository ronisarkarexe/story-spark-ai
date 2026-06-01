"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const notification_model_1 = require("./notification.model");
const notification_socket_1 = require("../../../socket/notification.socket");
const createNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.Notification.create(payload);
    (0, notification_socket_1.emitNotificationToUser)(notification.userId.toString(), notification);
    return notification;
});
const resolveUserId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token.userId) {
        return token.userId;
    }
    const user = yield user_model_1.User.findOne({ email: token.email }).select("_id");
    if (!user) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    return user._id.toString();
});
const getUserNotifications = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield resolveUserId(token);
    const notifications = yield notification_model_1.Notification.find({ userId }).sort({
        createdAt: -1,
    });
    return notifications;
});
const markNotificationAsRead = (notificationId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield resolveUserId(token);
    const notification = yield notification_model_1.Notification.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true });
    if (!notification) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Notification not found!");
    }
    return notification;
});
exports.NotificationService = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    resolveUserId,
};
