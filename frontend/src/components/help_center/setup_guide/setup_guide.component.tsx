import { FC } from "react";
import { motion } from "framer-motion";
import { SetupStep } from "../help_center.utils";

interface SetupGuideProps {
  steps: SetupStep[];
}

const SetupGuide: FC<SetupGuideProps> = ({ steps }) => {
  return (
    <motion.section
      id="setup-guide-section"
      className="scroll-mt-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="setup-heading"
    >
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300">
          <i className="fa-solid fa-code"></i>
          DEVELOPER GUIDE
        </div>

        <h2
          id="setup-heading"
          className="mt-5 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
        >
          Local Setup Guide
        </h2>

        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">
          Get StorySparkAI running locally in minutes. Follow these setup
          steps to install dependencies, configure environment variables,
          and start contributing to the project.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Desktop vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 hidden md:block w-px bg-gradient-to-b from-indigo-500/40 via-blue-500/20 to-transparent"
          aria-hidden="true"
        />

        <ol className="space-y-8">
          {steps.map((step, index) => (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="relative flex gap-5 group"
            >
              {/* Step Indicator */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-white shadow-md text-indigo-600 font-bold transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/20 dark:bg-slate-900 dark:border-white/10 dark:text-indigo-300">
                  {step.step}
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-indigo-500/30">
                {/* Step Badge */}
                <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-300">
                  STEP {step.step}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <li key={step.step} className="relative flex flex-col md:flex-row gap-4 md:gap-6">
              <div
                className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-blue-400 font-bold z-10"
                aria-hidden="true"
              >
                {step.step}
              </div>

              <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:border-indigo-500/30 dark:hover:border-blue-500/30 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Code Block */}
                {step.code && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner dark:border-white/10">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-400"></span>
                        <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                        <span className="h-3 w-3 rounded-full bg-green-400"></span>
                      </div>

                      <span className="text-xs text-slate-400 font-medium">
                        terminal
                      </span>
                    </div>

                    {/* Code */}
                    <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
                      <code className="font-mono text-emerald-400 whitespace-pre-wrap">
                        {step.code}
                      </code>
                    </pre>
                  </div>
                  <pre className="bg-slate-950/90 dark:bg-slate-950/80 border border-slate-800 dark:border-white/5 rounded-xl p-4 overflow-x-auto text-xs md:text-sm font-mono text-emerald-400 dark:text-emerald-350">
                    <code className="whitespace-pre">
                      {step.code}
                    </code>
                  </pre>
                )}

                {/* Accent Line */}
                <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-70 transition-all duration-300 group-hover:w-32" />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-12 overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/30"
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-sm dark:text-indigo-300">
            <i className="fa-solid fa-circle-info text-lg"></i>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Prerequisites
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Before starting, ensure you have{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Node.js 18+
              </span>
              ,{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                npm 9+
              </span>
              , and a running MongoDB instance configured locally or in the
              cloud.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                Node.js 18+
              </span>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300">
                npm 9+
              </span>

              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-300">
                MongoDB
              </span>
            </div>

            {/* Security Tip */}
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-shield-halved mt-0.5 text-amber-500"></i>

                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                  Always copy{" "}
                  <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                    .env.example
                  </code>{" "}
                  to{" "}
                  <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                    .env
                  </code>{" "}
                  and never commit real environment variables or API keys to git.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SetupGuide;