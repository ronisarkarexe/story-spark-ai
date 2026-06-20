import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const PHASES = [
  "Gathering plot threads…",
  "Breathing life into characters…",
  "Painting the world…",
  "Weaving the narrative…",
  "Polishing every word…",
];

type StoryGeneratingAnimationProps = {
  onCancel?: () => void;
  isHighLatency?: boolean;
};

const StoryGeneratingAnimation = ({ onCancel, isHighLatency }: StoryGeneratingAnimationProps) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const dots = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 text-white backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Story generation in progress"
    >
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/95 px-6 py-10 shadow-2xl shadow-indigo-950/40">
      {/* Orbiting dots around book icon */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {dots.map((i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full bg-indigo-400"
            animate={{
              x: 52 * Math.cos((i * 2 * Math.PI) / 8),
              y: 52 * Math.sin((i * 2 * Math.PI) / 8),
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Book icon in center */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="z-10 text-5xl select-none"
        >
          📖
        </motion.div>
      </div>

      {/* Phase label */}
      <div className="h-8 mb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
            className="text-indigo-300 font-medium text-lg text-center"
          >
            {PHASES[phaseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Typing dots */}
      <div className="flex gap-2 mb-8">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-72 h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
          initial={{ width: "18%" }}
          animate={{ width: ["18%", "88%", "18%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {isHighLatency ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-400/90 text-sm mt-2 text-center"
        >
          Experiencing high demand or network latency...<br/>We're trying a fallback model!
        </motion.p>
      ) : (
        <p className="text-gray-500 text-xs mt-1">Crafting your story with AI magic...</p>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-6 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
        >
          Cancel generation
        </button>
      )}
      </div>
    </div>
  );
};

export default StoryGeneratingAnimation;
