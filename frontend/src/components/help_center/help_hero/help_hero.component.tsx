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
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-block mb-10">
            <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 shadow-sm">
              <i
                className="fa-solid fa-arrow-left transition-transform duration-300 group-hover:-translate-x-1"
                aria-hidden="true"
              ></i>
              <span className="font-medium">Back to Home</span>
            </div>
          </Link>
        </motion.div>

        <div className="max-w-3xl mx-auto py-8">
          <motion.div
            className="text-center"
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

            <motion.h1
              id="help-center-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-gray-200 dark:via-blue-400 dark:to-indigo-400 mb-6 tracking-tight"
            >
              How can we help you today?
            </motion.h1>

            <p className="text-lg text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
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
      </div>
    </section>
  );
};

export default HelpHero;
