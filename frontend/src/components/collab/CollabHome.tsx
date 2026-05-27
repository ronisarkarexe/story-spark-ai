import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Socket.IO collab disabled (see CollabRoom). Previous: io, Socket, resolveSocketUrl, BACKEND_URL.

export default function CollabHome() {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");

  const createRoom = () => {
    setError(
      "Real-time collaboration is turned off. Socket.IO has been disabled in the frontend."
    );
    /* Previous Socket.IO flow:
    setIsCreating(true);
    window.__storySparkCollabSocket?.disconnect();
    const socket = io(`${BACKEND_URL}/collab`, { auth: { token }, transports: ["websocket"] });
    ...
    */
  };

  const joinRoom = () => {
    if (!joinRoomId.trim()) {
      setError("Please enter a Room ID");
      return;
    }
    navigate(`/collab/${joinRoomId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Story Collab Mode
          </h1>
          <p className="text-white/50 text-lg">
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            ✨ Create a New Story Room
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm">or join existing</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Join Room */}
          <div className="flex gap-3">
            <input
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              placeholder="Enter Room ID..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 text-sm"
            />
            <button
              onClick={joinRoom}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition"
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
            <div key={f.label} className="bg-white/3 border border-white/8 rounded-xl p-3">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs text-white/40">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}