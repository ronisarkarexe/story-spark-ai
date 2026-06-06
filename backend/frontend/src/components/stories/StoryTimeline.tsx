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
        className="fixed bottom-4 right-4 z-30 rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-100 shadow-xl shadow-slate-950/30 backdrop-blur md:hidden select-none cursor-pointer active:scale-[0.98] transition-transform duration-150"
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
            className="fixed inset-x-0 bottom-0 z-20 mx-auto max-h-[45vh] w-full border-t border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/30 backdrop-blur md:sticky md:top-6 md:h-fit md:max-h-[calc(100vh-3rem)] md:w-[320px] md:rounded-3xl md:border md:bg-slate-950/80 box-border"
          >
            <div className="mb-5 flex items-center justify-between select-none">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
                  Timeline
                </p>
                <h3 className="mt-1 text-base font-extrabold tracking-tight text-slate-100">
                  Past choices
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Collapse
              </button>
            </div>

            <div className="max-h-[32vh] space-y-4 overflow-y-auto pr-1 md:max-h-[calc(100vh-10rem)] w-full box-border">
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <div
                    key={`${index}-${entry.choice}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left w-full box-border group"
                  >
                    <div className="mb-3 flex items-center gap-2.5 select-none">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-[10px] font-bold text-cyan-400 border border-cyan-400/10 shadow-sm">
                        {index + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                        Step
                      </span>
                    </div>
                    <h4 className="text-sm font-bold leading-snug text-slate-100 tracking-tight">
                      {truncate(entry.choice, 42) || "Waiting for a choice"}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 font-medium">
                      {truncate(entry.segment, 96)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-xs font-medium leading-relaxed text-slate-500 max-w-sm mx-auto select-none">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3.5 border border-white/5">
                    <i className="fa-solid fa-hourglass text-slate-600 text-sm"></i>
                  </div>
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