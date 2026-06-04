import { FC } from "react";
import { motion } from "framer-motion";
import { HelpCategory } from "../help_center.utils";
import HelpCategoryCard from "../help_category_card/help_category_card.component";

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  return (
    <motion.section
      id="help-categories"
      className="scroll-mt-28 transition-colors duration-300 w-full box-border"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="categories-heading"
    >
      <div className="mb-12 text-center sm:text-left px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 select-none">
          <i className="fa-solid fa-layer-group"></i>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Help Categories</span>
        </div>

        <h2 id="categories-heading" className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Explore by Category
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
          Browse support topics designed to help you quickly understand StorySparkAI features, workflows, and troubleshooting steps.
        </p>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 sm:p-12 text-center max-w-4xl mx-auto box-border">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-200/60 dark:border-white/5">
            <i className="fa-solid fa-magnifying-glass text-2xl sm:text-3xl text-slate-400 dark:text-slate-500"></i>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Categories Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Try adjusting your search keywords to locate sections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0 w-full box-border">
          {categories.map((category) => (
            <HelpCategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default HelpCategories;