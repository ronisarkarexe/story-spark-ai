import React, { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  // Bookmark state comes from the per-user status endpoint (single source of truth).
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useCheckBookmarkStatusQuery(storyId, {
    skip: !currentUser?.userId || !storyId,
  });
  const isCurrentlyBookmarked = Boolean(statusData?.isBookmarked);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser || !currentUser.email) {
      toast.error("You need to login to bookmark stories!");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await toggleBookmark(storyId).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      console.error("Failed to toggle bookmark", error);
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
      disabled={isLoading || isStatusLoading}
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
          isLoading ? "animate-pulse" : ""
        }`}
      ></i>
    </button>
  );
};

export default BookmarkButton;
