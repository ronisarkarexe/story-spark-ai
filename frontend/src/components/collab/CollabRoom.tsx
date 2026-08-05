import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth.service";
import { isLoggedIn, getUserInfo } from "../../services/auth.service";
import { resolveSocketUrl } from '../../helpers/socket-url';
import CollabEditor from './CollabEditor';
import { io, type Socket } from "socket.io-client";
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
  const [collabSocket, setCollabSocket] = useState<Socket | null>(null);
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

    let socketInstance: Socket;

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
      const handleJoined = (data: CollabRoomResponse) => {
        if (data && data.room) {
          setRoom(data.room);
          setError(null);
        } else {
          setError(data.message || "Room not found");
        }
        setLoading(false);
      };

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
        setLoading(false);
      };

      socketInstance.on("collab:joined", handleJoined);
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
        socketInstance.off("collab:joined", handleJoined);
        socketInstance.off("collab:room_updated", handleRoomUpdated);
        socketInstance.off("collab:story_updated", handleStoryUpdated);
        socketInstance.off("collab:user_typing", handleUserTyping);
        socketInstance.off("collab:user_stop_typing", handleUserStopTyping);
        socketInstance.off("collab:ai_thinking", handleAiThinking);
        socketInstance.off("collab:error", handleError);
        socketInstance.disconnect();
      };
   } catch (err) {
  logger.error("Collab initialization error:", err);
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
  logger.debug("Native share canceled or failed, using fallback.", err);
  fallbackCopyToClipboard(currentUrl);
}
    } else {
      fallbackCopyToClipboard(currentUrl);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
    .catch(err => console.error(err))