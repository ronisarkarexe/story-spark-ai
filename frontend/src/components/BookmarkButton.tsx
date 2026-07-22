import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getUserInfo } from "../services/auth.service";
import {
  useToggleBookmarkMutation,
  useCheckBookmarkStatusQuery,
} from "../redux/apis/bookmark.api";

interface BookmarkButtonProps {
  storyId: string;
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  storyId,
  className = "",
}) => {
  const navigate = useNavigate();
  const currentUser = getUserInfo();
  const [toggleBookmark] = useToggleBookmarkMutation();
  
  // Local states to prevent race conditions and handle snappy UI transitions
  const [isOptimisticBookmarked, setIsOptimisticBookmarked] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Bookmark state comes from the per-user status endpoint
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useCheckBookmarkStatusQuery(storyId, {
    skip: !currentUser?.userId || !storyId,
  });

  // Keep local state perfectly synchronized when backend query changes/resolves
  useEffect(() => {
    if (statusData !== undefined) {
      setIsOptimisticBookmarked(statusData.isBookmarked);
    }
  }, [statusData]);

  // Derive final value, falling back to query data if optimistic value isn't evaluated yet
  const isCurrentlyBookmarked = isOptimisticBookmarked ?? statusData?.isBookmarked ?? false;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // GUARD: If a toggle operation is actively in-flight, discard incoming clicks
    if (isProcessing) return;

    if (!currentUser || !currentUser.email) {
      toast.error("You need to login to bookmark stories!");
      navigate("/login");
      return;
    }

    // Capture state immediately prior to mutation block for rollback capability
    const previousState = isCurrentlyBookmarked;
    
    // Set lock flag and update state optimistically
    setIsProcessing(true);
    setIsOptimisticBookmarked(!previousState);

    try {
      const response = await toggleBookmark(storyId).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      console.error("Failed to toggle bookmark", error);
      
      // Rollback to previous state on failure
      setIsOptimisticBookmarked(previousState);
      
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      // Release request lock boundary
      setIsProcessing(false);
    }
  };

  if (!storyId) {
    return (
      <button
        disabled
        title="No story selected"
        aria-label="No story selected"
        className={`!rounded-button cursor-not-allowed opacity-40 border px-3 py-1 flex items-center justify-center border-gray-600 ${className}`}
      >
        <i className="far fa-bookmark"></i>
      </button>
    );
  }

  if (isStatusError) {
    return (
      <button
        disabled
        title="Unable to load bookmark status"
        aria-label="Unable to load bookmark status"
        className={`!rounded-button cursor-not-allowed border px-3 py-1 flex items-center justify-center border-red-500/50 text-red-400 bg-red-500/10 ${className}`}
      >
        <i className="fas fa-exclamation-triangle text-xs"></i>
      </button>
    );
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={isProcessing || isStatusLoading}
      title={isCurrentlyBookmarked ? "Remove bookmark" : "Save story"}
      aria-label={isCurrentlyBookmarked ? "Remove bookmark" : "Save story"}
      className={`!rounded-button cursor-pointer transition-all duration-300 border px-3 py-1 flex items-center justify-center hover:scale-105 active:scale-95 ${
        isStatusLoading
          ? "border-gray-600 text-gray-500 animate-pulse"
          : isCurrentlyBookmarked
            ? "text-purple-400 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 hover:text-purple-300"
            : "hover:text-gray-400 border-gray-600 hover:border-gray-500"
      } ${className}`}
    >
      <i
        className={`${
          isCurrentlyBookmarked ? "fas" : "far"
        } fa-bookmark transition-transform duration-300 ${
          isProcessing ? "animate-pulse" : ""
        }`}
      ></i>
    </button>
  );
};

export default BookmarkButton;