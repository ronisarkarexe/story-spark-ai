/* eslint-disable */
import { io, Socket } from "socket.io-client";
import { getToken } from "../services/auth.service";
import { resolveSocketUrl } from "../helpers/socket-url";

let socketIoInstance: Socket | null = null;
let tokenCheckInterval: any = null;

const startTokenCheck = (socket: Socket) => {
  if (tokenCheckInterval) clearInterval(tokenCheckInterval);
  tokenCheckInterval = setInterval(() => {
    const currentToken = getToken();
    if (currentToken && socket.auth && (socket.auth as any).token !== currentToken) {
      console.log("[Story Spark] Socket.IO token refresh detected. Re-authenticating...");
      socket.auth = { token: currentToken };
      if (socket.connected) {
        socket.disconnect().connect();
      }
    }
  }, 10000);
};

const stopTokenCheck = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }
};

export const getSocketIo = (): Socket | null => {
  return socketIoInstance;
};

export const connectSocket = (): Socket | null => {
  const token = getToken();
  if (!token) {
    console.warn("[Story Spark] User not authenticated. Cannot connect to Socket.IO.");
    return null;
  }

  if (socketIoInstance && socketIoInstance.connected) {
    if (socketIoInstance.auth && (socketIoInstance.auth as any).token !== token) {
      console.log("[Story Spark] Updating active socket connection with refreshed token.");
      socketIoInstance.auth = { token };
      socketIoInstance.disconnect().connect();
    }
    return socketIoInstance;
  }

  const socketUrl = resolveSocketUrl();
  if (!socketUrl) {
    console.warn("[Story Spark] Socket.IO URL not configured. Real-time notifications disabled.");
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
    startTokenCheck(socketIoInstance!);
  });

  socketIoInstance.on("reconnect_attempt", () => {
    const freshToken = getToken();
    if (freshToken && socketIoInstance) {
      socketIoInstance.auth = { token: freshToken };
    }
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
  stopTokenCheck();
  if (socketIoInstance && socketIoInstance.connected) {
    socketIoInstance.disconnect();
    socketIoInstance = null;
  }
};