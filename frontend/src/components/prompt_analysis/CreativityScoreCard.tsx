import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Zap, TrendingUp } from "lucide-react";

interface CreativityScoreCardProps {
  score: number; // 0-100
  complexity: "simple" | "moderate" | "complex";
  promptLength: number;
  estimatedGenerationTime: number;
  isLoading?: boolean;
}

const CreativityScoreCard: React.FC<CreativityScoreCardProps> = ({
  score,
  complexity,
  promptLength,
  estimatedGenerationTime,
  isLoading = false,
}) => {
  const getScoreColor = () => {
    if (score >= 75) return "from-emerald-500 to-green-400";
    if (score >= 50) return "from-yellow-500 to-orange-400";
    return "from-rose-500 to-red-400";
  };

  const getScoreLabel = () => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    return "Fair";
  };

  const getComplexityColor = () => {
    switch (complexity) {
      case "simple":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "moderate":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "complex":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Creativity Score</h3>
        </div>
        {isLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        )}
      </div>

      {/* Score Display */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 text-4xl font-bold text-white">{score}</div>
          <p className="text-sm text-slate-400">{getScoreLabel()} Creativity</p>
        </div>

        {/* Score Visualization */}
        <div className="relative h-24 w-24">
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score / 100) * 282.7} 282.7`}
              initial={{ strokeDasharray: "0 282.7" }}
              animate={{ strokeDasharray: `${(score / 100) * 282.7} 282.7` }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-center text-xs font-semibold text-slate-300">
              {Math.round((score / 100) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Complexity */}
        <div className="rounded-lg bg-white/5 p-3">
          <p className="mb-1 text-xs font-medium text-slate-400">Complexity</p>
          <div className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getComplexityColor()}`}>
            {complexity}
          </div>
        </div>

        {/* Prompt Length */}
        <div className="rounded-lg bg-white/5 p-3">
          <p className="mb-1 text-xs font-medium text-slate-400">Length</p>
          <div className="text-sm font-semibold text-cyan-300">{promptLength} chars</div>
        </div>

        {/* Est. Generation Time */}
        <div className="rounded-lg bg-white/5 p-3">
          <p className="mb-1 text-xs font-medium text-slate-400">Est. Time</p>
          <div className="text-sm font-semibold text-cyan-300">{estimatedGenerationTime}s</div>
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="mt-4 flex items-start gap-3 rounded-lg bg-cyan-500/10 p-3 text-sm text-cyan-200">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          {score >= 75
            ? "Your prompt shows excellent creativity! It's well-structured and engaging."
            : score >= 50
              ? "Your prompt has good potential. Consider adding more specific details for better results."
              : "Your prompt could be more engaging. Review the suggestions below to improve it."}
        </p>
      </div>
    </motion.div>
  );
};

export default CreativityScoreCard;
