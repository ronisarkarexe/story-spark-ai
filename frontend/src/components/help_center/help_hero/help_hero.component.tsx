import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  return (
    <section
      id="help-hero"
      className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
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

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-6 rounded-full border border-indigo-200 dark:border-white/20 bg-indigo-100 dark:bg-blue-500/20 text-indigo-700 dark:text-white shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-sm font-semibold tracking-wide">SUPPORT & GUIDANCE</span>
            <span className="ml-2 text-sm">
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            </span>
          </motion.div>

          <motion.h1
            id="help-center-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 dark:from-gray-200 dark:via-blue-400 dark:to-indigo-400 mb-6 tracking-tight drop-shadow-sm dark:drop-shadow-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            StorySparkAI Help Center
          </motion.h1>

          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find answers, troubleshoot issues, and get started with StorySparkAI.
            Search our guides or browse topics below.
          </motion.p>

          {/* Input Search Box Area Wrapper */}
          <motion.div
            className="relative max-w-xl mx-auto mb-12 shadow-xl rounded-2xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
               <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search guides, alternative configurations..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.05] backdrop-blur-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
            {resultCount !== undefined && searchQuery && (
              <p className="text-xs text-slate-400 mt-2 text-left px-2">
                Found {resultCount} matching articles
              </p>
            )}
          </motion.div>

          {/* Statistics Grid Rows */}
          <motion.div 
            className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 backdrop-blur-xl p-5 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">24/7</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Community Support
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 backdrop-blur-xl p-5 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">AI</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Writing Assistance
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HelpHero;
