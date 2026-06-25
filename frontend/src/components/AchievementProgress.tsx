import React, { useState, useEffect } from "react";

interface AchievementProgressProps {
  progress: number;
  target: number;
  label?: string;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({
  progress,
  target,
  label,
}) => {
  const percentage = Math.min(100, Math.max(0, (progress / target) * 100));
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    // Start animation on mount or when percentage changes on the next paint
    const animationFrameId = requestAnimationFrame(() => {
      setAnimatedWidth(percentage);
    });
    return () => cancelAnimationFrame(animationFrameId);
  }, [percentage]);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
        <span>{label || "Progress"}</span>
        <span aria-label={`${progress} out of ${target}`}>
          {progress.toLocaleString()} / {target.toLocaleString()} ({Math.round(percentage)}%)
        </span>
      </div>
      <div 
        className="w-full bg-slate-100 dark:bg-white/[0.05] h-2.5 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-label={label || "Achievement progress"}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
};

export default AchievementProgress;

