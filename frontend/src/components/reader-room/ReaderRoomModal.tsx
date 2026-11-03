import { useState } from "react";
import api from "../../services/api";
import logger from "../../utils/logger.util";

interface ReaderRoomModalProps {
  storyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AUDIENCES = [
  "YA Fantasy Readers",
  "Romance Fans",
  "Thriller Readers",
  "Mystery Enthusiasts",
  "Sci-Fi Readers",
  "General Fiction Readers",
];

interface ReaderRoomResult {
  targetAudience: string;
  personas: { name: string; audienceType: string; description: string }[];
  feedback: any[];
  engagementTimeline: {
    chapterIndex: number;
    chapterTitle: string;
    averageEngagementScore: number;
    isPeak: boolean;
    isLowPoint: boolean;
  }[];
  weakSections: {
    chapterIndex: number;
    chapterTitle: string;
    issue: string;
    rewriteSuggestion: string;
  }[];
  overallSummary: string;
}

const ReaderRoomModal = ({ storyId, isOpen, onClose }: ReaderRoomModalProps) => {
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReaderRoomResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  if (!isOpen) return null;

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/story/${storyId}/reader-room`, {
        targetAudience: audience,
      });
      setResult(response.data.data);
    } catch (err) {
      logger.error("Reader Room analysis failed:", err);
      setError("Couldn't generate feedback right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">📚 AI Reader Room</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer">
            &times;
          </button>
        </div>

        {!result && (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Get private feedback from simulated reader personas before you publish.
            </p>
            <label className="block text-xs text-slate-400 mb-1">Target audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-zinc-800 text-white text-sm rounded px-3 py-2 border border-zinc-700 mb-4"
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            {error && <p className="text-sm text-rose-400 mb-3" role="alert">{error}</p>}

            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 font-semibold cursor-pointer transition"
            >
              {loading ? "Gathering reader feedback…" : "Run Reader Room"}
            </button>
          </>
        )}

        {result && (
          <div className="space-y-6">
            <p className="text-sm text-slate-300">{result.overallSummary}</p>

            <div>
              <h3 className="text-white font-bold text-sm mb-2">📈 Engagement Timeline</h3>
              <div className="flex items-end gap-1 h-24 bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                {result.engagementTimeline.map((point) => (
                  <div
                    key={point.chapterIndex}
                    className="flex-1 flex flex-col items-center justify-end gap-1"
                    title={`${point.chapterTitle}: ${point.averageEngagementScore}/10`}
                  >
                    <div
                      className={`w-full rounded-t ${
                        point.isPeak
                          ? "bg-emerald-500"
                          : point.isLowPoint
                          ? "bg-rose-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ height: `${point.averageEngagementScore * 8}px` }}
                    />
                    <span className="text-[10px] text-slate-500">{point.chapterIndex + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.weakSections.length > 0 && (
              <div>
                <h3 className="text-white font-bold text-sm mb-2">🔍 Weak Sections</h3>
                <div className="space-y-2">
                  {result.weakSections.map((section) => (
                    <div key={section.chapterIndex} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === section.chapterIndex ? null : section.chapterIndex
                          )
                        }
                        className="w-full text-left flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-sm text-white font-medium">
                          {section.chapterTitle}
                        </span>
                        <span className="text-xs text-slate-500">
                          {expandedSection === section.chapterIndex ? "▲" : "▼"}
                        </span>
                      </button>
                      {expandedSection === section.chapterIndex && (
                        <div className="mt-2 text-xs text-slate-400 space-y-2">
                          <p><span className="text-rose-400 font-semibold">Issue: </span>{section.issue}</p>
                          <p><span className="text-emerald-400 font-semibold">Suggestion: </span>{section.rewriteSuggestion}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-white font-bold text-sm mb-2">
                👥 Reader Personas ({result.personas.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {result.feedback.map((f, i) => (
                  <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{f.persona.name}</span>
                      <span className="text-xs text-indigo-400">{f.overallScore}/10</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{f.persona.description}</p>
                    <p className="text-xs text-slate-400">{f.engagement.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg py-2 text-sm cursor-pointer transition"
            >
              Run again with a different audience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderRoomModal;