import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectCollabSocket, getCollabSocket } from "../../socket/socket.oi";
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

interface ChatMessage {
  senderId: string;
  senderName: string;
  color: string;
  text: string;
  timestamp: Date;
}

interface StoryVersion {
  versionIndex: number;
  name: string;
  story: StoryChunk[];
  savedBy: string;
  timestamp: Date;
}

interface Room {
  roomId: string;
  createdBy: string;
  participants: Participant[];
  story: StoryChunk[];
  chats: ChatMessage[];
  versions: StoryVersion[];
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

  // Room tabs state
  const [activeTab, setActiveTab] = useState<"ai" | "chat" | "versions">("ai");

  // Chat message state
  const [chatText, setChatText] = useState("");

  // Version checkpoint state
  const [versionName, setVersionName] = useState("");
  const [isSavingVersion, setIsSavingVersion] = useState(false);

  // AI Brainstorming state
  const [aiTopic, setAiTopic] = useState("");
  const [brainstormSuggestions, setBrainstormSuggestions] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Publishing state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishTag, setPublishTag] = useState("");
  const [publishGenre, setPublishGenre] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedPostId, setPublishedPostId] = useState<string | null>(null);

  // Typing indicators state
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});

  // UI state
  const [copiedLink, setCopiedLink] = useState(false);

  // Refs for auto scroll
  const storyEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      let socket = getCollabSocket();
      if (!socket) {
        socket = connectCollabSocket();
      }

      if (!socket) {
        setError(
          "Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env"
        );
        setLoading(false);
        return;
      }

      // Join room first
      socket.emit("collab:join_room", { roomId });

      // Request room info
      socket.emit("collab:get_room", { roomId }, (response: CollabRoomResponse) => {
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
        setIsAiThinking(false);
        if (data && data.story) {
          setRoom((prev) =>
            prev ? { ...prev, story: data.story! } : null
          );
        }
      };

      const handleNewChat = (data: { chatMsg: ChatMessage; chats: ChatMessage[] }) => {
        if (data && data.chats) {
          setRoom((prev) =>
            prev ? { ...prev, chats: data.chats } : null
          );
        }
      };

      const handleBrainstormResult = (data: { suggestions: string }) => {
        setIsAiThinking(false);
        if (data && data.suggestions) {
          const items = data.suggestions
            .split("\n")
            .map((item) => item.replace(/^[-*•\d\.]\s*/, "").trim())
            .filter(Boolean);
          setBrainstormSuggestions(items);
        }
      };

      const handleStoryPublished = (data: { postId: string; title: string }) => {
        setIsPublishing(false);
        setIsPublishModalOpen(false);
        setPublishedPostId(data.postId);
      };

      const handleAiThinking = () => {
        setIsAiThinking(true);
      };

      const handleUserTyping = (data: { userId: string; username: string }) => {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: data.username }));
      };

      const handleUserStopTyping = (data: { userId: string }) => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[data.userId];
          return next;
        });
      };

      const handleError = (data: { message: string }) => {
        setIsAiThinking(false);
        setIsPublishing(false);
        setIsSavingVersion(false);
        setError(data.message || "Collaboration error");
      };

      socket.on("collab:room_updated", handleRoomUpdated);
      socket.on("collab:story_updated", handleStoryUpdated);
      socket.on("collab:new_chat", handleNewChat);
      socket.on("collab:brainstorm_result", handleBrainstormResult);
      socket.on("collab:story_published", handleStoryPublished);
      socket.on("collab:ai_thinking", handleAiThinking);
      socket.on("collab:user_typing", handleUserTyping);
      socket.on("collab:user_stop_typing", handleUserStopTyping);
      socket.on("collab:error", handleError);

      return () => {
        socket?.off("collab:room_updated", handleRoomUpdated);
        socket?.off("collab:story_updated", handleStoryUpdated);
        socket?.off("collab:new_chat", handleNewChat);
        socket?.off("collab:brainstorm_result", handleBrainstormResult);
        socket?.off("collab:story_published", handleStoryPublished);
        socket?.off("collab:ai_thinking", handleAiThinking);
        socket?.off("collab:user_typing", handleUserTyping);
        socket?.off("collab:user_stop_typing", handleUserStopTyping);
        socket?.off("collab:error", handleError);
      };
    } catch (err) {
      console.error("Collab error:", err);
      setError("Failed to initialize collaboration");
      setLoading(false);
    }
  }, [roomId, navigate]);

  // Auto scroll story & chat
  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.story, typingUsers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.chats]);

  // Emit typing indicators when typing story
  const handleTyping = (text: string) => {
    setNewText(text);
    const socket = getCollabSocket();
    if (!socket || !roomId) return;

    socket.emit("collab:typing", { roomId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("collab:stop_typing", { roomId });
    }, 1500);
  };

  const handleAddText = () => {
    if (!newText.trim() || !user || !roomId) return;

    const socket = getCollabSocket();
    if (socket) {
      socket.emit("collab:add_text", {
        roomId,
        text: newText,
      });
      setNewText("");
      socket.emit("collab:stop_typing", { roomId });
    }
  };

  const handleAIContinue = () => {
    if (!roomId) return;
    const socket = getCollabSocket();
    if (socket) {
      setIsAiThinking(true);
      socket.emit("collab:ai_continue", { roomId });
    }
  };

  const handleSendChat = () => {
    if (!chatText.trim() || !roomId) return;
    const socket = getCollabSocket();
    if (socket) {
      socket.emit("collab:send_chat", { roomId, text: chatText });
      setChatText("");
    }
  };

  const handleSaveVersion = () => {
    if (!versionName.trim() || !roomId) return;
    const socket = getCollabSocket();
    if (socket) {
      setIsSavingVersion(true);
      socket.emit("collab:save_version", { roomId, versionName });
      setVersionName("");
      setTimeout(() => setIsSavingVersion(false), 800);
    }
  };

  const handleRestoreVersion = (index: number) => {
    if (!roomId) return;
    if (window.confirm("Are you sure you want to revert the draft to this checkpoint?")) {
      const socket = getCollabSocket();
      if (socket) {
        socket.emit("collab:restore_version", { roomId, versionIndex: index });
      }
    }
  };

  const handleAIBrainstorm = () => {
    if (!aiTopic.trim() || !roomId) return;
    const socket = getCollabSocket();
    if (socket) {
      setIsAiThinking(true);
      socket.emit("collab:ai_brainstorm", { roomId, topic: aiTopic });
    }
  };

  const handlePublishStory = () => {
    if (!publishTitle.trim() || !roomId) return;
    const socket = getCollabSocket();
    if (socket) {
      setIsPublishing(true);
      socket.emit("collab:publish_story", {
        roomId,
        title: publishTitle,
        tag: publishTag || "Collaboration",
        genre: publishGenre || "General",
      });
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">Loading collaborative session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center max-w-md bg-white dark:bg-slate-900/60 p-8 rounded-2xl border border-red-500/10 shadow-lg">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-500 dark:text-red-400 text-lg font-bold mb-2">Collaboration Error</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-500/10 text-xs tracking-wider uppercase"
          >
            Back to collab home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white py-8 px-4 sm:px-6 transition-colors duration-300 w-full box-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/collab")}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer border-none outline-none"
            >
              <i className="fas fa-arrow-left text-slate-500 dark:text-slate-400" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Collaborative Workspace
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase tracking-widest">
                  Room
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-wider select-all">
                ID: {roomId}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Invite Link */}
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-2 px-4 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border-none outline-none rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <i className={copiedLink ? "fas fa-check text-green-500" : "fas fa-link"} />
              {copiedLink ? "Link Copied!" : "Invite Link"}
            </button>

            {/* Publish Story */}
            <button
              disabled={!room?.story || room.story.length === 0}
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 px-5 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none outline-none rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-indigo-500/10"
            >
              <i className="fas fa-paper-plane" />
              Publish Story
            </button>

            {/* Active Users Avatars */}
            <div className="flex items-center -space-x-2.5 ml-2">
              {room?.participants.map((p) => (
                <div
                  key={p.userId}
                  style={{ borderColor: p.color }}
                  className="w-8 h-8 rounded-full border-2 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-extrabold uppercase text-slate-800 dark:text-white relative group cursor-help"
                >
                  {p.username.substring(0, 2)}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                    {p.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Published Alert */}
        {publishedPostId && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-lg" />
              <div>
                <p className="text-sm font-bold">Story Published Successfully!</p>
                <p className="text-xs opacity-80">Your collaborative masterpiece has been shared with the community.</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/post/${publishedPostId}`)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider border-none outline-none cursor-pointer"
            >
              View Post 🚀
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Document Canvas (Col 1-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col min-h-[500px]">
              {/* Document Title / Meta */}
              <div className="border-b border-slate-100 dark:border-white/5 pb-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Live Document</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {room?.story.length || 0} paragraph{(room?.story.length || 0) !== 1 && "s"}
                </span>
              </div>

              {/* Story Editor Canvas */}
              <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6 overflow-y-auto max-h-[420px] mb-6 border border-slate-100 dark:border-white/5 space-y-4">
                {room?.story && room.story.length > 0 ? (
                  <div className="space-y-4">
                    {room.story.map((chunk, idx) => (
                      <div
                        key={idx}
                        style={{ borderLeftColor: chunk.color }}
                        className={`group pl-4 py-1 border-l-4 relative transition-colors duration-150 rounded-r-md ${
                          chunk.isAI
                            ? "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]"
                            : "hover:bg-slate-100/30 dark:hover:bg-white/[0.01]"
                        }`}
                      >
                        {/* Hover Author Info */}
                        <div className="absolute left-4 -top-3.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 flex items-center gap-1 select-none">
                          <span style={{ color: chunk.color }}>{chunk.authorName}</span>
                          <span className="text-slate-400">•</span>
                          <span>{new Date(chunk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {chunk.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <span className="text-4xl mb-4 select-none">📖</span>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">The canvas is blank.</p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">Start writing below, or ask AI to write the opening paragraph!</p>
                  </div>
                )}

                {/* Typing indicators */}
                {Object.keys(typingUsers).length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pl-4 py-2 border-l-4 border-dashed border-slate-200 dark:border-white/5 select-none animate-pulse">
                    <i className="fas fa-pen-nib text-[10px]" />
                    <span>
                      {Object.values(typingUsers).join(", ")}
                      {Object.keys(typingUsers).length === 1 ? " is writing..." : " are writing..."}
                    </span>
                  </div>
                )}

                <div ref={storyEndRef} />
              </div>

              {/* Editing controls */}
              <div className="flex flex-col gap-3">
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Co-write the story... Type your addition here..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors resize-none"
                />

                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isAiThinking && (
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500 select-none">
                        <div className="animate-spin w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full" />
                        <span>AI Copilot thinking...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleAIContinue}
                      disabled={isAiThinking}
                      className="px-5 h-10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-none outline-none rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <i className="fas fa-wand-magic-sparkles mr-1.5" />
                      AI Continue ✨
                    </button>

                    <button
                      type="button"
                      onClick={handleAddText}
                      disabled={!newText.trim()}
                      className="px-6 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white border-none outline-none rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-indigo-500/10"
                    >
                      Add Paragraph
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Tabs (Col 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm min-h-[500px] flex flex-col">
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-100 dark:border-white/5 pb-3 mb-5 gap-1">
                {(["ai", "chat", "versions"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 h-9 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border-none outline-none ${
                      activeTab === tab
                        ? "bg-indigo-600 text-white"
                        : "bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab === "ai" && "✨ AI"}
                    {tab === "chat" && "💬 Chat"}
                    {tab === "versions" && "🕒 History"}
                  </button>
                ))}
              </div>

              {/* Tab content area */}
              <div className="flex-1 flex flex-col">
                {/* 1. AI Copilot Panel */}
                {activeTab === "ai" && (
                  <div className="flex-1 flex flex-col gap-5">
                    <div>
                      <h3 className="text-sm font-bold mb-1">AI Story Brainstormer</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Ask Gemini to outline plot suggestions, character names, or twists based on your current content.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="e.g. Twist for next paragraph..."
                        className="flex-1 h-10 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors"
                      />
                      <button
                        onClick={handleAIBrainstorm}
                        disabled={isAiThinking || !aiTopic.trim()}
                        className="h-10 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white border-none outline-none rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Ask
                      </button>
                    </div>

                    {/* Brainstorm output */}
                    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[260px] min-h-[220px]">
                      {brainstormSuggestions.length > 0 ? (
                        <div className="space-y-3.5">
                          <p className="text-[10px] font-bold text-amber-500 tracking-wider uppercase mb-2">💡 Brainstorm Suggestions</p>
                          {brainstormSuggestions.map((sug, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#111827]/40 border border-slate-100 dark:border-white/5 rounded-xl p-3 shadow-sm flex items-start gap-2.5">
                              <span className="text-xs font-extrabold text-amber-500 shrink-0 mt-0.5">{idx + 1}.</span>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium flex-1 m-0 select-text">
                                {sug}
                              </p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(sug);
                                  alert("Copied suggestion to clipboard!");
                                }}
                                className="w-6 h-6 rounded bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer border-none outline-none shrink-0"
                              >
                                <i className="far fa-copy text-[10px] text-slate-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                          <i className="fas fa-brain text-slate-300 dark:text-slate-700 text-3xl mb-2" />
                          <p className="text-xs font-semibold text-slate-400">Request AI brainstorming assistance above.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Room Chat Panel */}
                {activeTab === "chat" && (
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Chat Messages */}
                    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[300px] min-h-[260px] mb-3 space-y-3">
                      {room?.chats && room.chats.length > 0 ? (
                        <div className="space-y-3">
                          {room.chats.map((c, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex items-center gap-1.5 mb-0.5 select-none">
                                <span style={{ color: c.color }} className="font-bold">
                                  {c.senderName}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-[#111827]/40 px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5 m-0 select-text">
                                {c.text}
                              </p>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                          <i className="far fa-comments text-slate-300 dark:text-slate-700 text-3xl mb-2" />
                          <p className="text-xs font-semibold text-slate-400">Discussion Room is quiet.</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Start co-ordinating with collaborators!</p>
                        </div>
                      )}
                    </div>

                    {/* Chat input */}
                    <div className="flex gap-2">
                      <input
                        value={chatText}
                        onChange={(e) => setChatText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder="Write a message..."
                        className="flex-1 h-10 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors"
                      />
                      <button
                        onClick={handleSendChat}
                        className="h-10 px-4 bg-indigo-600 hover:bg-indigo-500 text-white border-none outline-none rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Versions History Panel */}
                {activeTab === "versions" && (
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    {/* Create Checkpoint */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-indigo-500 tracking-wider uppercase select-none">Create Checkpoint</span>
                      <div className="flex gap-2">
                        <input
                          value={versionName}
                          onChange={(e) => setVersionName(e.target.value)}
                          placeholder="e.g. Chapter 1 draft..."
                          className="flex-1 h-9 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-lg px-3 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors"
                        />
                        <button
                          onClick={handleSaveVersion}
                          disabled={isSavingVersion || !versionName.trim()}
                          className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white border-none outline-none rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Versions Timeline */}
                    <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[220px] min-h-[180px] space-y-3.5">
                      {room?.versions && room.versions.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2 select-none">Saved Checkpoints</p>
                          {room.versions.map((v) => (
                            <div key={v.versionIndex} className="bg-white dark:bg-[#111827]/40 border border-slate-100 dark:border-white/5 rounded-xl p-3 shadow-sm flex justify-between items-center gap-3">
                              <div className="flex-1 select-text">
                                <p className="text-xs font-bold m-0 mb-0.5">{v.name}</p>
                                <p className="text-[10px] text-slate-400 leading-tight font-medium select-none">
                                  Saved by {v.savedBy} at {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRestoreVersion(v.versionIndex)}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border-none outline-none transition-colors cursor-pointer shrink-0"
                              >
                                Restore
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                          <i className="fas fa-history text-slate-300 dark:text-slate-700 text-3xl mb-2" />
                          <p className="text-xs font-semibold text-slate-400">No checkpoints created yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              Publish Narrative
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 font-medium">
              Publish your story to the SparkAI community exploration dashboard. Make it discoverable!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Story Title</label>
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  placeholder="The Chronicles of Spark..."
                  className="w-full h-11 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Topic / Tag</label>
                  <input
                    type="text"
                    value={publishTag}
                    onChange={(e) => setPublishTag(e.target.value)}
                    placeholder="Adventure, Cyberpunk..."
                    className="w-full h-11 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Genre</label>
                  <input
                    type="text"
                    value={publishGenre}
                    onChange={(e) => setPublishGenre(e.target.value)}
                    placeholder="Sci-Fi, Fantasy..."
                    className="w-full h-11 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer border-none outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishStory}
                disabled={isPublishing || !publishTitle.trim()}
                className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer border-none outline-none shadow-md shadow-indigo-500/10 disabled:opacity-40"
              >
                {isPublishing ? "Publishing..." : "Confirm Publish 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}