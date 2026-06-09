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



        <i
          className="fa-solid fa-arrow-right text-[10px] sm:text-xs transition-transform group-hover:translate-x-1 shrink-0"
          aria-hidden="true"
        ></i>
      </div>
    </button>
  );
};

export default HelpCategoryCard;