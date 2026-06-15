import React, { createContext, useContext, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { socketIo, connectSocket, disconnectSocket } from "./socket.oi";
import { isLoggedIn } from "../services/auth.service";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isConnected = useRef(false);

  useEffect(() => {
    const authed = isLoggedIn();
    
    if (!authed) {
      if (isConnected.current) {
        disconnectSocket();
        isConnected.current = false;
      }
      return;
    }

    if (!socketIo.instance?.connected) {
      connectSocket();
      isConnected.current = true;
    }

    return () => {
      // Don't disconnect on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={socketIo.instance}>
      {children}
    </SocketContext.Provider>
  );
};