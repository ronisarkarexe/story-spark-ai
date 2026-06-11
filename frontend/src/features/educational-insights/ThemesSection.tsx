import React from "react";
import { Award, Compass } from "lucide-react";
import { IThemeItem } from "../../services/educational-insights.service";

interface ThemesSectionProps {
  themes: IThemeItem[];
  moralLessons: string[];
}

export const ThemesSection: React.FC<ThemesSectionProps> = ({
  themes,
  moralLessons,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-white font-bold text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Major Themes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.length === 0 ? (
            <p className="text-zinc-500 text-sm">No themes detected.</p>
          ) : (
            themes.map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 transition hover:border-zinc-700"
              >
                <h5 className="text-white font-semibold text-sm mb-1.5 capitalize">
                  {item.theme}
                </h5>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-bold text-base flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          Moral Lessons
        </h4>
        <div className="space-y-3">
          {moralLessons.length === 0 ? (
            <p className="text-zinc-500 text-sm">No moral lessons detected.</p>
          ) : (
            moralLessons.map((lesson, idx) => (
              <div
                key={idx}
                className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-3 items-start"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-zinc-200 text-sm font-medium leading-snug">
                  {lesson}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemesSection;
