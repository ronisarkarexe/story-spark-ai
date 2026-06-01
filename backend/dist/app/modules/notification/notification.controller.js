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
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
const route_param_1 = require("../../../shared/route_param");
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const http_status_1 = __importDefault(require("http-status"));
const getUserNotifications = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.user;
    const result = yield notification_service_1.NotificationService.getUserNotifications(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notifications fetched successfully!",
        data: result,
    });
}));
const markNotificationAsRead = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = (0, route_param_1.routeParam)(req.params.id);
    const token = req.user;
    const result = yield notification_service_1.NotificationService.markNotificationAsRead(notificationId, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Notification marked as read successfully!",
        data: result,
    });
}));
exports.NotificationController = {
    getUserNotifications,
    markNotificationAsRead,
};
