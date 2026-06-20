/* eslint-disable */
import { useState } from "react";
import { useAnalyzeEngagementMutation } from "../../redux/apis/engagement.api";

const ScoreBar = ({ label, score }: { label: string; score: number }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium">{label}</span>
      <span className="font-bold">{score}/100</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{
          width: `${score}%`,
          backgroundColor:
            score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444",
        }}
      />
    </div>
  </div>
);

export default function EngagementAnalyzer() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [analyzeEngagement, { data, isLoading, isError }] =
    useAnalyzeEngagementMutation();

  const result = data?.data;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">📊 Reader Engagement Analyzer</h2>
      <p className="text-gray-500 text-sm">
        Paste your chapter to get instant AI feedback before publishing.
      </p>

      <input
        className="w-full border rounded-lg p-3 text-sm bg-transparent"
        placeholder="Chapter title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded-lg p-3 text-sm bg-transparent h-48 resize-none"
        placeholder="Paste chapter text here (min 100 characters)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {isError && (
        <p className="text-red-500 text-sm">Analysis failed. Please try again.</p>
      )}

      <button
        onClick={() => analyzeEngagement({
          chapterText: text.trim(),
          title: title.trim(),
        })}
        disabled={
          isLoading ||
          text.trim().length < 100 ||
          text.trim().length > 50000
        }
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
      >
        {isLoading ? "Analyzing…" : "Analyze Engagement"}
      </button>

      {result && (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Overall Engagement", val: result.engagementScore },
              { label: "Chapter Strength", val: result.chapterStrengthScore },
            ].map(({ label, val }) => (
              <div key={label} className="border rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500">{label}</p>
                <p
                  className={`text-4xl font-bold mt-1 ${val >= 70
                      ? "text-green-500"
                      : val >= 40
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Dimension Breakdown</h3>
            <ScoreBar label={`Pacing — ${result.pacing.label}`} score={result.pacing.score} />
            <ScoreBar label="Dialogue Quality" score={result.dialogueQuality.score} />
            <ScoreBar label="Emotional Intensity" score={result.emotionalIntensity.score} />
            <ScoreBar label="Suspense Level" score={result.suspenseLevel.score} />
            <ScoreBar label="Readability" score={result.readability.score} />
          </div>

          {result.dropOffSections?.length > 0 && (
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold mb-3">⚠️ Potential Drop-off Sections</h3>
              {result.dropOffSections.map((s: any, i: number) => (
                <div key={i} className="border-l-4 border-red-400 pl-3 mb-3">
                  <p className="text-sm italic text-gray-500">"{s.excerpt}"</p>
                  <p className="text-sm text-red-500 mt-1">🔴 {s.reason}</p>
                  <p className="text-sm text-green-600 mt-1">💡 {s.suggestion}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3">✅ Improvement Suggestions</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {result.improvementSuggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
