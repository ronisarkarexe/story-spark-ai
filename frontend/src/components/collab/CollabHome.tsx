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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300 w-full box-border relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="max-w-md w-full relative z-10 box-border">
        <div className="mb-6 flex justify-start select-none">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-sm font-semibold tracking-wide">
              Back to Home
            </span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 w-full box-border text-center">
          <div className="text-5xl mb-4 select-none">✍️</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3 tracking-tight select-none">
            Story Collab Mode
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mb-8 select-none">
            Co-write stories with friends in real time. <br />
            AI joins in whenever you need inspiration!
          </p>

          {error && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 text-red-500 dark:text-red-400 text-xs font-semibold mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5 w-full box-border">
            <button
              onClick={createRoom}
              disabled={isCreating}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none cursor-pointer"
            >
              {isCreating ? "Creating Room..." : "✨ Create a New Story Room"}
            </button>

            <div className="relative my-6 select-none w-full box-border">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold tracking-wider uppercase">
                <span className="bg-white dark:bg-[#121824] px-3 text-slate-400 dark:text-slate-500">
                  Or join existing
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full box-border">
              <input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Enter Room ID..."
                className="flex-1 h-11 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-blue-500/40 transition-colors box-border"
              />
              <button
                onClick={joinRoom}
                className="h-11 px-5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors active:scale-[0.98] cursor-pointer shadow-sm shrink-0"
              >
                Join 🚀
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-center select-none w-full box-border">
            {[
              { icon: "🎨", label: "Color writers" },
              { icon: "⚡", label: "Real-time sync" },
              { icon: "✨", label: "AI co-writer" },
            ].map((f) => (
              <div key={f.label} className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl p-3 shadow-sm dark:shadow-none box-border">
                <div className="text-xl mb-1">{f.icon}</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}