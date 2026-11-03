import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  senderId: string;
  senderName: string;
  senderColor: string;
  content: string;
  type: "message" | "system";
  timestamp: Date | string;
}

interface CollabChatPanelProps {
  socket: any;
  roomId: string;
  currentUserId: string;
  currentUsername: string;
}

export default function CollabChatPanel({
  socket,
  roomId,
  currentUserId,
  currentUsername,
}: CollabChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Load history and listen for incoming messages
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("collab:chat_history", { roomId });

    const handleHistory = ({ messages: history }: { messages: ChatMessage[] }) => {
      setMessages(history);
    };

    const handleMessage = ({ message }: { message: ChatMessage }) => {
      setMessages((prev) => [...prev, message]);
      if (!isOpen) setUnread((n) => n + 1);
    };

    const handleTyping = ({ username }: { username: string }) => {
      if (username === currentUsername) return;
      setTypingUsers((prev) =>
        prev.includes(username) ? prev : [...prev, username]
      );
    };

    const handleStopTyping = ({ username }: { username: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    socket.on("collab:chat_history", handleHistory);
    socket.on("collab:chat_message", handleMessage);
    socket.on("collab:chat_typing", handleTyping);
    socket.on("collab:chat_stop_typing", handleStopTyping);

    return () => {
      socket.off("collab:chat_history", handleHistory);
      socket.off("collab:chat_message", handleMessage);
      socket.off("collab:chat_typing", handleTyping);
      socket.off("collab:chat_stop_typing", handleStopTyping);
    };
  }, [socket, roomId, currentUsername, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Clear unread when panel opens
  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !socket) return;
    socket.emit("collab:chat_send", { roomId, content: trimmed });
    stopTypingSignal();
    setInput("");
  };

  const stopTypingSignal = () => {
    if (isTypingRef.current) {
      socket?.emit("collab:chat_stop_typing", { roomId, username: currentUsername });
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!socket) return;
    if (!isTypingRef.current) {
      socket.emit("collab:chat_typing", { roomId, username: currentUsername });
      isTypingRef.current = true;
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTypingSignal, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (ts: Date | string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toggle button (visible on mobile / collapsed state) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/80 shrink-0">
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          aria-expanded={isOpen}
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Room Chat
          {unread > 0 && !isOpen && (
            <span className="ml-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs font-bold text-white">
              {unread}
            </span>
          )}
        </button>
        <span className="text-xs text-slate-500">{messages.filter(m => m.type === "message").length} messages</span>
      </div>

      {/* Message list */}
      <div className={`flex-1 overflow-y-auto px-3 py-2 space-y-2 transition-all ${isOpen ? "block" : "hidden sm:block"}`}>
        {messages.length === 0 && (
          <p className="text-center text-xs text-slate-500 mt-4">No messages yet. Say hello! 👋</p>
        )}
        {messages.map((msg, i) => {
          if (msg.type === "system") {
            return (
              <div key={i} className="flex justify-center">
                <span className="text-xs text-slate-500 italic bg-slate-800/60 px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={i} className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
              {!isMine && (
                <span className="text-xs font-semibold pl-1" style={{ color: msg.senderColor }}>
                  {msg.senderName}
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm break-words ${
                  isMine
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-slate-700/80 text-slate-100 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-500 px-1">{formatTime(msg.timestamp)}</span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-xs text-slate-400 italic">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing
            </span>
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`shrink-0 px-3 py-3 border-t border-slate-700/50 bg-slate-800/60 ${isOpen ? "flex" : "hidden sm:flex"} gap-2`}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          maxLength={500}
          aria-label="Chat message"
          className="flex-1 min-w-0 rounded-xl bg-slate-700/60 border border-slate-600/50 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          aria-label="Send message"
          className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}