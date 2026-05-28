import { FC } from "react";
import { motion } from "framer-motion";

interface TroubleshootItem {
  title: string;
  symptoms: string;
  solution: string;
}

interface TroubleshootProps {
  items: TroubleshootItem[];
}

const Troubleshoot: FC<TroubleshootProps> = ({ items }) => {
  return (
    <section
      id="troubleshoot-section"
      className="scroll-mt-28 transition-colors duration-300"
    >
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 mb-4">
          <i className="fa-solid fa-screwdriver-wrench"></i>
          <span className="text-sm font-semibold">
            TROUBLESHOOTING GUIDE
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Fix Common Problems
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Diagnose and resolve common StorySparkAI issues quickly with guided
          troubleshooting steps and recommended fixes.
      <div className="text-center mb-10">
        <h2
          id="troubleshooting-heading"

          className="text-3xl font-extrabold text-gray-900 dark:text-gray-300"
        >
          Troubleshooting
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">

          Diagnose and fix common setup and runtime issues.
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-toolbox text-3xl text-slate-500"></i>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Issues Found
          </h3>

          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
              }}
              whileHover={{
                y: -4,
              }}
              className="
                group relative overflow-hidden
                rounded-3xl
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-white/[0.04]
                backdrop-blur-2xl
                shadow-md hover:shadow-2xl
                transition-all duration-300
              "
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top border */}
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 p-7">
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                  {/* Icon */}
                  <div
                    className="
                      flex items-center justify-center
                      w-14 h-14 rounded-2xl
                      bg-gradient-to-br from-orange-500/20 to-amber-500/20
                      border border-orange-500/20
                      text-orange-400 text-xl
                      shrink-0
                      group-hover:scale-110
                      transition-transform duration-300
                    "
                  >
                    <i className="fa-solid fa-bug"></i>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Common issue detected in StorySparkAI workflow
                    </p>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Symptoms
                    </h4>
                  </div>

                  <div className="rounded-2xl border border-red-200 dark:border-red-500/10 bg-red-50 dark:bg-red-500/[0.04] p-5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.symptoms}
                    </p>
                  </div>
                </div>

                {/* Solution */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                      <i className="fa-solid fa-check"></i>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Recommended Solution
                    </h4>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/10 bg-emerald-50 dark:bg-emerald-500/[0.04] p-5">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Troubleshoot;