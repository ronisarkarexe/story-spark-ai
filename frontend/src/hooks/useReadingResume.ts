import { useEffect, useState } from "react";
import {
  saveReadingPosition,
  getReadingPosition,
  resetReadingPosition,
} from "../utils/readingProgress";

export default function useReadingResume(storyId: string) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    setPosition(getReadingPosition(storyId));
  }, [storyId]);

  const updatePosition = (value: number) => {
    setPosition(value);
    saveReadingPosition(storyId, value);
  };

  const resetProgress = () => {
    resetReadingPosition(storyId);
    setPosition(0);
  };

  return {
    position,
    updatePosition,
    resetProgress,
  };
}