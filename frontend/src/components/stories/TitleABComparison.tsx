import React, { useState } from "react";

interface TitleOption {
  title: string;
  scores: {
    creativity: number;
    relevance: number;
    memorability: number;
    emotionalAppeal: number;
  };
}

interface TitleABComparisonProps {
  storyContent: string;
  onApplyTitle: (title: string) => void;
  // Swap this to match however you already call your AI backend
  generateTitles: (storyContent: string) => Promise<TitleOption[]>;
}

const TitleABComparison: React.FC<TitleABComparisonProps> = ({
  storyContent,
  onApplyTitle,
  generateTitles,
}) => {
  const [options, setOptions] = useState<TitleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await generateTitles(storyContent);
      setOptions(results);
    } catch (err) {
      setError("Couldn't generate titles. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const averageScore = (o: TitleOption) =>
    (o.scores.creativity + o.scores.relevance + o.scores.memorability + o.scores.emotionalAppeal) / 4;

  return (
    <div className="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          ✨ Title A/B Comparison
        </h4>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !storyContent}
          className="text-[10px] px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? "Generating..." : options.length ? "Regenerate" : "Generate Titles"}
        </button>
      </div>

      {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}

      {options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => (
            <div
              key={opt.title}
              onClick={() => setSelected(opt.title)}
              className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                selected === opt.title
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <p className="text-sm text-white font-semibold mb-2">{opt.title}</p>
              <div className="space-y-1 text-[10px] text-slate-400">
                <ScoreBar label="Creativity" value={opt.scores.creativity} />
                <ScoreBar label="Relevance" value={opt.scores.relevance} />
                <ScoreBar label="Memorability" value={opt.scores.memorability} />
                <ScoreBar label="Emotional appeal" value={opt.scores.emotionalAppeal} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Avg: {averageScore(opt).toFixed(1)} / 10
              </p>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <button
          type="button"
          onClick={() => onApplyTitle(selected)}
          className="mt-3 w-full text-xs py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
        >
          Use "{selected}"
        </button>
      )}
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <span className="w-24 shrink-0">{label}</span>
    <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-1.5 bg-indigo-400 rounded-full"
        style={{ width: `${(value / 10) * 100}%` }}
      />
    </div>
    <span className="w-6 text-right">{value}</span>
  </div>
);

export default TitleABComparison;