import React from "react";

interface ReadingProgressBarProps {
  progress: number;
  onContinue?: () => void;
}

const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progress,
  onContinue,
}) => {
  return (
    <div className="w-full mb-4 rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-200">
          📖 Reading Progress
        </h3>

        <span className="text-sm text-blue-400 font-bold">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Continue Reading Button */}
      {progress > 0 && progress < 100 && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-3 rounded-lg px-4 py-2 bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors"
        >
          Continue Reading
        </button>
      )}

      {progress === 100 && (
        <p className="mt-3 text-green-400 font-medium">
          ✅ Story completed!
        </p>
      )}
    </div>
  );
};

export default ReadingProgressBar;