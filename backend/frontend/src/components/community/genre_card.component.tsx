import React from 'react';
import { Link } from 'react-router-dom';

interface IGenreCardProps {
  title: string;
  description: string;
  icon: string;
  count: string;
  color: string;
  isLogin?: boolean;
}

const GenreCard: React.FC<IGenreCardProps> = ({ title, description, icon, count, color, isLogin }) => {
  return (
    <div className="group relative p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-blue-500/50 hover:bg-gray-100 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-lg hover:shadow-blue-500/10 text-slate-900 dark:bg-slate-900/50 dark:border-white/10 dark:hover:bg-slate-900/80 dark:text-white">
      {/* Background Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${color} blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} bg-opacity-20 text-slate-900 mb-6 group-hover:scale-110 transition-transform dark:text-white`}>
          <i className={`fa-solid ${icon} text-xl`}></i>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 dark:text-gray-400">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-gray-500">
            {count} Writers
          </span>
          <Link 
            to={isLogin ? "/dashboard" : "/signup"}
            className="text-blue-400 text-sm font-semibold flex items-center group-hover:gap-2 transition-all cursor-pointer"
          >
            {isLogin ? "Enter Hub" : "Join Hub"} <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenreCard;
