import { FC } from "react";
import { TroubleshootItem } from "../help_center.utils";

interface TroubleshootCardProps {
  item: TroubleshootItem;
}

const TroubleshootCard: FC<TroubleshootCardProps> = ({ item }) => (
  <article className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 shadow-sm p-6 rounded-3xl transition-all duration-300 hover:shadow-md w-full box-border">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex-shrink-0 w-14 h-14 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-300 border border-red-500/10 dark:border-red-500/20">
        <i className={`${item.icon} text-xl`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Symptoms
            </span>
            <p className="mt-2 leading-relaxed">{item.symptoms}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Solution
            </span>
            <p className="mt-2 leading-relaxed">{item.solution}</p>
          </div>
        </div>
      </div>
    </div>
  </article>
);

export default TroubleshootCard;
