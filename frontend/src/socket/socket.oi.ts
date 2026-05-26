import { io } from "socket.io-client";
import { getFromLocalStorage } from "../utils/local-storage";
import { AUTH_KEY } from "../constants/storage-key";
import { resolveSocketUrl } from "../helpers/socket-url";

export const socketIo = io(resolveSocketUrl(), {
  transports: ["websocket", "polling"],
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  auth: { token: getFromLocalStorage(AUTH_KEY) },
  withCredentials: true,
});
