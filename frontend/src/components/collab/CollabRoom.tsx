import { useParams, useNavigate } from "react-router-dom";

type RoomUpdatedPayload = {
  room?: Room;
};

type StoryUpdatedPayload = {
  story?: StoryChunk[];
};

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

    try {
      const socket = connectSocket();
      if (!socket) {
        setError("Socket.IO connection failed. Please check VITE_SOCKET_URL in frontend/.env");
        setLoading(false);
        return;
      }

      // Connect to collab namespace
     

      // Request room info
      socket.emit("collab:get_room", { roomId }, (response: { room?: Room }) => {
      const collabSocket = socket;

      // Request room info
      collabSocket.emit("collab:get_room", { roomId }, (response: { room?: Room } | null) => {
        if (response && response.room) {
          setRoom(response.room);
          setError(null);
        } else {
          setError("Room not found");
        }
        setLoading(false);
      });

      // Listen for room updates
     const handleRoomUpdated = (data: RoomUpdatedPayload) => {
      const handleRoomUpdated = (data: { room?: Room } | null) => {
        if (data && data.room) {
          setRoom(data.room);
        }
      };

     const handleStoryUpdated = (data: StoryUpdatedPayload) => {
        if (data && data.story) {
         setRoom((prev) =>
  prev && data.story ? { ...prev, story: data.story } : prev
);
        }
      };

      socket.on("collab:room_updated", handleRoomUpdated);
      socket.on("collab:story_updated", handleStoryUpdated);
     socket.on("collab:error", (data: { message: string }) => {
  setError(data.message);
  setLoading(false);
});
      const handleStoryUpdated = (data: { story?: StoryChunk[] } | null) => {
        if (data && data.story) {
          setRoom((prev) => (prev ? { ...prev, story: data.story! } : null));
        }
      };

      collabSocket.on("collab:room_updated", handleRoomUpdated);
      collabSocket.on("collab:story_updated", handleStoryUpdated);
      collabSocket.on("collab:error", (data: { message?: string } | null) => {
        setError(data?.message || "Unknown error");
        setLoading(false);
      });

      return () => {
       socket.off("collab:room_updated", handleRoomUpdated);
        socket.off("collab:story_updated", handleStoryUpdated);
      };
    } catch (err) {
      console.error("Collab error:", err);
      setError("Failed to initialize collaboration");
      setLoading(false);
    }
  }, [roomId, navigate]);

  const handleAddText = () => {
    if (!newText.trim() || !user) return;

    const socket = getSocketIo();
    if (socket) {
      socket.emit("collab:add_text", {
        roomId,
        userId: user.userId,
        text: newText,
      });
      setNewText("");
    }
  };

  const handleAIContinue = () => {
    const socket = getSocketIo();
    if (socket) {
      socket.emit("/collab").emit("collab:ai_continue", { roomId });
      socket.emit("collab:ai_continue", { roomId });
    }
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
        <div className="text-center max-w-md">
          <p className="text-red-500 dark:text-red-400 text-lg mb-2">Error</p>
          <p className="text-slate-600 dark:text-white/60 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/collab")}
            className="text-indigo-600 dark:text-indigo-400 underline"
          >
            Back to collab home
          </button>
        </div>
      </div>
    );
  }
/**
 * Collab rooms required Socket.IO to `BACKEND_URL/collab`. That is disabled in the
 * frontend (same as notification socket) to avoid slow loads and connection hangs.
 * Restore the previous implementation from git history when you run a persistent backend.
 */
export default function CollabRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0d0d14] dark:text-white flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center max-w-md">
        <p className="text-red-500 dark:text-red-400 text-lg mb-2">Collaboration unavailable</p>
        <p className="text-slate-600 dark:text-white/60 text-sm mb-6">
          Real-time collab is turned off (Socket.IO disabled). Room{" "}
          <span className="text-slate-800 dark:text-white/80 font-mono">{roomId}</span> cannot load.
        </p>
        <button
          type="button"
          onClick={() => navigate("/collab")}
          className="text-indigo-600 dark:text-indigo-400 underline"
        >
          Back to collab home
        </button>
      </div>
    </div>
  );
}
