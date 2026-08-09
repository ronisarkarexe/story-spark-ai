import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "./socket.oi";
import { isLoggedIn, authChangeEventName } from "../services/auth.service";

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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const syncSocketWithAuth = () => {
      if (!isLoggedIn()) {
        disconnectSocket();
        setSocket(null);
        return;
      }
      const s = connectSocket();
      setSocket(s);
    };

    // Initial connection state on mount
    syncSocketWithAuth();

    // Re-sync whenever login/logout happens elsewhere in the app
    window.addEventListener(authChangeEventName, syncSocketWithAuth);

    return () => {
      window.removeEventListener(authChangeEventName, syncSocketWithAuth);
      disconnectSocket();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
