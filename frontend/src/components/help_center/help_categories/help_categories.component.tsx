import { FC } from "react";
import { motion } from "framer-motion";
import { HelpCategory } from "../help_center.utils";
import HelpCategoryCard from "../help_category_card/help_category_card.component";

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  if (categories.length === 0) return null;

  return (
    <motion.section
      id="categories"
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="categories-heading"
    >
      <div className="text-center mb-10">
        <h2
          id="categories-heading"
          className="text-3xl font-bold text-slate-900 dark:text-gray-300"
        >
          Quick Help Categories
        </h2>
        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Jump into the topic you need — from your first story to contributing code.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </motion.section>
  );
};

export default HelpCategories;
