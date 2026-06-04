import { Server } from "socket.io";

let io: Server | null = null;

export const setNotificationSocket = (socketServer: Server) => {
  io = socketServer;
};

export const getNotificationSocket = () => io;

export const emitNotificationToUser = (userId: string, payload: unknown) => {
  if (!io) {
    return;
  }

  io.to(`user:${userId}`).emit("notification:new", payload);
  io.to(`user:${userId}`).emit("pushNotification", payload);
};

export const emitNotificationStateToUser = (
  userId: string,
  eventName: string,
  payload: unknown
) => {
  if (!io) {
    return;
  }

  io.to(`user:${userId}`).emit(eventName, payload);
};