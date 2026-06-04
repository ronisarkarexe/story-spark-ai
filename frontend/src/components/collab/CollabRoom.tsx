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

    const socket = connectSocket();

    if (!socket) {
      setError("Socket connection failed");
      setLoading(false);
      return;
    }

    socket.emit(
      "collab:get_room",
      { roomId },
      (response: CollabRoomResponse) => {
        if (response?.room) {
          setRoom(response.room);
        } else {
          setError(response?.message || "Room not found");
        }
        setLoading(false);
      }
    );

    const handleRoomUpdated = (data: CollabRoomResponse) => {
      if (data?.room) setRoom(data.room);
    };

    const handleStoryUpdated = (data: CollabStoryResponse) => {
      if (data?.story) {
        setRoom((prev) =>
          prev ? { ...prev, story: data.story! } : prev
        );
      }
    };

    const handleError = (data: CollabRoomResponse) => {
      setError(data?.message || "Collaboration error");
    };

    socket.on("collab:room_updated", handleRoomUpdated);
    socket.on("collab:story_updated", handleStoryUpdated);
    socket.on("collab:error", handleError);

    return () => {
      socket.off("collab:room_updated", handleRoomUpdated);
      socket.off("collab:story_updated", handleStoryUpdated);
      socket.off("collab:error", handleError);
      socket.disconnect();
    };
  }, [roomId, navigate]);

  const handleAddText = () => {
    if (!newText.trim() || !user || !roomId) return;

    const socket = getSocketIo();
    if (!socket) return;

    socket.emit("collab:add_text", {
      roomId,
      userId: user.userId,
      text: newText,
    });

    setNewText("");
  };

  const handleAIContinue = () => {
    const socket = getSocketIo();
    if (!socket || !roomId) return;

    socket.emit("collab:ai_continue", { roomId });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-500">{error}</p>
          <button onClick={() => navigate("/collab")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Room: {roomId}</h1>

      {/* Story */}
      <div className="mt-4 p-4 border rounded">
        {room.story.length === 0 ? (
          <p>No story yet</p>
        ) : (
          room.story.map((c, i) => (
            <p key={i}>
              <b style={{ color: c.color }}>{c.authorName}:</b>{" "}
              {c.text}
            </p>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddText()}
          className="border p-2 flex-1"
          placeholder="Write something..."
        />

        <button onClick={handleAddText}>Add</button>
        <button onClick={handleAIContinue}>AI ✨</button>
      </div>

      {/* Participants */}
      <div className="mt-6">
        <h2>Participants ({room.participants.length})</h2>
        {room.participants.map((p) => (
          <div key={p.userId}>
            <span style={{ color: p.color }}>●</span> {p.username}
          </div>
        ))}
      </div>
    </div>
  );
}