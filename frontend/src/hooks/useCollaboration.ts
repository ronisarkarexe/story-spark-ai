import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "../services/auth.service";
import { resolveSocketUrl } from "../helpers/socket-url";

export interface Participant {
  userId: string;
  username: string;
  color: string;
  socketId: string;
}

export interface StoryChunk {
  authorId: string;
  authorName: string;
  color: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

export interface CollabRoom {
  roomId: string;
  createdBy: string;
  participants: Participant[];
  story: StoryChunk[];
  createdAt: Date;
}

interface UseCollaborationOptions {
  roomId: string | undefined;
  onError?: (message: string) => void;
}

interface UseCollaborationReturn {
  room: CollabRoom | null;
  loading: boolean;
  error: string | null;
  typingUsers: Record<string, string>;
  isAiThinking: boolean;
  addText: (text: string) => void;
  emitTyping: () => void;
  stopTyping: () => void;
  requestAiContinue: () => void;
}

export function useCollaboration({
  roomId,
  onError,
}: UseCollaborationOptions): UseCollaborationReturn {
  const socketRef = useRef<Socket | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [room, setRoom] = useState<CollabRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const socketUrl = resolveSocketUrl();
    const token = getToken();

    if (!socketUrl || !token) {
      setError("Socket connection failed. Please check your network.");
      setLoading(false);
      return;
    }

    const socket = io(`${socketUrl}/collab`, {
      transports: ["websocket", "polling"],
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.emit("collab:join_room", { roomId });

    const handleJoined = (response: { room?: CollabRoom; message?: string }) => {
      if (response?.room) {
        setRoom(response.room);
        setError(null);
      } else {
        const msg = response?.message || "Room not found";
        setError(msg);
        onError?.(msg);
      }
      setLoading(false);
    };

    socket.on("collab:joined", handleJoined);

    socket.on("collab:room_updated", (data: { room?: CollabRoom }) => {
      if (data?.room) setRoom(data.room);
    });

    socket.on(
      "collab:story_updated",
      (data: { story?: StoryChunk[] }) => {
        if (data?.story) {
          setRoom((prev) => (prev ? { ...prev, story: data.story! } : null));
        }
        setIsAiThinking(false);
      }
    );

    socket.on(
      "collab:user_typing",
      (data: { userId: string; username: string }) => {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: data.username }));
      }
    );

    socket.on("collab:user_stop_typing", (data: { userId: string }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[data.userId];
        return updated;
      });
    });

    socket.on("collab:ai_thinking", () => setIsAiThinking(true));

    socket.on("collab:error", (data: { message: string }) => {
      const msg = data?.message || "Collaboration error occurred.";
      setError(msg);
      onError?.(msg);
      setLoading(false);
    });

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      socket.off("collab:joined", handleJoined);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, onError]);

  const addText = useCallback(
    (text: string) => {
      if (!socketRef.current || !roomId || !text.trim()) return;
      socketRef.current.emit("collab:add_text", { roomId, text: text.trim() });
      socketRef.current.emit("collab:stop_typing", { roomId });
    },
    [roomId]
  );

  const emitTyping = useCallback(() => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit("collab:typing", { roomId });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socketRef.current?.emit("collab:stop_typing", { roomId });
    }, 300);
  }, [roomId]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current || !roomId) return;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    socketRef.current.emit("collab:stop_typing", { roomId });
  }, [roomId]);

  const requestAiContinue = useCallback(() => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit("collab:ai_continue", { roomId });
  }, [roomId]);

  return {
    room,
    loading,
    error,
    typingUsers,
    isAiThinking,
    addText,
    emitTyping,
    stopTyping,
    requestAiContinue,
  };
}
