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
  message?: string;
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

      // Request room info
      socket.emit("collab:get_room", { roomId }, (response: CollabRoomResponse) => {
        if (response && response.room) {
          setRoom(response.room);
          setError(null);
        } else {
          setError(response?.message || "Room not found");
        }
        setLoading(false);
      });

      // Listeners
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

      const handleError = (data: { message?: string }) => {
        setError(data?.message || "Something went wrong");
        setLoading(false);
      };

      socket.on("collab:room_updated", handleRoomUpdated);
      socket.on("collab:story_updated", handleStoryUpdated);
      socket.on("collab:error", handleError);

      return () => {
        socket.off("collab:room_updated", handleRoomUpdated);
        socket.off("collab:story_updated", handleStoryUpdated);
        socket.off("collab:error", handleError);
      };
    } catch (err) {
      console.error("Collab error:", err);
      setError("Failed to initialize collaboration");
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
        text: newText,
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
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading collaboration room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center max-w-md">
          <p className="text-red-500 dark:text-red-400 text-lg mb-2">Error</p>
          <p className="text-slate-600 dark:text-white/60 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="text-indigo-600 dark:text-indigo-400 underline"
          >
            Back to collab home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300 w-full py-8">
      <div className="max-w-6xl w-full">
        <div className="mb-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Rooms</span>
          </button>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full border border-blue-500/20">
            Room: {roomId}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Collaborative Canvas
              </h1>

              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-xl p-4 min-h-[300px] max-h-[450px] overflow-y-auto mb-4">
                {room?.story?.length ? (
                  <div className="space-y-3">
                    {room.story.map((chunk, idx) => (
                      <div key={idx} className="text-sm leading-relaxed">
                        <span
                          style={{ color: chunk.color }}
                          className="font-bold mr-1.5"
                        >
                          {chunk.authorName}:
                        </span>
                        <span className="text-slate-700 dark:text-slate-200">
                          {chunk.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-12">
                    The story canvas is empty. Start typing to write your masterwork!
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddText();
                    }
                  }}
                  placeholder="Add your story text..."
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500/40 text-sm"
                />

                <button
                  type="button"
                  onClick={handleAddText}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all duration-200 text-sm active:scale-95 cursor-pointer shrink-0"
                >
                  Add
                </button>

                <button
                  type="button"
                  onClick={handleAIContinue}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-200 text-sm active:scale-95 cursor-pointer shrink-0"
                >
                  AI ✨
                </button>
              </div>
            </div>
          </div>

          {/* Participants panel */}
          <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 h-fit shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
              Writers Online ({room?.participants?.length || 0})
            </h2>

            <div className="space-y-2">
              {room?.participants?.map((p) => (
                <div
                  key={p.userId}
                  className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-xl flex items-center gap-3"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {p.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}