import { FC } from "react";
import { motion } from "framer-motion";
import HelpCategoryCard from '../help_category_card/help_category_card.component';

interface HelpCategory {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  color?: string;
  articleCount?: number;
  keywords?: string[];
}

interface HelpCategoriesProps {
  categories: HelpCategory[];
  onCategoryClick?: (categoryId: string | number) => void;
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories, onCategoryClick }) => {
  if (!categories.length) {
    return (
      <section id="help-categories" className="scroll-mt-28">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No categories match your search.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="help-categories" className="scroll-mt-28 transition-colors duration-300">
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
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <HelpCategoryCard 
              category={category} 
              onClick={onCategoryClick}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HelpCategories;