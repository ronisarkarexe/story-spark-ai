/* eslint-disable */
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket, getSocketIo } from "./socket.oi";
import { isLoggedIn } from "../services/auth.service";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isConnected = useRef(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const authed = isLoggedIn();
    if (!authed) {
      if (isConnected.current) {
        disconnectSocket();
        isConnected.current = false;
        setSocket(null);
      }
      return;
    }

    const currentSocket = connectSocket();
    if (currentSocket) {
      isConnected.current = true;
      setSocket(currentSocket);
    }

    return () => {
      disconnectSocket();
      isConnected.current = false;
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
