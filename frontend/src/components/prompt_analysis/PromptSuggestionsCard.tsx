import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";

interface Suggestion {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface PromptSuggestionsCardProps {
  improvements: string[];
  recommendations: Suggestion[];
  isLoading?: boolean;
}

const PromptSuggestionsCard: React.FC<PromptSuggestionsCardProps> = ({
  improvements,
  recommendations,
  isLoading = false,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
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
      <div className="mb-6 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Improvement Suggestions</h3>
      </div>

      {/* Improvements List */}
      {improvements.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold text-slate-300">Quick Tips</h4>
          <div className="space-y-2">
            {improvements.map((improvement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                </div>
                <p className="text-sm text-slate-200">{improvement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Accordion */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-300">Detailed Recommendations</h4>
          <div className="space-y-2">
            {recommendations.map((recommendation, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="overflow-hidden rounded-lg border border-white/10 bg-white/5"
              >
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === idx ? null : idx)
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getImpactColor(recommendation.impact)}`}
                    >
                      {recommendation.impact} Impact
                    </div>
                    <span className="font-medium text-white">
                      {recommendation.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedIndex === idx ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10 px-4 py-3 bg-white/5"
                    >
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {recommendation.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {improvements.length === 0 && recommendations.length === 0 && !isLoading && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-sm text-slate-400">
            No suggestions available. Your prompt is already well-crafted!
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
        </div>
      )}
    </motion.div>
  );
};

export default PromptSuggestionsCard;
