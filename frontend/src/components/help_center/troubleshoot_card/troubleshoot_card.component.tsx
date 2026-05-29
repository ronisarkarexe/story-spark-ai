import { FC } from "react";
import { TroubleshootItem } from "../help_center.utils";

interface TroubleshootCardProps {
  item: TroubleshootItem;
}

const TroubleshootCard: FC<TroubleshootCardProps> = ({ item }) => {
  return (

    <article className="bg-white dark:bg-blue-500/10 border border-gray-200 dark:border-white/5 hover:border-red-400 dark:hover:border-red-500/20 shadow-sm dark:shadow-none p-6 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400"

          aria-hidden="true"
        >
          <i className={`${item.icon} text-xl`}></i>
        </div>
        <div className="flex-1 min-w-0">

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-300 mb-2">

            {item.title}
          </h3>
          <div className="space-y-3 text-sm">
            <div>

              <span className="text-red-600 dark:text-red-400/80 font-bold uppercase tracking-wide text-xs">
                Symptoms
              </span>
              <p className="text-gray-700 dark:text-gray-500 mt-1">{item.symptoms}</p>
            </div>
            <div>
              <span className="text-emerald-600 dark:text-emerald-400/80 font-bold uppercase tracking-wide text-xs">
                Solution
              </span>
              <p className="text-gray-800 dark:text-gray-400 mt-1 leading-relaxed">{item.solution}</p>

            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TroubleshootCard;