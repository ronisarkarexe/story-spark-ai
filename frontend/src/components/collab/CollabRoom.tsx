import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import * as Y from "yjs";
import { resolveSocketUrl } from "../../helpers/socket-url";
import { getToken } from "../../services/auth.service";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";

interface RemoteCursor {
  username: string;
  color: string;
  cursorIndex: number;
}

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
  const [editorText, setEditorText] = useState("");
  const [collabSocket, setCollabSocket] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: string }>({});
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<{ [userId: string]: RemoteCursor }>({});

  const user = getUserInfo();

  // Yjs document instances
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("story"), [ydoc]);

  // Diff-match-patch character diff calculation for textarea CRDT integration
  const applyDiff = (ytext: Y.Text, oldVal: string, newVal: string) => {
    let commonStart = 0;
    while (
      commonStart < oldVal.length &&
      commonStart < newVal.length &&
      oldVal[commonStart] === newVal[commonStart]
    ) {
      commonStart++;
    }

    let commonEnd = 0;
    while (
      commonEnd + commonStart < oldVal.length &&
      commonEnd + commonStart < newVal.length &&
      oldVal[oldVal.length - 1 - commonEnd] === newVal[newVal.length - 1 - commonEnd]
    ) {
      commonEnd++;
    }

    const deleteCount = oldVal.length - commonStart - commonEnd;
    const insertText = newVal.slice(commonStart, newVal.length - commonEnd);

    if (deleteCount > 0) {
      ytext.delete(commonStart, deleteCount);
    }
    if (insertText.length > 0) {
      ytext.insert(commonStart, insertText);
    }
  };

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

      // Join room and request initial state
      socketInstance.emit("collab:join_room", { roomId });
      socketInstance.emit("collab:yjs_join", { roomId });

      // Listeners
      const handleRoomUpdated = (data: CollabRoomResponse) => {
        if (data && data.room) {
          setRoom(data.room);
        }
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

      // Yjs Init and Update listeners
      socketInstance.on("collab:yjs_init", ({ yjsState }: { yjsState: any }) => {
        if (yjsState) {
          Y.applyUpdate(ydoc, new Uint8Array(yjsState.data || yjsState));
        }
        setEditorText(ytext.toString());
        setLoading(false);
      });

      socketInstance.on("collab:yjs_update", ({ update }: { update: any }) => {
        const binaryUpdate = new Uint8Array(update.data || update);
        Y.applyUpdate(ydoc, binaryUpdate, socketInstance);
      });

      socketInstance.on(
        "collab:cursor_update",
        (data: { userId: string; username: string; color: string; cursorIndex: number }) => {
          setRemoteCursors((prev) => ({
            ...prev,
            [data.userId]: {
              username: data.username,
              color: data.color,
              cursorIndex: data.cursorIndex,
            },
          }));
        }
      );

      socketInstance.on("collab:room_updated", handleRoomUpdated);
      socketInstance.on("collab:user_typing", handleUserTyping);
      socketInstance.on("collab:user_stop_typing", handleUserStopTyping);
      socketInstance.on("collab:ai_thinking", handleAiThinking);
      socketInstance.on("collab:error", handleError);

      // Yjs Doc changes sync callback
      const handleDocUpdate = (update: Uint8Array, origin: any) => {
        if (origin !== socketInstance) {
          socketInstance.emit("collab:yjs_update", { roomId, update: Array.from(update) });
        }
        setEditorText(ytext.toString());
        setIsAiThinking(false);
      };
      ydoc.on("update", handleDocUpdate);

      return () => {
        ydoc.off("update", handleDocUpdate);
        socketInstance.off("collab:room_updated", handleRoomUpdated);
        socketInstance.off("collab:user_typing", handleUserTyping);
        socketInstance.off("collab:user_stop_typing", handleUserStopTyping);
        socketInstance.off("collab:ai_thinking", handleAiThinking);
        socketInstance.off("collab:yjs_init");
        socketInstance.off("collab:yjs_update");
        socketInstance.off("collab:cursor_update");
        socketInstance.off("collab:error", handleError);
        socketInstance.disconnect();
      };
    } catch (err) {
      console.error("Collab initialization error:", err);
      setError("Failed to initialize collaboration space.");
      setLoading(false);
    }
  }, [roomId, navigate, ydoc, ytext]);

  const handleLocalTextChange = (val: string) => {
    if (!collabSocket || !roomId) return;
    const oldVal = ytext.toString();
    ydoc.transact(() => {
      applyDiff(ytext, oldVal, val);
    });
    setEditorText(val);

    collabSocket.emit("collab:typing", { roomId });
  };

  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const cursorIndex = target.selectionStart;
    if (collabSocket && roomId) {
      collabSocket.emit("collab:cursor_update", { roomId, cursorIndex });
    }
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
            onClick={() => navigate("/collab")}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-sm font-semibold tracking-wide">Leave Collab Room</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Editor Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 mb-6 shadow-sm">
              <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Collab Room Canvas
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Room ID: {roomId}</p>

              <div className="relative w-full">
                <textarea
                  value={editorText}
                  onChange={(e) => handleLocalTextChange(e.target.value)}
                  onSelect={handleCursorChange}
                  onKeyUp={handleCursorChange}
                  placeholder="Start writing the story collaboratively here..."
                  className="w-full min-h-[400px] p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 font-serif text-lg leading-relaxed resize-y box-border transition-colors duration-200"
                  disabled={isAiThinking}
                />
              </div>

              {isAiThinking && (
                <div className="flex items-center gap-2 mt-4 text-purple-500 italic text-xs select-none">
                  <div className="animate-spin w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  AI is writing the next segment...
                </div>
              )}

              {Object.keys(typingUsers).length > 0 && (
                <p className="text-xs text-indigo-500 italic mt-2 animate-pulse select-none">
                  {Object.values(typingUsers).join(", ")}{" "}
                  {Object.keys(typingUsers).length === 1 ? "is" : "are"} typing...
                </p>
              )}

              {/* Remote Cursors Presence Overlay Status */}
              <div className="mt-4 flex flex-wrap gap-2 items-center select-none">
                <span className="text-xs text-slate-400 font-medium">Remote Cursors:</span>
                {Object.keys(remoteCursors).length > 0 ? (
                  Object.entries(remoteCursors).map(([id, info]) => (
                    <span
                      key={id}
                      className="px-2.5 py-1 rounded-full text-xs font-bold border transition-all duration-150 flex items-center gap-1.5"
                      style={{
                        borderColor: info.color,
                        color: info.color,
                        backgroundColor: `${info.color}10`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: info.color }}
                      ></span>
                      {info.username} (char {info.cursorIndex})
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No other active cursors</span>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={handleAIContinue}
                  disabled={isAiThinking}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-55 text-white rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  AI Spark ✨
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
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-350">
                      {p.username}
                    </span>
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