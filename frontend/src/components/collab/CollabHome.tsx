import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocketIo } from "../../socket/socket.oi";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";

export default function CollabHome() {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const user = getUserInfo();

  const createRoom = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      setIsCreating(true);
      const socket = connectSocket();
      if (!socket) {
        setError(
          "Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env"
        );
        return;
      }

      const collabSocket = socket.io.of("/collab");

      collabSocket.emit(
        "collab:create_room",
        { userId: user?.userId, username: user?.name },
        (response: any) => {
          if (response && response.roomId) {
            navigate(`/collab/${response.roomId}`);
          } else {
            setError("Failed to create room. Please try again.");
          }
          setIsCreating(false);
        }
      );
    } catch (err) {
      console.error("Create room error:", err);
      setError("Error creating room. Please try again.");
      setIsCreating(false);
    }
  };

  const joinRoom = () => {
    if (!joinRoomId.trim()) {
      setError("Please enter a Room ID");
      return;
    }
    navigate(`/collab/${joinRoomId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 hover:text-slate-900 hover:bg-gray-100 hover:border-indigo-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(99,102,241,0.12)] dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 dark:hover:border-indigo-500/30"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-sm font-semibold tracking-wide">Back to Home</span>
          </button>
        </div>
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Story Collab Mode
          </h1>
          <p className="text-slate-600 dark:text-white/50 text-lg">
            Co-write stories with friends in real time. <br />
            AI joins in whenever you need inspiration!
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Create Room */}
          <button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            {isCreating ? "Creating room..." : "✨ Create a New Story Room"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-slate-400 dark:text-white/30 text-sm">or join existing</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Join Room */}
          <div className="flex gap-3">
            <input
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              placeholder="Enter Room ID..."
              className="flex-1 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:border-indigo-500/50 text-sm"
            />
            <button
              onClick={joinRoom}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/10 text-slate-900 dark:text-white font-medium transition"
            >
              Join 🚀
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🎨", label: "Color-coded writers" },
            { icon: "⚡", label: "Real-time sync" },
            { icon: "✨", label: "AI co-writer" },
          ].map((f) => (
            <div key={f.label} className="bg-white dark:bg-white/3 border border-slate-200 dark:border-white/8 rounded-xl p-3 shadow-sm dark:shadow-none">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs text-slate-500 dark:text-white/40">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}