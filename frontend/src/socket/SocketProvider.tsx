import React, { createContext, useContext, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket, getSocketIo } from "./socket.oi";
import { isLoggedIn } from "../services/auth.service";

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
        disconnectSocket();
        isConnected.current = false;
      }
      return;
    }

    const socket = connectSocket();
    if (socket) {
      isConnected.current = true;
    }

    return () => {
      disconnectSocket();
      isConnected.current = false;
    };
  }, []);

  return (
    <SocketContext.Provider value={getSocketIo()}>{children}</SocketContext.Provider>
  );
};
