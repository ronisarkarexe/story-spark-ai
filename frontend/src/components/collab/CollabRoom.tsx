import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSocket, getSocketIo } from "../../socket/socket.oi";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";

interface Participant {
  userId: string;
  username: string;
  color: string;
  socketId: string;
}

interface StoryChunk {
  authorId: string;
  authorName: string;
  color: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface Room {
  roomId: string;
  createdBy: string;
  participants: Participant[];
  story: StoryChunk[];
  createdAt: Date;
}

interface CollabRoomResponse {
  room?: Room;
  message?: string;
}

interface CollabStoryResponse {
  story?: StoryChunk[];
}

export default function CollabRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newText, setNewText] = useState("");

  const user = getUserInfo();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!roomId) {
      setError("Invalid room ID");
      setLoading(false);
      return;
    }

    try {
      const socket = connectSocket();

      if (!socket) {
        setError(
          "Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env"
        );
        setLoading(false);
        return;
      }

      // Request room info allocation channel
      socket.emit("collab:get_room", { roomId }, (response: CollabRoomResponse) => {
        if (response && response.room) {
          setRoom(response.room);
          setError(null);
        } else {
          setError(response?.message || "Room not found");
        }
        setLoading(false);
      });

      // Unified Dynamic Action Event Streams
      const handleRoomUpdated = (data: CollabRoomResponse) => {
        if (data && data.room) {
          setRoom(data.room);
        }
      };

      const handleStoryUpdated = (data: CollabStoryResponse) => {
        if (data && data.story) {
          setRoom((prev) =>
            prev ? { ...prev, story: data.story! } : null
          );
        }
      };

      const handleCollabError = (data: CollabRoomResponse) => {
        setError(data?.message ?? "Collaboration error loop flagged");
        setLoading(false);
      };

      socket.on("collab:room_updated", handleRoomUpdated);
      socket.on("collab:story_updated", handleStoryUpdated);
      socket.on("collab:error", handleCollabError);

      return () => {
        socket.off("collab:room_updated", handleRoomUpdated);
        socket.off("collab:story_updated", handleStoryUpdated);
        socket.off("collab:error", handleCollabError);
      };
    } catch (err) {
      console.error("Collab error:", err);
      setError("Failed to initialize collaboration channels");
      setLoading(false);
    }
  }, [roomId, navigate]);

  const handleAddText = () => {
    if (!newText.trim() || !user || !roomId) return;

    const socket = getSocketIo();
    if (socket) {
      socket.emit("collab:add_text", {
        roomId,
        userId: user.userId,
        text: newText.trim(),
      });
      setNewText("");
    }
  };

  const handleAIContinue = () => {
    if (!roomId) return;

    const socket = getSocketIo();
    if (socket) {
      socket.emit("collab:ai_continue", { roomId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading collaboration room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 w-full box-border">
      <div className="max-w-6xl w-full box-border">
        {/* Top Control Action Bar */}
        <div className="mb-6 flex justify-between items-center select-none w-full">
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none"
          >
            <i className="fas fa-arrow-left transform group-hover:-translate-x-0.5 transition-transform" />
            <span>Leave Room</span>
          </button>

          {error && (
            <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
              ⚠️ Status: {error}
            </div>
          )}
        </div>

        {/* Main Interface Workspace Splits Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full box-border">
          
          {/* Main Story Canvas Frame */}
          <div className="lg:col-span-2 w-full box-border">
            <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
              <h1 className="text-xl font-extrabold tracking-tight mb-4 text-left">
                Story Board Workspace ID: <span className="font-mono text-blue-500">{roomId}</span>
              </h1>

              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-white/5 rounded-xl p-4 min-h-[320px] max-h-[480px] overflow-y-auto mb-4 text-left space-y-3 scrollbar-thin">
                {room?.story && room.story.length > 0 ? (
                  room.story.map((chunk, idx) => (
                    <div key={idx} className="text-sm leading-relaxed p-2.5 rounded-lg bg-white/40 dark:bg-white/[0.01] border border-slate-200/40 dark:border-white/[0.02]">
                      <span
                        style={{ color: chunk.color || "#6366f1" }}
                        className="font-bold mr-1.5 uppercase text-[11px] tracking-wider"
                      >
                        {chunk.authorName}:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {chunk.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[280px] text-slate-400 dark:text-slate-500 select-none">
                    <p className="text-2xl mb-1">📖</p>
                    <p className="text-xs font-bold uppercase tracking-wider">Story buffer is currently blank. Start typing below!</p>
                  </div>
                )}
              </div>

              {/* Composition Canvas Fields */}
              <div className="flex flex-col sm:flex-row gap-2 w-full box-border">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  placeholder="Type the next line or segment of your masterpiece..."
                  className="flex-1 px-4 h-11 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                />

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAddText}
                    disabled={!newText.trim()}
                    className="h-11 px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer shadow-sm"
                  >
                    Add Line
                  </button>

                  <button
                    type="button"
                    onClick={handleAIContinue}
                    className="h-11 px-5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <span>AI Engine</span>
                    <span>✨</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Room Presence Users Sidebar Panel */}
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-sm w-full box-border text-left">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 select-none">
              Active Authors ({room?.participants?.length ?? 0})
            </h2>

            <div className="space-y-2 max-h-[440px] overflow-y-auto">
              {room?.participants && room.participants.length > 0 ? (
                room.participants.map((p) => (
                  <div
                    key={p.userId}
                    className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-xl flex items-center gap-3 transition-all hover:translate-x-0.5"
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-inner shrink-0 animate-pulse"
                      style={{ backgroundColor: p.color || "#3b82f6" }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {p.username}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-bold text-slate-400 uppercase select-none tracking-wide py-2">
                  No active presence links mapped.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}