import { motion, useReducedMotion } from "framer-motion";
import { MoodProfile } from "./StoryMoodDetector";

interface StorySceneEffectsProps {
  mood: MoodProfile;
  cinematicMode: boolean;
}

const overlayByEffect: Record<string, string> = {
  fog: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_30%),linear-gradient(180deg,rgba(127,29,29,0.18),transparent_70%)]",
  hearts:
    "bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_65%)]",
  sparkles:
    "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_28%),linear-gradient(180deg,rgba(192,132,252,0.08),transparent_70%)]",
  scanlines:
    "bg-[linear-gradient(180deg,rgba(34,211,238,0.12),transparent_30%),repeating-linear-gradient(180deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_5px)]",
  clouds:
    "bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.15),transparent_24%),linear-gradient(180deg,rgba(245,158,11,0.1),transparent_65%)]",
  vignette:
    "bg-[radial-gradient(circle_at_center,transparent_38%,rgba(15,23,42,0.6)_100%)]",
  glow: "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_60%)]",
};

const StorySceneEffects = ({
  mood,
  cinematicMode,
}: StorySceneEffectsProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 ${overlayByEffect[mood.overlayEffect] ?? overlayByEffect.glow}`}
      />
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: cinematicMode ? ["-30%", "120%"] : ["-10%", "40%"],
            opacity: cinematicMode ? [0, 0.35, 0] : [0, 0.16, 0],
          }}
          transition={{
            duration: cinematicMode ? 4.8 : 7.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {cinematicMode && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-black/55" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-black/55" />
        </>
      )}
    </>
  );
};

export default StorySceneEffects;
