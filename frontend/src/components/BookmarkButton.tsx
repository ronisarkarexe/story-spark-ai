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

const BookmarkButton = ({
  storyId,
  className = "",
}: BookmarkButtonProps) => {
  const navigate = useNavigate();
  const currentUser = getUserInfo();
  const [toggleBookmark] = useToggleBookmarkMutation();

  // Local states to prevent race conditions and handle snappy UI transitions
  const [isOptimisticBookmarked, setIsOptimisticBookmarked] =
    useState<boolean | null>(null);
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
  const isCurrentlyBookmarked =
    isOptimisticBookmarked ?? statusData?.isBookmarked ?? false;

  // ...rest of your component remains unchanged
};

export default BookmarkButton;
