import { FC } from "react";
import { motion } from "framer-motion";

interface HelpCategory {
  id?: string;
  title: string;
  description: string;
  icon: string;
}

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategoryCard: FC<{ category: HelpCategory }> = ({ category }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="group p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-blue-500/10 hover:border-blue-400/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-default"
  >
    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      <i className={`${category.icon} text-xl`} aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {category.title}
    </h3>
    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
      {category.description}
    </p>
  </motion.div>
);

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  return (
    <section
      id="help-categories"
      className="scroll-mt-28 transition-colors duration-300"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 mb-4">
          <i className="fa-solid fa-layer-group"></i>
          <span className="text-sm font-semibold">HELP CATEGORIES</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Explore by Category
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Browse support topics designed to help you quickly understand
          StorySparkAI features, workflows, and troubleshooting steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <HelpCategoryCard key={category.id ?? index} category={category} />
        ))}
      </div>
    </section>
  );
};

export default HelpCategories;