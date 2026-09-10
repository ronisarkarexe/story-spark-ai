import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowRight, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

interface EnhancedPromptCardProps {
  originalPrompt: string;
  enhancedPrompt: string;
  onUseEnhanced?: (prompt: string) => void;
  isLoading?: boolean;
}

const EnhancedPromptCard: React.FC<EnhancedPromptCardProps> = ({
  originalPrompt,
  enhancedPrompt,
  onUseEnhanced,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt).catch(() => {});
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseEnhanced = () => {
    if (onUseEnhanced) {
      onUseEnhanced(enhancedPrompt);
      toast.success("Enhanced prompt applied!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Enhanced Prompt</h3>
      </div>

      {/* Enhanced Prompt Display */}
      <div className="mb-4 overflow-hidden rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
        <p className="leading-relaxed text-slate-100">{enhancedPrompt}</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={handleCopy}
          disabled={isLoading || copied}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition-all duration-200 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Prompt
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={handleUseEnhanced}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition-all duration-200 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="h-4 w-4" />
          Use Enhanced
        </button>
      </div>

      {/* Comparison Toggle */}
      <motion.button
        onClick={() => setShowComparison(!showComparison)}
        className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-white/10"
      >
        {showComparison ? "Hide Comparison" : "Show Before & After"}
      </motion.button>

      {/* Comparison View */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Original */}
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                <p className="mb-2 text-xs font-semibold text-red-300">Original</p>
                <p className="text-xs leading-relaxed text-slate-300">{originalPrompt}</p>
              </div>

              {/* Enhanced */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <p className="mb-2 text-xs font-semibold text-emerald-300">Enhanced</p>
                <p className="text-xs leading-relaxed text-slate-300">{enhancedPrompt}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedPromptCard;
