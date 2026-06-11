import React from "react";
import { ISimilarityAnalysis } from "../../services/dialogue-fingerprint.service";
import { Users, AlertTriangle } from "lucide-react";

interface SimilarityTableProps {
  similarities: ISimilarityAnalysis[];
}

export const SimilarityTable: React.FC<SimilarityTableProps> = ({
  similarities,
}) => {
  if (similarities.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500 text-sm">
        No character pairs to compare.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
        <Users className="w-5 h-5 text-indigo-400" />
        <h4 className="text-white font-bold text-sm">Voice Similarity Analysis</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-bold border-b border-zinc-800">
              <th className="p-4">Character A</th>
              <th className="p-4">Character B</th>
              <th className="p-4">Voice Similarity</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {similarities.map((item, idx) => {
              let scoreColor = "text-emerald-400";
              if (item.similarity >= 70) {
                scoreColor = "text-rose-400 font-bold";
              } else if (item.similarity >= 50) {
                scoreColor = "text-amber-400";
              }

              return (
                <tr
                  key={idx}
                  className={`hover:bg-zinc-850/50 transition ${
                    item.flagged ? "bg-rose-500/5" : ""
                  }`}
                >
                  <td className="p-4 text-white font-semibold">
                    {item.characterA}
                  </td>
                  <td className="p-4 text-white font-semibold">
                    {item.characterB}
                  </td>
                  <td className={`p-4 ${scoreColor}`}>
                    {item.similarity}%
                  </td>
                  <td className="p-4">
                    {item.flagged ? (
                      <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Flagged (Overly Similar)</span>
                      </div>
                    ) : (
                      <span className="text-zinc-500">Distinct Speech</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimilarityTable;
