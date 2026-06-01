import { FC } from "react";
import { motion } from "framer-motion";
import { TroubleshootItem } from "../help_center.utils";
import TroubleshootCard from "../troubleshoot_card/troubleshoot_card.component";

interface TroubleshootProps {
  items: TroubleshootItem[];
}

const Troubleshoot: FC<TroubleshootProps> = ({ items }) => {
  return (
    <section id="troubleshoot-section" className="scroll-mt-28 transition-colors duration-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <TroubleshootCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Troubleshoot;
