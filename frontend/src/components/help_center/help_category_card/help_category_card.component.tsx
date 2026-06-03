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

      className="group text-left w-full bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 dark:hover:border-blue-500/30 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 cursor-pointer flex flex-col justify-between box-border"
    >
      <div className="w-full">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-xl sm:text-2xl text-blue-500 dark:text-blue-400 mb-5 select-none group-hover:scale-105 transition-transform duration-300 shrink-0">
          <i className={`fa-solid ${category.icon}`} aria-hidden="true"></i>
        </div>
        <h3 className="text-base sm:text-lg font-bold mb-2 text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-full">
          {category.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
          {category.description}
        </p>
      </div>
      <div className="inline-flex items-center gap-1.5 mt-5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 font-bold tracking-tight select-none">
        Browse Section

      className="group text-left w-full bg-white hover:bg-slate-50 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="text-3xl mb-4 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
        <i className={category.icon} aria-hidden="true"></i>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
        {category.title}
      </h3>

      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
        {category.description}
      </p>

      <span className="inline-flex items-center gap-1 mt-4 text-sm text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 font-medium">
        Learn more

        <i
          className="fa-solid fa-arrow-right text-[10px] sm:text-xs transition-transform group-hover:translate-x-1 shrink-0"
          aria-hidden="true"
        ></i>
      </div>
    </button>
  );
};

export default HelpCategoryCard;