import { useOfflineStatus } from "../hooks/useOfflineStatus";

export const OfflineBanner = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-600 text-white text-center py-2 text-sm font-semibold z-[9999] shadow-md flex items-center justify-center gap-2 transition-all duration-300">
      <i className="fas fa-wifi-slash"></i>
      <span>
        You are currently offline. Viewing cached stories in Offline Reading
        Mode.
      </span>
    </div>
  );
};
