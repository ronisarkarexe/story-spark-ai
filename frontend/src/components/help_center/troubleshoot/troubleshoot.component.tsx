import { FC } from "react";
import { motion } from "framer-motion";
import { TroubleshootItem } from "../help_center.utils";
import TroubleshootCard from "../troubleshoot_card/troubleshoot_card.component";

interface TroubleshootProps {
  items: TroubleshootItem[];
}

const Troubleshoot: FC<TroubleshootProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <motion.section
      id="troubleshooting"
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="troubleshooting-heading"
    >
      <div className="text-center mb-10">
        <h2
          id="troubleshooting-heading"
          className="text-3xl font-bold text-slate-900 dark:text-gray-300"
        >
          Troubleshooting
        </h2>
        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Diagnose and fix common setup and runtime issues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item) => (
          <TroubleshootCard key={item.id} item={item} />
        ))}
      </div>
    </motion.section>
  );
};

export default Troubleshoot;
