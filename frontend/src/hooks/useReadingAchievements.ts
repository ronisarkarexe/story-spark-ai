import { useMemo } from "react";
import { getAchievementBadges } from "../utils/readingAchievements";

export default function useReadingAchievements(
  storiesRead: number,
  genresRead: number,
  streak: number
) {
  return useMemo(() => {
    return getAchievementBadges(
      storiesRead,
      genresRead,
      streak
    );
  }, [storiesRead, genresRead, streak]);
}