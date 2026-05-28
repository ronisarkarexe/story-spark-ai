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
      className="group text-left w-full bg-white dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-500/20 border border-gray-200 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/30 p-6 rounded-xl shadow-md dark:shadow-none transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="text-3xl mb-4 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">
        <i className={category.icon} aria-hidden="true"></i>
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-300 group-hover:text-indigo-900 dark:group-hover:text-white transition-colors">
        {category.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed transition-colors">
        {category.description}
      </p>
      <span className="inline-flex items-center gap-1 mt-4 text-sm text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 font-bold transition-colors">

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