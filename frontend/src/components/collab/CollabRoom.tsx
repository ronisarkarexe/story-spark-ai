import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { resolveSocketUrl } from "../../helpers/socket-url";

interface IStoryChunk {
  authorId: string;
  authorName: string;
  color: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface IParticipant {
  userId: string;
  username: string;
  color: string;
  socketId: string;
}

interface IRoom {
  roomId: string;
  participants: IParticipant[];
  story: IStoryChunk[];
}

interface ITypingUser {
  userId: string;
  username: string;
}

const BACKEND_URL = resolveSocketUrl();

export default function CollabRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [inputText, setInputText] = useState("");
  const [typingUsers, setTypingUsers] = useState<ITypingUser[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const storyEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo?._id || userInfo?.id || "guest";
  const username = userInfo?.name || userInfo?.username || "Anonymous";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const newSocket = io(`${BACKEND_URL}/collab`, {
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      if (roomId) {
        newSocket.emit("collab:join_room", { roomId, userId, username });
      }
    });

    newSocket.on("collab:joined", ({ room }) => setRoom(room));
    newSocket.on("collab:room_created", ({ room }) => setRoom(room));
    newSocket.on("collab:room_updated", ({ room }) => setRoom(room));
    newSocket.on("collab:story_updated", ({ story }) =>
      setRoom((prev) => prev ? { ...prev, story } : prev)
    );
    newSocket.on("collab:ai_thinking", () => setIsAIThinking(true));
    newSocket.on("collab:user_typing", ({ userId: uid, username: u }) => {
      setTypingUsers((prev) => {
        const existing = prev.find((user) => user.userId === uid);
        if (existing) {
          return prev.map((user) =>
            user.userId === uid ? { ...user, username: u } : user
          );
        }
        return [...prev, { userId: uid, username: u }];
      });
    });
    newSocket.on("collab:user_stop_typing", ({ userId: uid }) => {
      setTypingUsers((prev) => prev.filter((user) => user.userId !== uid));
      setIsAIThinking(false);
    });
    newSocket.on("collab:error", ({ message }) => setError(message));

    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, [roomId, token, userId, username]);

  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.story]);

  const handleAddText = () => {
    if (!inputText.trim() || !socket) return;
    socket.emit("collab:add_text", { roomId, userId, text: inputText.trim() });
    setInputText("");
    socket.emit("collab:stop_typing", { roomId, userId });
  };

  const handleAIContinue = () => {
    if (!socket) return;
    setIsAIThinking(true);
    socket.emit("collab:ai_continue", { roomId });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (!socket) return;
    socket.emit("collab:typing", { roomId, userId, username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("collab:stop_typing", { roomId, userId });
    }, 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button onClick={() => navigate("/collab")} className="text-indigo-400 underline">
          Go back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-black/30 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-indigo-400">✍️ Story Collab Room</h1>
          <p className="text-xs text-white/40">Room: {roomId}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Participants */}
          <div className="flex items-center gap-1">
            {room?.participants.map((p) => (
              <div
                key={p.userId}
                title={p.username}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                style={{ backgroundColor: p.color + "33", borderColor: p.color, color: p.color }}
              >
                {p.username[0].toUpperCase()}
              </div>
            ))}
          </div>
          <button
            onClick={copyLink}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm hover:bg-indigo-500/30 transition"
          >
            {copied ? "✅ Copied!" : "🔗 Share Link"}
          </button>
        </div>
      </div>

      {/* Story Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-4xl mx-auto w-full">
        {room?.story.length === 0 && (
          <div className="text-center text-white/30 py-20">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-lg">The story begins here...</p>
            <p className="text-sm mt-2">Add your first paragraph below!</p>
          </div>
        )}
        {room?.story.map((chunk, i) => (
          <div key={i} className={`flex gap-3 ${chunk.isAI ? "justify-center" : ""}`}>
            {!chunk.isAI && (
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1"
                style={{ backgroundColor: chunk.color + "33", color: chunk.color }}
              >
                {chunk.authorName[0].toUpperCase()}
              </div>
            )}
            <div className={`${chunk.isAI ? "w-full max-w-2xl" : "flex-1"}`}>
              {!chunk.isAI && (
                <p className="text-xs mb-1" style={{ color: chunk.color }}>
                  {chunk.authorName}
                </p>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  chunk.isAI
                    ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-yellow-100 text-center italic"
                    : "bg-white/5 border border-white/10 text-white/85"
                }`}
                style={!chunk.isAI ? { borderColor: chunk.color + "33" } : {}}
              >
                {chunk.isAI && <span className="text-yellow-400 mr-2">✨ AI</span>}
                {chunk.text}
              </div>
            </div>
          </div>
        ))}
        {isAIThinking && (
          <div className="text-center py-4">
            <span className="text-yellow-400 animate-pulse">✨ AI is writing...</span>
          </div>
        )}
        {typingUsers.length > 0 && (
          <p className="text-xs text-white/40 italic">
            {typingUsers.map((user) => user.username).join(", ")}{" "}
            {typingUsers.length === 1 ? "is" : "are"} typing...
          </p>
        )}
        <div ref={storyEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={inputText}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddText();
              }
            }}
            placeholder="Continue the story... (Enter to submit)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddText}
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-sm font-medium transition"
            >
              Add ✍️
            </button>
            <button
              onClick={handleAIContinue}
              disabled={isAIThinking}
              className="px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 disabled:opacity-40 text-yellow-400 text-sm font-medium transition"
            >
              {isAIThinking ? "..." : "AI ✨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
