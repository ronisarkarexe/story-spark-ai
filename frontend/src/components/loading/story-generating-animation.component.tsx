import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MoodProfile } from "../story-effects/StoryMoodDetector";

const DEFAULT_MOOD: MoodProfile = {
  mood: "drama",
  confidence: 0.5,
  animationTheme: "cinematic",
  soundTheme: "soft-strings",
  backgroundStyle: "from-slate-950 via-blue-950/90 to-violet-950/80",
  overlayEffect: "glow",
  narrationTone: "grounded",
  accentClass: "from-slate-100 via-blue-200 to-violet-200",
  cardClassName:
    "border-blue-300/20 bg-slate-950/40 shadow-[0_0_70px_rgba(96,165,250,0.15)]",
  particleShape: "star",
  particleColors: ["#bfdbfe", "#c4b5fd", "#e2e8f0"],
};

const loadingPhases: Record<string, string[]> = {
  romance: [
    "Listening for tender sparks...",
    "Painting a dreamy atmosphere...",
    "Scoring soft dialogue beats...",
    "Framing the final heartfelt moment...",
  ],
  horror: [
    "Summoning eerie tension...",
    "Breathing fog into the scene...",
    "Timing each flicker in the dark...",
    "Sharpening the final shiver...",
  ],
  fantasy: [
    "Gathering enchanted details...",
    "Igniting magical particles...",
    "Calling heroes into the frame...",
    "Polishing a mythic ending...",
  ],
  "sci-fi": [
    "Projecting holographic scenes...",
    "Scanning futuristic environments...",
    "Calibrating neon motion...",
    "Finalizing cinematic output...",
  ],
  mystery: [
    "Collecting hidden clues...",
    "Threading suspense through each beat...",
    "Locking in the reveal...",
    "Polishing the final mystery...",
  ],
  comedy: [
    "Tuning playful timing...",
    "Adding lively visual beats...",
    "Balancing charm and chaos...",
    "Finishing the punchline...",
  ],
  adventure: [
    "Charting a dramatic journey...",
    "Moving clouds across the horizon...",
    "Building heroic momentum...",
    "Cutting the final cinematic pass...",
  ],
  drama: [
    "Building emotional tension...",
    "Weaving character arcs together...",
    "Shaping the emotional climax...",
    "Polishing each line of dialogue...",
  ],
};

interface StoryGeneratingAnimationProps {
  mood?: MoodProfile;
  selectedGenre?: string;
}

const StoryGeneratingAnimation = ({
  mood = DEFAULT_MOOD,
  selectedGenre,
}: StoryGeneratingAnimationProps) => {
  const phases = useMemo(
    () => loadingPhases[mood.mood] ?? loadingPhases.drama,
    [mood.mood]
  );
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [phases]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => (prev >= 93 ? 20 : prev + 1.15));
    }, 160);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${mood.backgroundStyle} p-8 shadow-[0_25px_120px_rgba(15,23,42,0.8)]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-black/35" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                AI Story Forge
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Building your cinematic story
              </h3>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-100">
              {selectedGenre || mood.mood}
            </span>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
              {Array.from({ length: 12 }).map((_, index) => (
                <motion.span
                  key={`${mood.mood}-${index}`}
                  className="absolute rounded-full"
                  style={{
                    width: 10 + (index % 4) * 8,
                    height: 10 + (index % 4) * 8,
                    background: mood.particleColors[index % mood.particleColors.length],
                  }}
                  animate={{
                    x: [0, (index % 2 === 0 ? 1 : -1) * (34 + index * 4), 0],
                    y: [0, -50 - (index % 3) * 18, 0],
                    opacity: [0.15, 0.85, 0.15],
                    scale: [0.8, 1.25, 0.9],
                  }}
                  transition={{
                    duration: 3.6 + index * 0.25,
                    delay: index * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <motion.div
                className="relative z-10 text-6xl"
                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                🎬
              </motion.div>
            </div>

            <div className="flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="text-lg font-medium text-slate-100"
                >
                  {phases[phaseIndex]}
                </motion.p>
              </AnimatePresence>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                StorySparkAI is matching visuals, sound texture, narration tone, and scene energy to your story before the reveal.
              </p>

              <div className="mt-8 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${mood.accentClass}`}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
                <span>Rendering</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  `Mood: ${mood.mood}`,
                  `Sound: ${mood.soundTheme}`,
                  `Narration: ${mood.narrationTone}`,
                  "Scene transition: live",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoryGeneratingAnimation;
