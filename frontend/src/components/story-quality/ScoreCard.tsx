import React from "react";

export interface ScoreItem {
  category: string;
  score: number;
  feedback: string;
  suggestion: string;
}

export default function ScoreCard({ item }: { item: ScoreItem }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (item.score / 100) * circumference;

  return (
    <div className="border rounded-xl p-5 shadow-sm">
      <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-200 dark:text-slate-700"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-indigo-600 transition-all duration-500 ease-out"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-sm font-bold text-slate-900 dark:text-white">
          {item.score}
        </span>
      </div>

      <h3 className="font-bold mt-4 text-center">
        {item.category}
      </h3>

      <p className="text-sm mt-2">
        {item.feedback}
      </p>

      <div className="mt-3 text-blue-600 text-sm">
        💡 {item.suggestion}
      </div>
    </div>
  );
}