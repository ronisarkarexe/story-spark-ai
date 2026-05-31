import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSocket } from "../../socket/socket.oi";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";
import { io, Socket } from "socket.io-client"; // Imported Socket type and io helper safely

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
import { useParams, useNavigate } from "react-router-dom";

/**
 * Collab rooms required Socket.IO to `BACKEND_URL/collab`. That is disabled in the
 * frontend (same as notification socket) to avoid slow loads and connection hangs.
 * Restore the previous implementation from git history when you run a persistent backend.
 */
export default function CollabRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newText, setNewText] = useState("");
  const user = getUserInfo();
  
  // FIX: Persistent reference holder for the custom workspace namespace connection
  const collabSocketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const socket = connectSocket();
      if (!socket) {
        setError("Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env");
        setLoading(false);
        return;
      }

      // FIX: Establish dynamic or baseline safe namespace path target
      const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
      const collabSocket = io(`${socketUrl}/collab`, {
        transports: ["websocket"]
      });
      
      // Save reference to be used by click triggers safely elsewhere
      collabSocketRef.current = collabSocket;

      // Request room info
      collabSocket.emit("collab:get_room", { roomId }, (response: any) => {
        if (response && response.room) {
          setRoom(response.room);
          setError(null);
        } else {
          setError("Room not found");
        }
        setLoading(false);
      });

      // Listen for room updates
      const handleRoomUpdated = (data: any) => {
        if (data && data.room) {
          setRoom(data.room);
        }
      };

      const handleStoryUpdated = (data: any) => {
        if (data && data.story) {
          setRoom((prev) => (prev ? { ...prev, story: data.story } : null));
        }
      };

      collabSocket.on("collab:room_updated", handleRoomUpdated);
      collabSocket.on("collab:story_updated", handleStoryUpdated);
      collabSocket.on("collab:error", (data: any) => {
        setError(data.message);
        setLoading(false);
      });

      return () => {
        collabSocket.off("collab:room_updated", handleRoomUpdated);
        collabSocket.off("collab:story_updated", handleStoryUpdated);
        collabSocket.disconnect(); // Clean connection handle loop safely
      };
    } catch (err) {
      console.error("Collab error:", err);
      setError("Failed to initialize collaboration");
      setLoading(false);
    }
  }, [roomId, navigate]);

  const handleAddText = () => {
    if (!newText.trim() || !user) return;

    // FIX: Using persistent local ref to target the connection directly
    if (collabSocketRef.current) {
      collabSocketRef.current.emit("collab:add_text", {
        roomId,
        userId: user.userId,
        text: newText,
      });
      setNewText("");
    }
  };

  const handleAIContinue = () => {
    // FIX: Using persistent local ref to target the connection directly
    if (collabSocketRef.current) {
      collabSocketRef.current.emit("collab:ai_continue", { roomId });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center max-w-md">
        <p className="text-red-500 dark:text-red-400 text-lg mb-2">Collaboration unavailable</p>
        <p className="text-slate-600 dark:text-white/60 text-sm mb-6">
          Real-time collab is turned off (Socket.IO disabled). Room{" "}
          <span className="text-slate-800 dark:text-white/80 font-mono">{roomId}</span> cannot load.
        </p>
        <button
          type="button"
          onClick={() => navigate("/collab")}
          className="text-indigo-600 dark:text-indigo-400 underline"
        >
          Back to collab home
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Story Content */}
          <div className="col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">Room: {roomId}</h1>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto mb-4">
                {room?.story && room.story.length > 0 ? (
                  <div className="space-y-3">
                    {room.story.map((chunk, idx) => (
                      <div key={idx} className="text-sm">
                        <span style={{ color: chunk.color }} className="font-semibold">
                          {chunk.authorName}:
                        </span>{" "}
                        <span className="text-slate-600 dark:text-slate-300">{chunk.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">Story is empty. Start writing!</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  placeholder="Add your story text..."
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddText}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={handleAIContinue}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  AI ✨
                </button>
              </div>
            </div>
          </div>

          {/* Participants Sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
            <h2 className="text-lg font-bold mb-4">Participants ({room?.participants.length})</h2>
            <div className="space-y-2">
              {room?.participants.map((p) => (
                <div
                  key={p.userId}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  ></div>
                  <span className="text-sm">{p.username}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}