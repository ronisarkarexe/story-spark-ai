import React from "react";

interface DistinctivenessBadgeProps {
  score: number;
}

export const DistinctivenessBadge: React.FC<DistinctivenessBadgeProps> = ({
  score,
}) => {
  let colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  let label = "Unique Voice";

  if (score < 40) {
    colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    label = "Blended Voice";
  } else if (score < 70) {
    colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    label = "Common Voice";
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>
        {label} ({score}/100)
      </span>
    </div>
  );
};

export default DistinctivenessBadge;
