import { FC } from "react";
import { HelpCategory } from "../help_center.utils";
import HelpCategoryCard from "../help_category_card/help_category_card.component";

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  return (
    <section id="help-categories" className="scroll-mt-28 py-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Categories</p>
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Explore by Category</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Browse support topics designed to help you quickly understand StorySparkAI features, workflows, and troubleshooting steps.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">No categories found.</p>
        </div>
      ) : (
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <HelpCategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HelpCategories;
