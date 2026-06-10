import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket, getSocketIo } from "./socket.oi";
import { isLoggedIn, authChangeEventName } from "../services/auth.service";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(getSocketIo());

  useEffect(() => {
    const handleAuthChange = () => {
      if (isLoggedIn()) {
        const socketInstance = connectSocket();
        setSocket(socketInstance);
      } else {
        disconnectSocket();
        setSocket(null);
      }
    };

    // Run once on mount
    handleAuthChange();

    window.addEventListener(authChangeEventName, handleAuthChange);
    return () => {
      window.removeEventListener(authChangeEventName, handleAuthChange);
      disconnectSocket();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export default SocketProvider;
