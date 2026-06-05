import { FC } from "react";
import { HelpCategory, scrollToSection } from "../help_center.utils";

interface HelpCategoryCardProps {
  category: HelpCategory;
}

const HelpCategoryCard: FC<HelpCategoryCardProps> = ({ category }) => {
  return (
    <button
      type="button"
      onClick={() => scrollToSection(category.sectionId)}
      className="group w-full text-left rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/40"
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
        <i className={`fa-solid ${category.icon}`} aria-hidden="true"></i>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{category.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{category.description}</p>
    </button>
  );
};

export default HelpCategoryCard;
