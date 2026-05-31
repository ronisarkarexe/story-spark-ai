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

      {/* Timeline */}
      <div className="relative">
        
        {/* Vertical connector line (desktop) */}
        <div
          className="absolute left-6 top-0 bottom-0 hidden md:block w-px bg-gradient-to-b from-indigo-500/40 via-blue-500/20 to-transparent"
          aria-hidden="true"
        />

        <ol className="space-y-8 relative z-10">
          {steps.map((step, index) => (
            <li
              key={step.step}
              className="relative flex gap-6"
            >
              
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold z-10"
                aria-hidden="true"
              >
                {step.step}
              </div>

              <div className="flex-1 bg-white dark:bg-blue-500/10 border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500/20 transition-colors">
                
                <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-2">
                  {step.title}
                </h3>

                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                {step.code && (
                  <pre className="bg-gray-900/90 border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-emerald-400/90 font-mono whitespace-pre">
                      {step.code}
                    </code>
                  </pre>
                )}

              </div>

              {index < steps.length - 1 && (
                <span className="sr-only">
                  Next step
                </span>
              )}

            </li>
          ))}
        </ol>
      </div>

      <motion.div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-500/20 rounded-xl shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
            <i
              className="fas fa-info-circle"
              aria-hidden="true"
            ></i>
          </div>

          <div>
            
            <h3 className="text-slate-800 dark:text-gray-300 font-semibold mb-1">
              Prerequisites
            </h3>

            <p className="text-slate-600 dark:text-gray-400 text-sm">
              Node.js 18.18+, npm 9+, and a MongoDB URI. Copy{" "}
              
              <code className="text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-900/50 px-1.5 py-0.5 rounded">
                .env.example
              </code>{" "}
              
              files — never commit real{" "}
              
              <code className="text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-900/50 px-1.5 py-0.5 rounded">
                .env
              </code>{" "}
              
              files to git.
            </p>

          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SetupGuide;