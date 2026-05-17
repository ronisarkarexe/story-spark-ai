import { FC } from "react";

export interface SectionHighlightItem {
  icon: string;
  title: string;
  text: string;
}

interface SectionHighlightsProps {
  items: SectionHighlightItem[];
  className?: string;
}

const SectionHighlights: FC<SectionHighlightsProps> = ({
  items,
  className = "",
}) => {
  return (
    <div
      className={`grid gap-3 sm:grid-cols-3 ${className}`}
      aria-label="Section highlights"
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="glass-panel flex gap-3 rounded-xl p-4 transition hover:border-indigo-400/25"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300"
            aria-hidden="true"
          >
            <i className={`fas ${item.icon} text-sm`} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionHighlights;
