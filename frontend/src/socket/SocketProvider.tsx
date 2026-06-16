import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "./socket.oi";
import { isLoggedIn } from "../services/auth.service";

const SocketContext = createContext<Socket | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const authed = isLoggedIn();
    if (!authed) {
      disconnectSocket();
      setSocket(null);
      return;
    }

    const s = connectSocket();
    setSocket(s);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
