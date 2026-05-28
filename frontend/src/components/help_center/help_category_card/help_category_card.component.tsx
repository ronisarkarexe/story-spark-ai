import { FC } from "react";
import { HelpCategory, scrollToSection } from "../help_center.utils";

interface HelpCategoryCardProps {
  category: HelpCategory;
}

const HelpCategoryCard: FC<HelpCategoryCardProps> = ({ category }) => {
  const handleClick = () => {
    scrollToSection(category.sectionId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group text-left w-full bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 p-6 rounded-xl shadow-sm transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:border-white/5 dark:hover:border-indigo-500/30"
    >
      <div className="text-3xl mb-4 text-indigo-600 group-hover:text-indigo-700 transition-colors dark:text-indigo-400 dark:group-hover:text-indigo-300">
        <i className={category.icon} aria-hidden="true"></i>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-slate-900 group-hover:text-indigo-950 transition-colors dark:text-gray-300 dark:group-hover:text-white">
        {category.title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed dark:text-gray-500">{category.description}</p>
      <span className="inline-flex items-center gap-1 mt-4 text-sm text-indigo-700 group-hover:text-indigo-800 font-medium dark:text-indigo-400 dark:group-hover:text-indigo-300">
        Learn more
        <i
          className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        ></i>
      </span>
    </button>
  );
};

export default HelpCategoryCard;
