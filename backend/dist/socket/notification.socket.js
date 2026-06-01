"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotificationToUser = exports.getNotificationSocket = exports.setNotificationSocket = void 0;
let io = null;
const setNotificationSocket = (socketServer) => {
    io = socketServer;
};
exports.setNotificationSocket = setNotificationSocket;
const getNotificationSocket = () => io;
exports.getNotificationSocket = getNotificationSocket;
const emitNotificationToUser = (userId, payload) => {
    if (!io) {
        return;
    }
    io.to(`user:${userId}`).emit("notification:new", payload);
    io.to(`user:${userId}`).emit("pushNotification", payload);
};
exports.emitNotificationToUser = emitNotificationToUser;
