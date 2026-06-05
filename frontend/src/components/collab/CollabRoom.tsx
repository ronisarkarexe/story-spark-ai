import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  connectCollabSocket,
  disconnectCollabSocket,
  getCollabSocketIo,
} from "../../socket/socket.oi";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";

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
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 p-8 text-center">
          <p className="text-lg font-semibold text-red-700 dark:text-red-200 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
                >
                  Ask AI to Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
