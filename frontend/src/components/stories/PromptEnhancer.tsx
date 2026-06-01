// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE: frontend/src/components/stories/PromptEnhancer.tsx
//
// Drop this component next to your story prompt textarea.
// It follows the same patterns as BranchingStory.tsx (framer-motion, toast,
// Tailwind, RTK Query mutation hook).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEnhancePromptMutation } from "../../redux/apis/enhance.prompt.api";

interface PromptEnhancerProps {
  /** The current value of the story prompt textarea */
  prompt: string;
  /** Called with the new value when enhancement succeeds or user reverts */
  onPromptChange: (value: string) => void;
}

const PromptEnhancer = ({ prompt, onPromptChange }: PromptEnhancerProps) => {
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const [isEnhanced, setIsEnhanced] = useState(false);

  const [enhancePrompt, { isLoading: isEnhancing }] = useEnhancePromptMutation();

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing) return;

    setOriginalPrompt(prompt);

    try {
      const result = await enhancePrompt({ prompt: prompt.trim() }).unwrap();
      onPromptChange(result.data.enhancedPrompt);
      setIsEnhanced(true);
      toast.success("Prompt enhanced!");
    } catch (error) {
      console.error("Prompt enhancement failed", error);
      toast.error("Enhancement failed. Please try again.");
      setOriginalPrompt(null);
    }
  };

  const handleRevert = () => {
    if (originalPrompt !== null) {
      onPromptChange(originalPrompt);
      setOriginalPrompt(null);
      setIsEnhanced(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {/* ✨ Enhance button */}
      <button
        type="button"
        onClick={handleEnhance}
        disabled={isEnhancing || !prompt.trim()}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300
          ${
            isEnhancing || !prompt.trim()
              ? "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
              : "border-cyan-300/40 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20"
          }`}
      >
        <AnimatePresence mode="wait">
          {isEnhancing ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
              Enhancing...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ✨ Enhance Prompt
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Revert button — only shown after a successful enhancement */}
      <AnimatePresence>
        {isEnhanced && originalPrompt !== null && (
          <motion.button
            type="button"
            onClick={handleRevert}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
          >
            ↩ Revert to original
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptEnhancer;
