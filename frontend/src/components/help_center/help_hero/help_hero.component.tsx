import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HelpSearchBar from "../help_search_bar/help_search_bar.component";

interface HelpHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
}

const HelpHero: FC<HelpHeroProps> = ({ searchQuery, onSearchChange, resultCount }) => {
  return (
    <section
      id="help-hero"
      className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 w-full box-border"
      aria-labelledby="help-center-title"
    >
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10" aria-hidden="true" />
      
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none select-none"
        style={{
          backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Link to="/" className="inline-block mb-10">
          <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 shadow-sm">
            <i className="fa-solid fa-arrow-left transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true"></i>
            <span className="font-medium">Back to Home</span>
          </div>
        </Link>

        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-6 rounded-full border border-indigo-200 dark:border-white/20 bg-indigo-100 dark:bg-blue-500/20 text-indigo-700 dark:text-white shadow-sm">
              <span className="text-sm font-medium">SUPPORT &amp; GUIDANCE</span>
              <span className="ml-2 text-sm">
                <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
              </span>
            </div>

            <h1
              id="help-center-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-gray-200 dark:via-blue-400 dark:to-indigo-400 mb-6 tracking-tight drop-shadow-sm dark:drop-shadow-none"
            >
              How can we help you today?
            </h1>

            <p className="text-lg text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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
      </div>
    </section>
  );
};

export default HelpHero;