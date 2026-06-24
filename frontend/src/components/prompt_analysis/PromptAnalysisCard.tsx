import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AlertCircle, Zap } from "lucide-react";
import CreativityScoreCard from "./CreativityScoreCard";
import EnhancedPromptCard from "./EnhancedPromptCard";
import PromptSuggestionsCard from "./PromptSuggestionsCard";
import { analyzePrompt, IPromptAnalysisResponse } from "../../services/prompt_analysis.service";

interface PromptAnalysisCardProps {
  /** The prompt to analyze */
  prompt: string;
  /** Optional language for analysis */
  language?: string;
  /** Optional genre */
  genre?: string;
  /** Optional tone */
  tone?: string;
  /** Called when user wants to use enhanced prompt */
  onUseEnhanced?: (enhancedPrompt: string) => void;
  /** Called when analysis is complete */
  onAnalysisComplete?: (analysis: IPromptAnalysisResponse) => void;
  /** Auto-analyze on mount if prompt is provided */
  autoAnalyze?: boolean;
}

const PromptAnalysisCard: React.FC<PromptAnalysisCardProps> = ({
  prompt,
  language,
  genre,
  tone,
  onUseEnhanced,
  onAnalysisComplete,
  autoAnalyze = false,
}) => {
  const [analysis, setAnalysis] = useState<IPromptAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const previousPromptRef = useRef(prompt);

  useEffect(() => {
    if (prompt !== previousPromptRef.current) {
      previousPromptRef.current = prompt;
      setAnalysis(null);
      setIsExpanded(false);
      setError(null);
    }
  }, [prompt]);

  const handleAnalyze = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to analyze");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzePrompt({
        prompt: prompt.trim(),
        language,
        genre,
        tone,
      });

      setAnalysis(result);
      setIsExpanded(true);
      onAnalysisComplete?.(result);
      toast.success("Prompt analyzed successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze prompt";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language, genre, tone, onAnalysisComplete]);

  // Clear stale results when the prompt changes (e.g. navigating to a different story)
  React.useEffect(() => {
    setAnalysis(null);
    setError(null);
    setIsExpanded(false);
  }, [prompt]);

  // Auto-analyze if enabled and prompt is provided
  React.useEffect(() => {
    if (autoAnalyze && prompt.trim() && !analysis && !isLoading) {
      handleAnalyze();
    }
  }, [autoAnalyze, prompt, analysis, isLoading, handleAnalyze]);

  return (
    <div className="w-full space-y-4">
      {/* Analysis Trigger Button */}
      {!analysis && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleAnalyze}
          disabled={isLoading || !prompt.trim()}
          className={`w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-all duration-300 ${
            isLoading || !prompt.trim()
              ? "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
              : "border-cyan-500/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-200 hover:from-cyan-500/20 hover:to-blue-500/20"
          }`}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                Analyzing...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Analyze Prompt
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Analysis Failed</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            {/* Creativity Score Card */}
            <CreativityScoreCard
              score={analysis.creativityScore}
              complexity={analysis.complexity}
              promptLength={analysis.promptLength}
              estimatedGenerationTime={analysis.estimatedGenerationTime}
              isLoading={isLoading}
            />

            {/* Enhanced Prompt Card */}
            <EnhancedPromptCard
              originalPrompt={analysis.prompt}
              enhancedPrompt={analysis.enhancedPrompt}
              onUseEnhanced={onUseEnhanced}
              isLoading={isLoading}
            />

            {/* Suggestions Card */}
            <PromptSuggestionsCard
              improvements={analysis.improvements}
              recommendations={analysis.recommendations}
              isLoading={isLoading}
            />

            {/* Keywords Display */}
            {analysis.keywords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 backdrop-blur-sm"
              >
                <h3 className="mb-4 text-sm font-semibold text-slate-300">
                  Identified Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sentiment Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-4 text-sm font-semibold text-slate-300">
                Sentiment Analysis
              </h3>
              <div className="space-y-3">
                {/* Positive */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Positive</span>
                    <span className="font-semibold text-emerald-300">
                      {Math.round(analysis.sentimentScore.positive * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${analysis.sentimentScore.positive * 100}%`,
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                {/* Neutral */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Neutral</span>
                    <span className="font-semibold text-slate-300">
                      {Math.round(analysis.sentimentScore.neutral * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${analysis.sentimentScore.neutral * 100}%`,
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                {/* Negative */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Negative</span>
                    <span className="font-semibold text-rose-300">
                      {Math.round(analysis.sentimentScore.negative * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-400"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${analysis.sentimentScore.negative * 100}%`,
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reset Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setAnalysis(null);
                setIsExpanded(false);
                setError(null);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10"
            >
              Analyze Different Prompt
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptAnalysisCard;
