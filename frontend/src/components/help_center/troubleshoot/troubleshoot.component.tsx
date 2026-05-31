import { FC } from "react";
import { motion } from "framer-motion";

interface TroubleshootItem {
  id?: string;
  title: string;
  symptoms: string;
  solution: string;
}

interface TroubleshootProps {
  items: TroubleshootItem[];
}

const TroubleshootCard: FC<{ item: TroubleshootItem }> = ({ item }) => (
  <div className="bg-white dark:bg-blue-500/10 border border-slate-200 dark:border-white/5 rounded-xl p-6 shadow-sm hover:border-orange-400/40 transition-all duration-300">
    <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-3 flex items-center gap-2">
      <i className="fa-solid fa-triangle-exclamation text-orange-400 text-sm" aria-hidden="true" />
      {item.title}
    </h3>
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1">Symptoms</p>
        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{item.symptoms}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1">Solution</p>
        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{item.solution}</p>
      </div>
    </div>
  </div>
);

const Troubleshoot: FC<TroubleshootProps> = ({ items }) => {
  return (
    <section
      id="troubleshoot-section"
      className="scroll-mt-28 transition-colors duration-300"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 mb-4">
          <i className="fa-solid fa-screwdriver-wrench"></i>
          <span className="text-sm font-semibold">TROUBLESHOOTING GUIDE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Fix Common Problems
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Diagnose and resolve common StorySparkAI issues quickly with guided
          troubleshooting steps and recommended fixes.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {items.map((item, index) => (
          <TroubleshootCard key={item.id ?? index} item={item} />
        ))}
      </motion.div>
    </section>
  );
};

export default Troubleshoot;