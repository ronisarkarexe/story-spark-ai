/**
 * Integration component for the Prompt Analysis Feature
 * This wrapper component integrates AI Prompt Enhancement & Creativity Score System
 * into the existing story generation flow.
 * 
 * Usage in stories.component.tsx:
 * <PromptAnalysisIntegration
 *   prompt={textareaValue}
 *   language={selectedLanguage}
 *   genre={selectedGenre}
 *   tone={selectedTone}
 *   onUseEnhanced={handleUseEnhancedPrompt}
 * />
 */

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import PromptAnalysisCard from "./PromptAnalysisCard";

interface PromptAnalysisIntegrationProps {
  /** Current prompt value */
  prompt: string;
  /** Language for analysis */
  language?: string;
  /** Genre for analysis */
  genre?: string;
  /** Tone for analysis */
  tone?: string;
  /** Callback when user wants to use enhanced prompt */
  onUseEnhanced?: (enhancedPrompt: string) => void;
  /** Show/hide toggle - optional, can be controlled from parent */
  defaultExpanded?: boolean;
}

/**
 * Integrates prompt analysis into story generation workflow
 * This component adds a collapsible panel with full prompt analysis capabilities
 */
const PromptAnalysisIntegration: React.FC<PromptAnalysisIntegrationProps> = ({
  prompt,
  language,
  genre,
  tone,
  onUseEnhanced,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 w-full"
    >
      {/* Collapsible Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 px-4 py-3 hover:border-white/20 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse" />
          <span className="font-medium text-white">AI Prompt Enhancement</span>
          <span className="text-xs text-slate-400 ml-2">
            Get creativity scores & suggestions
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </motion.div>
      </motion.button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <PromptAnalysisCard
              prompt={prompt}
              language={language}
              genre={genre}
              tone={tone}
              onUseEnhanced={(enhancedPrompt) => {
                onUseEnhanced?.(enhancedPrompt);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PromptAnalysisIntegration;
