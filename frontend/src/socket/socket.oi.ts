/* eslint-disable */
import { io, Socket } from "socket.io-client";
import { getToken } from "../services/auth.service";
import { resolveSocketUrl } from "../helpers/socket-url";

const socketUrl = resolveSocketUrl();
export const socketIo = io(socketUrl || "", {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  withCredentials: true,
});

let socketIoInstance: Socket | null = socketIo;

export const getSocketIo = (): Socket | null => {
  return socketIoInstance;
};

export const connectSocket = (): Socket | null => {
  if (socketIoInstance && socketIoInstance.connected) {
    return socketIoInstance;
  }

  const token = getToken();
  if (token) {
    socketIoInstance.auth = { token };
  }

  socketIoInstance.connect();
  return socketIoInstance;
};

export const disconnectSocket = (): void => {
  if (socketIoInstance) {
    socketIoInstance.disconnect();
  }
};