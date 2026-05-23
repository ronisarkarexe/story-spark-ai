import { ReactNode, Suspense, lazy, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoodProfile } from "./StoryMoodDetector";

const StoryParticles = lazy(() => import("./StoryParticles"));
const StorySceneEffects = lazy(() => import("./StorySceneEffects"));
const StorySoundManager = lazy(() => import("./StorySoundManager"));
const StoryNarrator = lazy(() => import("./StoryNarrator"));

interface StoryAnimationWrapperProps {
  title: string;
  content: string;
  mood: MoodProfile;
  children: ReactNode;
}

const StoryAnimationWrapper = ({
  title,
  content,
  mood,
  children,
}: StoryAnimationWrapperProps) => {
  const [cinematicMode, setCinematicMode] = useState(false);
  const contentPreview = useMemo(() => content.slice(0, 160), [content]);

  return (
    <motion.section
      layout
      className={`relative overflow-hidden rounded-[2rem] border ${mood.cardClassName} bg-gradient-to-br ${mood.backgroundStyle} p-6 sm:p-8`}
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Suspense fallback={null}>
        <StoryParticles mood={mood} density={cinematicMode ? 28 : 18} />
        <StorySceneEffects mood={mood} cinematicMode={cinematicMode} />
      </Suspense>

      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/65">
            AI Mood Detection
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`bg-gradient-to-r ${mood.accentClass} bg-clip-text text-lg font-semibold text-transparent`}>
              {mood.mood}
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
              Confidence {(mood.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCinematicMode((prev) => !prev)}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/15"
        >
          {cinematicMode ? "Exit Cinematic Mode" : "Cinematic Mode"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mood.mood}-${cinematicMode ? "cinema" : "card"}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={cinematicMode ? "space-y-5" : "space-y-4"}
        >
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/50">
                  Scene Atmosphere
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
                  {contentPreview}
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                {mood.soundTheme}
              </span>
            </div>
          </div>

          <div className={cinematicMode ? "grid gap-4 xl:grid-cols-[1.2fr_0.8fr]" : "space-y-4"}>
            <div>{children}</div>
            <div className="space-y-4">
              <Suspense fallback={null}>
                <StorySoundManager
                  mood={mood}
                  autoStart
                  cinematicMode={cinematicMode}
                />
                <StoryNarrator
                  title={title}
                  content={content}
                  mood={mood}
                  autoPlay={cinematicMode}
                />
              </Suspense>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};

export default StoryAnimationWrapper;
