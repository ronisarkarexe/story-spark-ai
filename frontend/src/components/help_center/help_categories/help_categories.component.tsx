import { FC } from "react";
import { motion } from "framer-motion";

interface HelpCategory {
  title: string;
  description: string;
  icon: string;
}

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

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
      <div className="text-center mb-10">
        
        <h2
          id="categories-heading"
          className="text-3xl font-bold text-slate-800 dark:text-gray-300"
        >
          Quick Help Categories
        </h2>

        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Jump into the topic you need — from your first story to contributing code.
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default HelpCategories;