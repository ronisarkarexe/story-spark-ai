import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import { getToken } from "../../services/auth.service";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";
import { resolveSocketUrl } from '../../helpers/socket-url';
import CollabEditor from './CollabEditor';
import CollabChatPanel from './CollabChatPanel';
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
  isPublic?: boolean;
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
  const [collabSocket, setCollabSocket] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: string }>({});
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const user = getUserInfo();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

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
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        isTypingRef.current = false;
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
    }
  }, [roomId, navigate]);

  const handleAIContinue = () => {
    if (!roomId || !collabSocket) return;
    collabSocket.emit("collab:ai_continue", { roomId });
  };

  // Unified Share Handler with fallback logic
  const handleShareRoom = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Story Spark Collaboration Room!",
          text: "Let's co-write an incredible story together with AI assistance.",
          url: currentUrl,
        });
      } catch (err) {
        console.log("Native share canceled or failed, using fallback.", err);
        fallbackCopyToClipboard(currentUrl);
      }
    } else {
      fallbackCopyToClipboard(currentUrl);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    });
  };

  // Privacy Status Toggler
  const handleTogglePrivacy = () => {
    if (!collabSocket || !roomId || !room) return;
    const currentPrivacy = room.isPublic ?? true;
    
    collabSocket.emit("collab:update_privacy", {
      roomId,
      isPublic: !currentPrivacy,
    });
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
        <div className="text-center max-w-md">
          <p className="text-red-500 dark:text-red-400 text-lg mb-2">Error</p>
          <p className="text-slate-600 dark:text-white/60 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to collab home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl w-full">
        <div className="mb-6 flex justify-start select-none">
          <button
            type="button"
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
              </div>

              {Object.keys(typingUsers).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.entries(typingUsers).map(([userId, username]) => (
                    <span
                      key={userId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 rounded-full animate-pulse"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {username} is typing...
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 items-start">
                <CollabEditor
                  storyId={roomId || ''}
                  userId={user?.userId || ''}
                  username={user?.name || 'Anonymous'}
                  userColor="#FF6B6B"
                />
                <button
                  type="button"
                  onClick={handleAIContinue}
                  disabled={isAiThinking}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-55 text-white rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  AI ✨
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6 lg:col-span-1">
            {/* Active Writers Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
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
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-350 flex-1">{p.username}</span>
                      {typingUsers[p.userId] && (
                        <span className="text-[10px] font-medium uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
                          typing
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No writers present</p>
                )}
              </div>
            </div>

            {/* Chat Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: "360px", maxHeight: "480px" }}>
              <CollabChatPanel
                socket={collabSocket}
                roomId={roomId || ""}
                currentUserId={user?.userId || ""}
                currentUsername={user?.name || "Anonymous"}
              />
            </div>

            {/* Room Settings Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Room Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Public Room
                    </span>
                    <span className="text-xs text-slate-400">
                      {(room?.isPublic ?? true) ? "Visible on community feed" : "Hidden from search & feed"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePrivacy}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                      (room?.isPublic ?? true) ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        (room?.isPublic ?? true) ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleShareRoom}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  <i className="fas fa-share-alt"></i>
                  {copyFeedback ? "Link Copied to Clipboard!" : "Share Room Link"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}