export const resolveSocketUrl = (): string => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (!socketUrl && import.meta.env.DEV) {
    console.warn(
      "[Story Spark] VITE_SOCKET_URL is unset. Copy frontend/.env.example to frontend/.env and set the Socket.IO server URL."
    );
  }
  return socketUrl ?? "";
};
