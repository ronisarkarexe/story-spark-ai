import { useParams, useNavigate } from "react-router-dom";

/**
 * Collab rooms required Socket.IO to `BACKEND_URL/collab`. That is disabled in the
 * frontend (same as notification socket) to avoid slow loads and connection hangs.
 * Restore the previous implementation from git history when you run a persistent backend.
 */
export default function CollabRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-red-400 text-lg mb-2">Collaboration unavailable</p>
        <p className="text-white/60 text-sm mb-6">
          Real-time collab is turned off (Socket.IO disabled). Room{" "}
          <span className="text-white/80 font-mono">{roomId}</span> cannot load.
        </p>
        <button
          type="button"
          onClick={() => navigate("/collab")}
          className="text-indigo-400 underline"
        >
          Back to collab home
        </button>
      </div>
    </div>
  );
}
