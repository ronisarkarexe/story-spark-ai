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
      className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
      className="relative overflow-hidden border-b border-slate-200 dark:border-white/10"
      aria-labelledby="help-center-title"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-block mb-10">
            <div className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 shadow-lg">
              <i
                className="fa-solid fa-arrow-left transition-transform duration-300 group-hover:-translate-x-1"
                aria-hidden="true"
              ></i>
              <span className="font-medium">Back to Home</span>
            </div>
          </Link>
        </motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-block mb-8">
          <div className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded-lg border border-slate-200 shadow-sm dark:bg-gradient-to-r dark:from-white/20 dark:to-white/10 dark:hover:from-white/30 dark:hover:to-white/20 dark:text-gray-300 dark:border-white/10">
            <i className="fa-solid fa-left-long" aria-hidden="true"></i>
            BACK
          </div>
        </Link>

        {/* Main Content */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400/20 bg-blue-500/10 backdrop-blur-md text-blue-200 mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <i
              className="fa-solid fa-life-ring text-blue-300"
              aria-hidden="true"
            ></i>
            <span className="text-sm font-semibold tracking-wide uppercase">
              Support & Guidance
          <div className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-6 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-white/20 dark:bg-blue-500/20 dark:text-white">
            <span className="text-sm font-medium">SUPPORT &amp; GUIDANCE</span>
            <span className="ml-2 text-sm">
              <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="help-center-title"
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              Help Center
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            Find answers, troubleshoot issues, and explore detailed guides to
            get the most out of{" "}
            <span className="text-blue-300 font-semibold">
              StorySparkAI
            </span>
            .
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <HelpSearchBar
              value={searchQuery}
              onChange={onSearchChange}
              resultCount={searchQuery ? resultCount : undefined}
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-blue-700 to-indigo-700 mb-6 tracking-tight dark:from-gray-200 dark:via-blue-400 dark:to-indigo-400"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-1">24/7</h3>
              <p className="text-sm text-slate-400">
                Community Support
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-1">50+</h3>
              <p className="text-sm text-slate-400">
                Help Articles
              </p>
            </div>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed dark:text-gray-400">
            Find answers, troubleshoot issues, and get started with StorySparkAI.
            Search our guides or browse topics below.
          </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-1">AI</h3>
              <p className="text-sm text-slate-400">
                Writing Assistance
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HelpHero;