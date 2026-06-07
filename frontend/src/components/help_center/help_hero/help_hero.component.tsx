import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HelpSearchBar from "../help_search_bar/help_search_bar.component";

interface HelpHeroProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  resultCount?: number;
}

const HelpHero: FC<HelpHeroProps> = ({
  searchQuery = "",
  onSearchChange,
  resultCount = 0,
}) => {
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <section
      id="help-hero"
      className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900"
      aria-labelledby="help-center-title"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <Link to="/" className="inline-block mb-10">
            <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200 shadow-sm cursor-pointer select-none">
              <i className="fa-solid fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true"></i>
              <span className="text-xs sm:text-sm font-semibold tracking-tight">Back to Home</span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-6 rounded-full border border-indigo-200 dark:border-white/20 bg-indigo-100 dark:bg-blue-500/20 text-indigo-700 dark:text-white shadow-sm">
            <span className="text-sm font-medium">SUPPORT &amp; GUIDANCE</span>
            <span className="ml-2 text-sm">
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            </span>
          </div>

          <h1
            id="help-center-title"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-800 dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400 mb-4 sm:mb-5 tracking-tight"
          >
            How can we help you today?
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers, troubleshoot workspace issues, and browse guidance across the StorySparkAI platform.
          </p>

          <div className="w-full box-border">
            <HelpSearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              resultCount={searchQuery ? resultCount : undefined}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HelpHero;