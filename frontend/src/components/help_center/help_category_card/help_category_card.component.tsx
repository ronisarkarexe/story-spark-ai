import { FC } from "react";
import { motion } from "framer-motion";

interface HelpCategory {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  color?: string;
  articleCount?: number;
}

interface HelpCategoryCardProps {
  category: HelpCategory;  // ✅ This should be singular 'category', not 'categories'
  onClick?: (categoryId: string | number) => void;
}

const HelpCategoryCard: FC<HelpCategoryCardProps> = ({ category, onClick }) => {
  const colorGradient = category.color || "from-blue-500 to-indigo-500";
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(category.id)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]/40 p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorGradient} flex items-center justify-center mb-4 shadow-lg`}>
        <i className={`fas ${category.icon} text-white text-xl`}></i>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {category.title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
        {category.description}
      </p>
      
      {/* Article Count (if available) */}
      {category.articleCount !== undefined && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {category.articleCount} articles
          </span>
          <i className="fas fa-arrow-right text-xs text-slate-400 group-hover:text-blue-500 transition-colors"></i>
        </div>
      )}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.div>
  );
};

export default HelpCategoryCard;