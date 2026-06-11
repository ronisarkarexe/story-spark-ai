import React from "react";
import { IRecommendation } from "../../services/dialogue-fingerprint.service";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface RecommendationsPanelProps {
  recommendations: IRecommendation[];
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-6 text-center text-zinc-400 space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-bold text-white text-sm">Dialogue Voices Balanced</h4>
        <p className="text-xs text-zinc-500">
          The system found no major voice overlaps. The character dialogues are well differentiated!
        </p>
      </div>
    );
  }

  // Group by character
  const grouped: Record<string, string[]> = {};
  recommendations.forEach((item) => {
    if (!grouped[item.character]) {
      grouped[item.character] = [];
    }
    grouped[item.character].push(item.suggestion);
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-md">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0" />
        <h4 className="text-white font-bold text-sm">Actionable Recommendations</h4>
      </div>

      <div className="space-y-4 divide-y divide-zinc-800/50">
        {Object.entries(grouped).map(([character, suggestions], groupIdx) => (
          <div key={character} className={`space-y-2 ${groupIdx > 0 ? "pt-4" : ""}`}>
            <h5 className="text-indigo-300 font-bold text-xs">
              {character}
            </h5>
            <ul className="space-y-2">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPanel;
