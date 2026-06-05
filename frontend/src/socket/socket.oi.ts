import { io, Socket } from "socket.io-client";
import { getFromLocalStorage } from "../utils/local-storage";
import { AUTH_KEY } from "../constants/storage-key";
import { resolveSocketUrl } from "../helpers/socket-url";

let socketIoInstance: Socket | null = null;
let collabSocketIoInstance: Socket | null = null;

const buildNamespaceUrl = (baseUrl: string, namespace: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedNamespace = namespace.startsWith("/") ? namespace : `/${namespace}`;
  return `${normalizedBase}${normalizedNamespace}`;
};

const createSocketInstance = (url: string): Socket | null => {
  const token = getFromLocalStorage(AUTH_KEY);
  if (!token) {
    console.warn("[Story Spark] User not authenticated. Cannot connect to Socket.IO.");
    return null;
  }

  const socket = io(url, {
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    auth: { token },
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("[Story Spark] Socket.IO connected:", url);
  });

  socket.on("disconnect", () => {
    console.log("[Story Spark] Socket.IO disconnected:", url);
  });

  socket.on("connect_error", (error) => {
    console.warn("[Story Spark] Socket.IO connection error:", error);
  });

  socket.connect();
  return socket;
};

export const getSocketIo = (): Socket | null => socketIoInstance;
export const getCollabSocketIo = (): Socket | null => collabSocketIoInstance;

export const connectSocket = (): Socket | null => {
  if (socketIoInstance && socketIoInstance.connected) {
    return socketIoInstance;
  }

  const socketUrl = resolveSocketUrl();
  if (!socketUrl) {
    console.warn("[Story Spark] Socket.IO URL not configured. Real-time notifications disabled.");
    return null;
  }

  socketIoInstance = createSocketInstance(socketUrl);
  return socketIoInstance;
};

export const connectCollabSocket = (): Socket | null => {
  if (collabSocketIoInstance && collabSocketIoInstance.connected) {
    return collabSocketIoInstance;
  }

  const socketUrl = resolveSocketUrl();
  if (!socketUrl) {
    console.warn("[Story Spark] Socket.IO URL not configured. Collaboration disabled.");
    return null;
  }

  collabSocketIoInstance = createSocketInstance(buildNamespaceUrl(socketUrl, "/collab"));
  return collabSocketIoInstance;
};

export const disconnectSocket = (): void => {
  if (socketIoInstance) {
    socketIoInstance.disconnect();
    socketIoInstance = null;
  }
};

export const disconnectCollabSocket = (): void => {
  if (collabSocketIoInstance) {
    collabSocketIoInstance.disconnect();
    collabSocketIoInstance = null;
  }
};
