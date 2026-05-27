import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type StoryTimelineEntry = {
  segment: string;
  choice: string;
};

export type StoryTimelineProps = {
  history: StoryTimelineEntry[];
};

const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
};

const StoryTimeline = ({ history }: StoryTimelineProps) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-30 rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-sm font-medium text-slate-100 shadow-xl shadow-slate-950/30 backdrop-blur md:hidden"
      >
        {open ? "Hide timeline" : "Show timeline"}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-20 mx-auto max-h-[45vh] w-full border-t border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur md:sticky md:top-6 md:h-fit md:max-h-[calc(100vh-3rem)] md:w-[320px] md:rounded-3xl md:border md:bg-slate-950/80"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                  Timeline
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-100">
                  Past choices
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10"
              >
                Collapse
              </button>
            </div>

            <div className="max-h-[32vh] space-y-3 overflow-y-auto pr-1 md:max-h-[calc(100vh-10rem)]">
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <div
                    key={`${index}-${entry.choice}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-semibold text-cyan-300">
                        {index + 1}
                      </span>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Step
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-100">
                      {truncate(entry.choice, 42) || "Waiting for a choice"}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {truncate(entry.segment, 96)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  Your choices will appear here as the story unfolds.
                </div>
              )}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default StoryTimeline;