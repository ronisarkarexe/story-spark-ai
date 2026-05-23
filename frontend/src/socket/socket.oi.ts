import { io } from "socket.io-client";
import { getAccessToken } from "../services/auth.service";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  "https://notification-socket-io.onrender.com";

export const socketIo = io(socketUrl, {
  transports: ["websocket", "polling"],
  autoConnect: false,
  auth: { token: getAccessToken() },
  withCredentials: true,
});
