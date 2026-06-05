import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectCollabSocket } from "../../socket/socket.oi";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";

interface CreateRoomResponse {
  roomId?: string;
  message?: string;
}

export default function CollabHome() {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const user = getUserInfo();

  const createRoom = () => {
    if (!isLoggedIn() || !user) {
      navigate("/login");
      return;
    }

    setError("");
    setIsCreating(true);

    const collabSocket = connectCollabSocket();
    if (!collabSocket) {
      setError("Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env");
      setIsCreating(false);
      return;
    }

    collabSocket.emit(
      "collab:create_room",
      { userId: user.userId, username: user.name },
      (response: CreateRoomResponse) => {
        if (response?.roomId) {
          navigate(`/collab/${response.roomId}`);
          return;
        }

        setError(response?.message ?? "Failed to create room");
        setIsCreating(false);
      }
    );
  };

  const joinRoom = () => {
    if (!joinRoomId.trim()) {
      setError("Please enter a Room ID");
      return;
    }

    navigate(`/collab/${joinRoomId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Real-time Collaboration</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Story Collab Mode</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Home
          </button>
        </div>

        <div className="grid gap-6">
          <button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60"
          >
            {isCreating ? "Creating Room..." : "✨ Create a New Story Room"}
          </button>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Or join an existing room</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Enter Room ID..."
                className="flex-1 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white outline-none"
              />
              <button
                onClick={joinRoom}
                className="rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 font-semibold"
              >
                Join 🚀
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
