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
      className="relative overflow-hidden border-b border-slate-200 dark:border-white/10"
      aria-labelledby="help-center-title"
    >
      {/* Animated background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-block mb-8">
          <div className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded-lg border border-slate-200 shadow-sm dark:bg-gradient-to-r dark:from-white/20 dark:to-white/10 dark:hover:from-white/30 dark:hover:to-white/20 dark:text-gray-300 dark:border-white/10">
            <i className="fa-solid fa-left-long" aria-hidden="true"></i>
            BACK
          </div>
        </Link>

        <motion.div
          className="text-center pb-16 pt-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-6 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-white/20 dark:bg-blue-500/20 dark:text-white">
            <span className="text-sm font-medium">SUPPORT &amp; GUIDANCE</span>
            <span className="ml-2 text-sm">
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            </span>
          </div>

          <h1
            id="help-center-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-blue-700 to-indigo-700 mb-6 tracking-tight dark:from-gray-200 dark:via-blue-400 dark:to-indigo-400"
          >
            Help Center
          </h1>

          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed dark:text-gray-400">
            Find answers, troubleshoot issues, and get started with StorySparkAI.
            Search our guides or browse topics below.
          </p>

          <HelpSearchBar
            value={searchQuery}
            onChange={onSearchChange}
            resultCount={searchQuery ? resultCount : undefined}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HelpHero;
