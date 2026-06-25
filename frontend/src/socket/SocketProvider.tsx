main

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
 main

  useEffect(() => {
    const authed = isLoggedIn();
    if (!authed) {
 main
    };
  }, []);

  return (
main
  );
};
