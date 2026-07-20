import React, { useState } from "react";
import { DocumentStats } from "../../utils/story-utils";

interface Props {
  stats: DocumentStats;
  chapterAvgWords: number;
}

const DocumentStatsPanel: React.FC<Props> = ({ stats, chapterAvgWords }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-72 bg-zinc-900 border-b border-zinc-800">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-zinc-200 cursor-pointer"
        aria-expanded={expanded}
      >
        Document Stats
        <span
          className={`text-zinc-500 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          expanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <dl className="grid grid-cols-2 gap-3 px-5 pb-4 text-xs">
          <Stat label="Words" value={stats.totalWords.toLocaleString()} />
          <Stat label="Reading time" value={`${stats.readingTimeMin} min`} />
          <Stat label="Chapter avg" value={Math.round(chapterAvgWords).toLocaleString()} />
          <Stat label="Unique words" value={stats.uniqueWords.toLocaleString()} />
          <Stat label="Richness" value={stats.vocabularyRichness.toFixed(2)} />
          <Stat label="Est. pages" value={Math.round(stats.estimatedPages).toString()} />
        </dl>
      </div>
    </div>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-base font-semibold text-white">{value}</dd>
    </div>
  );
}

export default DocumentStatsPanel;