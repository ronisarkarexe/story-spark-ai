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
      className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-md dark:bg-slate-900/80"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-white">
          {index}
        </span>
        <p className="whitespace-pre-line text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">
          {text}
        </p>
      </div>

      {choiceMade ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            Player chose: {choiceMade}
          </span>
        </div>
      ) : null}
    </motion.article>
  );
};

export default StorySegment;