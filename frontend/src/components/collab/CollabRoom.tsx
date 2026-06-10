import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  connectCollabSocket,
  disconnectCollabSocket,
  getCollabSocketIo,
} from "../../socket/socket.oi";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { io } from "socket.io-client";
import { resolveSocketUrl } from "../../helpers/socket-url";
import { getToken } from "../../services/auth.service";
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
  timestamp: string;
}

interface Room {
  roomId: string;
  createdBy: string;
  participants: Participant[];
  story: StoryChunk[];
  createdAt: string;
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
  const [collabSocket, setCollabSocket] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: string }>({});
  const [isAiThinking, setIsAiThinking] = useState(false);

  const user = getUserInfo();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!roomId) {
      setError("Invalid room ID");
    const socketUrl = resolveSocketUrl();
    const token = getToken();

    if (!socketUrl || !token) {
      setError("Socket connection failed. Please check your network and try again.");
      setLoading(false);
      return;
    }

    let socketInstance: any;

    try {
      socketInstance = io(`${socketUrl}/collab`, {
        transports: ["websocket", "polling"],
        auth: { token },
        withCredentials: true,
      });

      setCollabSocket(socketInstance);

      // Join room
      socketInstance.emit("collab:join_room", { roomId });

      // Request initial room details
      socketInstance.emit("collab:get_room", { roomId }, (response: CollabRoomResponse) => {
        if (response && response.room) {
          setRoom(response.room);
          setError(null);
        } else {
          setError(response.message || "Room not found");
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
          setRoom((prev) => (prev ? { ...prev, story: data.story! } : null));
        }
        setIsAiThinking(false);
      };

      const handleUserTyping = (data: { userId: string; username: string }) => {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: data.username }));
      };

      const handleUserStopTyping = (data: { userId: string }) => {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[data.userId];
          return updated;
        });
      };

      const handleAiThinking = () => {
        setIsAiThinking(true);
      };

      const handleError = (data: { message: string }) => {
        setError(data.message || "Collaboration error occurred.");
      };

      socketInstance.on("collab:room_updated", handleRoomUpdated);
      socketInstance.on("collab:story_updated", handleStoryUpdated);
      socketInstance.on("collab:user_typing", handleUserTyping);
      socketInstance.on("collab:user_stop_typing", handleUserStopTyping);
      socketInstance.on("collab:ai_thinking", handleAiThinking);
      socketInstance.on("collab:error", handleError);

      return () => {
        socketInstance.off("collab:room_updated", handleRoomUpdated);
        socketInstance.off("collab:story_updated", handleStoryUpdated);
        socketInstance.off("collab:user_typing", handleUserTyping);
        socketInstance.off("collab:user_stop_typing", handleUserStopTyping);
        socketInstance.off("collab:ai_thinking", handleAiThinking);
        socketInstance.off("collab:error", handleError);
        socketInstance.disconnect();
      };
    } catch (err) {
      console.error("Collab initialization error:", err);
      setError("Failed to initialize collaboration space.");
      setLoading(false);
      return;
    }

    const collabSocket = connectCollabSocket();
    if (!collabSocket) {
      setError("Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env");
      setLoading(false);
      return;
    }

    collabSocket.emit("collab:get_room", { roomId }, (response: CollabRoomResponse) => {
      if (response?.room) {
        setRoom(response.room);
        setError(null);
      } else {
        setError(response?.message ?? "Room not found");
      }
      setLoading(false);
    });

    const handleRoomUpdated = (data: CollabRoomResponse) => {
      if (data?.room) {
        setRoom(data.room);
      }
    };

    const handleStoryUpdated = (data: CollabStoryResponse) => {
      if (data?.story) {
        setRoom((prev) =>
          prev ? { ...prev, story: data.story ?? [] } : prev
        );
      }
    };

    const handleError = (data: CollabRoomResponse) => {
      setError(data?.message ?? "Something went wrong");
    };

    collabSocket.on("collab:room_updated", handleRoomUpdated);
    collabSocket.on("collab:story_updated", handleStoryUpdated);
    collabSocket.on("collab:error", handleError);

    return () => {
      collabSocket.off("collab:room_updated", handleRoomUpdated);
      collabSocket.off("collab:story_updated", handleStoryUpdated);
      collabSocket.off("collab:error", handleError);
      disconnectCollabSocket();
    };
  }, [navigate, roomId]);

  const handleAddText = () => {
    if (!newText.trim() || !user || !roomId) return;

    const collabSocket = getCollabSocketIo();
    if (!collabSocket) {
      setError("Socket.IO is not connected.");
      return;
    }

    collabSocket.emit("collab:add_text", {
      roomId,
      userId: user.userId,
      text: newText,
    });

    setNewText("");
  };

  const handleAIContinue = () => {
    if (!roomId) return;

    const collabSocket = getCollabSocketIo();
    collabSocket?.emit("collab:ai_continue", { roomId });
    if (!newText.trim() || !user || !roomId || !collabSocket) return;

    collabSocket.emit("collab:add_text", {
      roomId,
      text: newText.trim(),
    });
    collabSocket.emit("collab:stop_typing", { roomId });
    setNewText("");
  };

  let typingTimeout: any;
  const handleInputChange = (val: string) => {
    setNewText(val);
    if (!collabSocket || !roomId) return;

    collabSocket.emit("collab:typing", { roomId });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      collabSocket.emit("collab:stop_typing", { roomId });
    }, 2000);
  };

  const handleAIContinue = () => {
    if (!roomId || !collabSocket) return;
    collabSocket.emit("collab:ai_continue", { roomId });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading collaboration room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 p-8 text-center">
          <p className="text-lg font-semibold text-red-700 dark:text-red-200 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to collab home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 p-6 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Room ID</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{room?.roomId}</h1>
            </div>
            <button
              onClick={() => navigate("/collab")}
              className="rounded-2xl border border-slate-300 dark:border-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              Back to Collab Home
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl bg-slate-50 dark:bg-slate-900 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Story</h2>
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {room?.story?.length ? (
                  room.story.map((chunk, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-slate-950">
                      <p className="text-sm font-semibold" style={{ color: chunk.color }}>
                        {chunk.authorName} {chunk.isAI ? "• AI" : ""}
                      </p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{chunk.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">The story is empty. Add the first line below.</p>
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl w-full">
        <div className="mb-6 flex justify-start select-none">
          <button
            onClick={() => navigate("/collab")}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-sm font-semibold tracking-wide">
              Leave Collab Room
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Editor Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 mb-6 shadow-sm">
              <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Collab Room Canvas
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Room ID: {roomId}</p>

              <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 min-h-[300px] max-h-[500px] overflow-y-auto border border-slate-150 dark:border-white/5 mb-4">
                {room?.story && room.story.length > 0 ? (
                  <div className="space-y-4">
                    {room.story.map((chunk, idx) => (
                      <div key={idx} className="text-sm border-l-4 pl-3" style={{ borderLeftColor: chunk.color }}>
                        <span className="font-semibold block mb-0.5 text-xs text-slate-400" style={{ color: chunk.color }}>
                          {chunk.authorName}
                        </span>
                        <span className="text-slate-700 dark:text-slate-350">{chunk.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 text-slate-400">
                    <p className="mb-2">Story is currently empty.</p>
                    <p className="text-xs">Type below or click AI continue to start writing!</p>
                  </div>
                )}

                {isAiThinking && (
                  <div className="flex items-center gap-2 mt-4 text-purple-500 italic text-xs">
                    <div className="animate-spin w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    AI is writing the next segment...
                  </div>
                )}

                {Object.keys(typingUsers).length > 0 && (
                  <p className="text-xs text-indigo-500 italic mt-2 animate-pulse">
                    {Object.values(typingUsers).join(", ")} {Object.keys(typingUsers).length === 1 ? "is" : "are"} typing...
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-5 space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Participants</p>
                <div className="mt-3 space-y-2">
                  {room?.participants?.map((participant) => (
                    <div key={participant.socketId} className="rounded-2xl border border-slate-200 dark:border-white/10 p-3 bg-white dark:bg-slate-950">
                      <p className="text-sm font-semibold">{participant.username}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{participant.userId}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Add text to the story..."
                  className="w-full min-h-[140px] rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 p-4 text-slate-900 dark:text-white outline-none"
                />
                <button
                  onClick={handleAddText}
                  className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold"
                >
                  Add Text
                </button>
                <button
                  onClick={handleAIContinue}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/10 px-4 py-3 text-slate-700 dark:text-slate-200"
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  placeholder="Add to the story..."
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleAddText}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Send
                </button>
                <button
                  onClick={handleAIContinue}
                  disabled={isAiThinking}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-55 text-white rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  Ask AI to Continue
                </button>
              </div>
            </div>
          </div>

          {/* Participants Sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm self-start">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Active Writers ({room?.participants.length || 0})
            </h2>
            <div className="space-y-3">
              {room?.participants && room.participants.length > 0 ? (
                room.participants.map((p) => (
                  <div
                    key={p.userId}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-white/5"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    ></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-350">{p.username}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No writers present</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
