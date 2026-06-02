import { FC } from "react";
import { motion } from "framer-motion";
import { SetupStep } from "../help_center.utils";

interface SetupGuideProps {
  steps: SetupStep[];
}

const SetupGuide: FC<SetupGuideProps> = ({ steps }) => {
  return (
    <motion.section
      id="developer-setup"
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="setup-heading"
    >
      <div className="text-center mb-10">
        <h2 id="setup-heading" className="text-3xl font-bold text-gray-800 dark:text-gray-300">
          Developer Setup
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get StorySparkAI running locally and start contributing to the monorepo.
        </p>
      </div>

      <div className="relative">
        {/* Vertical connector line (desktop) */}
        <div
          className="hidden md:block absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/50 via-blue-500/30 to-transparent"
          aria-hidden="true"
        />

        <ol className="space-y-6">
          {steps.map((step, index) => (
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
                {step.code && (
                  <pre className="bg-slate-950/90 dark:bg-slate-950/80 border border-slate-800 dark:border-white/5 rounded-xl p-4 overflow-x-auto text-xs md:text-sm font-mono text-emerald-400 dark:text-emerald-350">
                    <code className="whitespace-pre">
                      {step.code}
                    </code>
                  </pre>
                )}
              </div>

              {index < steps.length - 1 && (
                <span className="sr-only">Next step</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-500/20 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <i className="fas fa-info-circle" aria-hidden="true"></i>
          </div>
          <div>
            <h3 className="text-gray-800 dark:text-gray-300 font-semibold mb-1">
              Prerequisites
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Node.js 18.18+, npm 9+, and a MongoDB URI. Copy{" "}
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-900/50 px-1.5 py-0.5 rounded">
                .env.example
              </code>{" "}
              files ΓÇö never commit real{" "}
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-900/50 px-1.5 py-0.5 rounded">
                .env
              </code>{" "}
              files to git.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SetupGuide;
