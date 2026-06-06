import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HelpSearchBar from "../help_search_bar/help_search_bar.component";

interface HelpHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
}

const HelpHero: FC<HelpHeroProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
}) => {
  return (
    <section
      id="help-hero"
      className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-[#0B1120]/40 dark:to-transparent transition-colors duration-300 w-full box-border"
      aria-labelledby="help-center-title"
    >
      {/* Glow Ambient Highlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Effect */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none select-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16 box-border w-full">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <Link to="/" className="inline-block mb-8 sm:mb-12">
            <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm cursor-pointer select-none">
              <i className="fa-solid fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true"></i>
              <span className="text-xs sm:text-sm font-semibold tracking-tight">Back to Home</span>
            </div>
          </Link>
        </motion.div>

        {/* Hero Central Content */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-5 sm:mb-6 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 select-none shadow-sm dark:shadow-none transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Support & Guidance</span>
            <span className="ml-2 text-xs flex items-center justify-center">
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            </span>
          </motion.div>

          <motion.h1
            id="help-center-title"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-800 dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400 mb-4 sm:mb-5 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How can we help you today?
          </motion.h1>

          <motion.p 
            className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find answers, troubleshoot workspace issues, and check guides across the StorySparkAI pipeline ecosystem.
          </motion.p>

          <motion.div 
            className="w-full box-border"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <HelpSearchBar
              value={searchQuery}
              onChange={onSearchChange}
              resultCount={searchQuery ? resultCount : undefined}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HelpHero;