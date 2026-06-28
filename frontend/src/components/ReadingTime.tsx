import React, { useMemo } from "react";
import { calculateReadingTime } from "../utils/readingTime";

interface ReadingTimeProps {
  content: string | undefined | null;
  className?: string;
  iconClassName?: string;
}

export const ReadingTime: React.FC<ReadingTimeProps> = ({
  content,
  className = "inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium",
  iconClassName = "far fa-clock text-current text-[11px]",
}) => {
  const readingTimeStr = useMemo(() => calculateReadingTime(content), [content]);

  return (
    <span
      className={className}
      aria-label={`Reading time: ${readingTimeStr}`}
      title={readingTimeStr}
    >
      <i className={iconClassName} aria-hidden="true"></i>
      <span>{readingTimeStr}</span>
    </span>
  );
};

export default ReadingTime;
