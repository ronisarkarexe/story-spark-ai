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
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300 mb-4">
          <i className="fa-solid fa-code"></i>
          DEVELOPER GUIDE
        </div>
        <h2
          id="setup-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4"
        >
          Local Setup Guide
        </h2>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
          Get StorySparkAI running locally in minutes. Follow these setup
          steps to install dependencies, configure environment variables,
          and start contributing to the project.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div
          className="absolute left-6 top-0 bottom-0 hidden md:block w-px bg-gradient-to-b from-indigo-500/40 via-blue-500/20 to-transparent"
          aria-hidden="true"
        />

        <ol className="space-y-8 relative z-10">
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
              className="relative flex flex-col md:flex-row gap-5 group"
            >
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-white shadow-md text-indigo-600 font-bold transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/20 dark:bg-slate-900 dark:border-white/10 dark:text-indigo-300">
                  {step.step}
                </div>
              </div>

              <div className="flex-1 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-indigo-500/30">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-5">
                  {step.description}
                </p>

                {step.code && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner dark:border-white/10">
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
                    <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
                      <code className="font-mono text-emerald-400 whitespace-pre-wrap">
                        {step.code}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-12 overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/30 max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-sm dark:text-indigo-300 flex-shrink-0">
            <i className="fa-solid fa-circle-info text-lg"></i>
          </div>
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
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SetupGuide;