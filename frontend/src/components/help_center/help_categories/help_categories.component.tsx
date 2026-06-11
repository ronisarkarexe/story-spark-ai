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
  >
    <div className="mb-12 text-center px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 select-none">
        <i className="fa-solid fa-layer-group"></i>
        <span className="text-sm font-semibold">HELP CATEGORIES</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
        Explore by Category
      </h2>

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
        Browse support topics designed to help you quickly understand
        StorySparkAI features, workflows, and troubleshooting steps.
      </p>
    </div>

    {categories.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-12 text-center max-w-4xl mx-auto box-border">
        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6">
          <i
            className="fa-solid fa-magnifying-glass text-3xl text-slate-500 dark:text-slate-400"
            aria-hidden="true"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
          No Categories Found
        </h3>

        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Try adjusting your search keywords to locate sections.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 px-4 sm:px-0 w-full box-border">
        {categories.map((category) => (
          <HelpCategoryCard key={category.id} category={category} />
        ))}
      </div>
    )}
  </motion.section>
);
}
export default HelpCategories;