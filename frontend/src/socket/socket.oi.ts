/* eslint-disable */
import { io, Socket } from "socket.io-client";
import { getFromLocalStorage } from "../utils/local-storage";
import { AUTH_KEY } from "../constants/storage-key";
import { resolveSocketUrl } from "../helpers/socket-url";

let socketIoInstance: Socket | null = null;

export const getSocketIo = (): Socket | null => {
  return socketIoInstance;
};

export const connectSocket = (): Socket | null => {
  if (socketIoInstance && socketIoInstance.connected) {
    return socketIoInstance;
  }

  const socketUrl = resolveSocketUrl();
  if (!socketUrl) {
    console.warn("[Story Spark] Socket.IO URL not configured. Real-time notifications disabled.");
    return null;
  }

  const token = getFromLocalStorage(AUTH_KEY);
  if (!token) {
    console.warn("[Story Spark] User not authenticated. Cannot connect to Socket.IO.");
    return null;
  }

  socketIoInstance = io(socketUrl, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    auth: { token },
    withCredentials: true,
  });

  socketIoInstance.on("connect", () => {
    console.log("[Story Spark] Socket.IO connected");
  });

  socketIoInstance.on("disconnect", () => {
    console.log("[Story Spark] Socket.IO disconnected");
  });

  socketIoInstance.on("connect_error", (error: any) => {
    console.warn("[Story Spark] Socket.IO connection error:", error);
  });

  socketIoInstance.connect();
  return socketIoInstance;
};

export const disconnectSocket = (): void => {
  if (socketIoInstance && socketIoInstance.connected) {
    socketIoInstance.disconnect();
    socketIoInstance = null;
  }
};
