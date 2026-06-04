import { FC } from "react";
import { TroubleshootItem } from "../help_center.utils";

interface TroubleshootCardProps {
  item: TroubleshootItem;
}

const TroubleshootCard: FC<TroubleshootCardProps> = ({ item }) => {
  return (

    <article className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 hover:border-red-500/40 dark:hover:border-red-500/30 shadow-sm p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md w-full box-border">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-500/10 dark:border-red-500/20"

    <article className="bg-white dark:bg-blue-500/10 border border-slate-200 dark:border-white/5 hover:border-red-500/30 p-6 rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.01]">
      
      <div className="flex items-start gap-4">
        
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400"

          aria-hidden="true"
        >
          <i className={`${item.icon} text-lg`}></i>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            {item.title}
          </h3>
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                Symptoms
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium leading-relaxed">{item.symptoms}</p>


        <div className="flex-1 min-w-0">
          
          <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-2">
            {item.title}
          </h3>

          <div className="space-y-3 text-sm">
            
            <div>
              <span className="text-red-600 dark:text-red-400/80 font-medium uppercase tracking-wide text-xs">
                Symptoms
              </span>

              <p className="text-slate-600 dark:text-gray-500 mt-1">
                {item.symptoms}
              </p>

            </div>

            <div>

              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                Solution
              </span>
              <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{item.solution}</p>

              <span className="text-emerald-600 dark:text-emerald-400/80 font-medium uppercase tracking-wide text-xs">
                Solution
              </span>

              <p className="text-slate-700 dark:text-gray-400 mt-1 leading-relaxed">
                {item.solution}
              </p>

            </div>

          </div>
        </div>

      </div>
    </article>
  );
};

export default TroubleshootCard;