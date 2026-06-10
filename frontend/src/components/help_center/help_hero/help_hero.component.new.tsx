import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HelpSearchBar from "../help_search_bar/help_search_bar.component";

interface HelpHeroProps {
  searchQuery: string;
  onSearchChange?: (value: string) => void;
  resultCount?: number;
}

const HelpHero: FC<HelpHeroProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
}) => {
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <section
      id="help-hero"
      className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-[#0B1120]/40 dark:to-transparent transition-colors duration-300 w-full box-border"
      aria-labelledby="help-center-title"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 box-border w-full">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-white/10"
          >
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
            Back to Home
          </Link>

          <div className="inline-flex items-center justify-center gap-2 mx-auto mb-6 rounded-full border border-blue-200 dark:border-white/20 bg-blue-50 dark:bg-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:text-white shadow-sm transition-colors duration-300">
            <span>Support & Guidance</span>
            <i className="fa-solid fa-circle-question" aria-hidden="true" />
          </div>

          <h1
            id="help-center-title"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            How can we help you today?
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers, troubleshoot workspace issues, and get started with StorySparkAI.
          </p>

          <div className="mt-8 w-full">
            <HelpSearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              resultCount={resultCount}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HelpHero;
