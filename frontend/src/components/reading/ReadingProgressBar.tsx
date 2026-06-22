import React from "react";
import { motion } from "framer-motion";

interface ReadingProgressBarProps {
  progress: number;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ progress }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-1 bg-transparent z-[100] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-650"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      />
    </div>
  );
};

export default ReadingProgressBar;
