import React, { createContext, useContext, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { socketIo } from "./socket.oi";
import { isLoggedIn } from "../services/auth.service";
import { AUTH_KEY } from "../constants/storage-key";

/**
 * SocketContext provides a stable reference to the singleton Socket.IO client.
 *
 * The connection lifecycle is managed here at the app root so that
 * individual hooks/components can subscribe to events without risking
 * premature disconnects when any single consumer unmounts.
 */
const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isConnected = useRef(false);

  useEffect(() => {
    const authed = isLoggedIn();
    if (!authed) {
      // If the user is not authenticated, ensure the socket is disconnected
      if (isConnected.current) {
        socketIo.disconnect();
        isConnected.current = false;
      }
      return;
    }

    // Always refresh the auth token before connecting so we never send
    // the stale token that was captured at module-load time.
    socketIo.auth = { token: localStorage.getItem(AUTH_KEY) || "" };

    if (!socketIo.connected) {
      socketIo.connect();
      isConnected.current = true;
    }

    return () => {
      socketIo.disconnect();
      isConnected.current = false;
    };
  }, []);

  return (
    <SocketContext.Provider value={socketIo}>{children}</SocketContext.Provider>
  );
};
