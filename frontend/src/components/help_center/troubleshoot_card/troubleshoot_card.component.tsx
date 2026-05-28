import { FC } from "react";
import { TroubleshootItem } from "../help_center.utils";

interface TroubleshootCardProps {
  item: TroubleshootItem;
}

const TroubleshootCard: FC<TroubleshootCardProps> = ({ item }) => {
  return (
    <article className="bg-white border border-slate-200 hover:border-red-300 p-6 rounded-xl transition-all duration-300 hover:scale-[1.01] dark:bg-blue-500/10 dark:border-white/5 dark:hover:border-red-500/20">
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600 dark:bg-red-500/10 dark:text-red-400"
          aria-hidden="true"
        >
          <i className={`${item.icon} text-xl`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 dark:text-gray-300">
            {item.title}
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-red-700 font-medium uppercase tracking-wide text-xs dark:text-red-400/80">
                Symptoms
              </span>
              <p className="text-slate-600 mt-1 dark:text-gray-500">{item.symptoms}</p>
            </div>
            <div>
              <span className="text-emerald-700 font-medium uppercase tracking-wide text-xs dark:text-emerald-400/80">
                Solution
              </span>
              <p className="text-slate-600 mt-1 leading-relaxed dark:text-gray-400">{item.solution}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TroubleshootCard;
