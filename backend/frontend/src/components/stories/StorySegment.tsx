import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export type StorySegmentProps = {
  text: string;
  choiceMade?: string;
  index: number;
};

const StorySegment = ({ text, choiceMade, index }: StorySegmentProps) => {
  const segmentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    segmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [index]);

  return (
    <motion.article
      ref={segmentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full text-left bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 backdrop-blur-xl box-border"
    >
      <div className="flex items-start gap-4 w-full box-border">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white select-none shadow-sm shadow-blue-500/10">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium m-0">
            {text}
          </p>
        </div>
      </div>

      {choiceMade ? (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-2 w-full box-border select-none">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/10 dark:border-white/10 bg-blue-500/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <i className="fa-solid fa-circle-dot text-[9px]" />
            <span>Player chose: {choiceMade}</span>
          </span>
        </div>
      ) : null}
    </motion.article>
  );
};

export default StorySegment;