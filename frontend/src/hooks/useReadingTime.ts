import { useMemo } from "react";
import { getReadingTime } from "../utils/readingTime";

export const useReadingTime = (text: string) => {
  return useMemo(() => {
    return getReadingTime(text || "");
  }, [text]);
};
