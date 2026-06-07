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
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none select-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <Link to="/" className="inline-block">
            <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
              <i className="fa-solid fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true"></i>
              <span className="text-xs sm:text-sm font-semibold tracking-tight">Back to Home</span>
            </div>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="text-center max-w-4xl mx-auto w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-6 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">Support & Guidance</span>
            <span className="ml-2 text-xs flex items-center justify-center">
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            </span>
          </div>

          <h1
            id="help-center-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-gray-200 dark:via-blue-400 dark:to-indigo-300 mb-6"
          >
            How can we help you today?
          </h1>

          <p className="text-lg text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Find answers, troubleshoot issues, and get started with StorySparkAI.
            Search our guides or browse topics below.
          </p>

          <HelpSearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            resultCount={searchQuery ? resultCount : undefined}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HelpHero;
