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
      {/* Header Info Block */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300">
          <i className="fa-solid fa-code" aria-hidden="true"></i>
          DEVELOPER GUIDE
        </div>

      <div className="text-center mb-10">
        
        <h2
          id="setup-heading"
          className="text-3xl font-bold text-slate-800 dark:text-gray-300"
        >
          Developer Setup
        </h2>

        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get StorySparkAI running locally and start contributing to the monorepo.
        </p>

      </div>

      {/* Interactive Timeline Matrix */}
      <div className="relative">
        {/* Desktop vertical grid layout line */}
        
        {/* Vertical connector line (desktop) */}
        <div
          className="absolute left-6 top-0 bottom-0 hidden md:block w-px bg-gradient-to-b from-indigo-500/40 via-blue-500/20 to-transparent"
          aria-hidden="true"
        />

        <ol className="space-y-8 relative z-10">
          {steps.map((step, index) => (
            <motion.li
              key={`setup-step-${step.step}-${index}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="relative flex gap-5 group"
            >
              {/* Left Step Indicator Bubble */}
              <div className="relative z-10 flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-white shadow-md text-indigo-600 font-bold transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/20 dark:bg-slate-900 dark:border-white/10 dark:text-indigo-300">
                  {step.step}
                </div>
              </div>

              {/* Main Content Card Container */}
              <div className="flex-1 min-w-0 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-indigo-500/30">
                
                {/* Micro Step Badge */}
                <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-300">
                  STEP {step.step}
                </div>

                {/* Step Title Header */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>

                {/* Custom Styled Terminal Code Block */}
                {step.code && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner dark:border-white/10">
                    {/* Mock Terminal Top Titlebar */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2 select-none">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-400"></span>
                        <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                        <span className="h-3 w-3 rounded-full bg-green-400"></span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        terminal
                      </span>
                    </div>

                    {/* Pre-formatted Output Window - Fixed wrapping context */}
                    <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
                      <code className="font-mono text-emerald-400 whitespace-pre-wrap break-all">
                        {step.code}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Visual Ambient Bottom Accent Line */}
                <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-70 transition-all duration-300 group-hover:w-32" />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Global Security & Prerequisites Info Callout */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-12 overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-6 shadow-sm dark:border-indigo-500/20 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/30"
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Info Icon Container */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-sm dark:text-indigo-300">
            <i className="fa-solid fa-circle-info text-lg" aria-hidden="true"></i>
          </div>

          {/* Callout Information Description */}
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
              , and a running MongoDB instance configured locally or in the cloud.
            </p>

            {/* Version Framework Pill Badges */}
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

            {/* Crucial Security Warn Banner */}
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-shield-halved mt-0.5 text-amber-500" aria-hidden="true"></i>
                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                  Always copy{" "}
                  <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                    .env.example
                  </code>{" "}
                  to{" "}
                  <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                    .env
                  </code>{" "}
                  and never commit real production environment variables or secret API keys to public source control repositories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </motion.section>
  );
};

export default SetupGuide;