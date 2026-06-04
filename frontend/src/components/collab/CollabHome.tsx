import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function CollabHome() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!SOCKET_URL) {
      setError("VITE_SOCKET_URL is missing in .env file");
      return;
    }

    // Prevent duplicate socket connections (VERY IMPORTANT)
    if (socketRef.current) return;

    try {
      const socket: Socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);
        setError("");
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        setConnected(false);
        console.log("Socket disconnected");
      });

      socket.on("connect_error", () => {
        setError(
          "Socket connection failed. Check backend or VITE_SOCKET_URL."
        );
      });
    } catch (err) {
      console.error(err);
      setError("Socket initialization failed");
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Collaboration Room</h1>

      <p className="mb-2">
        Status:{" "}
        <span className={connected ? "text-green-400" : "text-red-400"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </p>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
          {error}
        </p>
      )}
    </div>
  );
}