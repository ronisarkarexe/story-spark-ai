import { useState } from "react";
import {
  analyzeStoryConsistency,
  trackStoryFacts,
  IConsistencyResult,
  IConsistencyIssue,
  IFactTrackingResult,
  IFactTimelineStep,
  IFactContradiction,
} from "../../services/consistency.service";

const SEVERITY_COLOR = {
  high: "bg-red-500/10 border-red-500/30 text-red-400",
  medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  low: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

const TYPE_LABEL: Record<string, string> = {
  character_contradiction: "👤 Character",
  timeline_inconsistency: "⏱️ Timeline",
  world_building_conflict: "🌍 World Building",
  relationship_mismatch: "🤝 Relationship",
  plot_hole: "🕳️ Plot Hole",
  forgotten_arc: "📖 Forgotten Arc",
  ability_inconsistency: "⚡ Ability",
};

const ScoreRing = ({ score }: { score: number }) => {
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff10" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="50" fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${(score / 100) * 314} 314`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="60" y="55" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{score}</text>
        <text x="60" y="73" textAnchor="middle" fill="#ffffff60" fontSize="11">/100</text>
      </svg>
      <span className="text-sm font-semibold" style={{ color }}>
        {score >= 80 ? "Consistent" : score >= 50 ? "Needs Work" : "Many Issues"}
      </span>
    </div>
  );
};

const IssueCard = ({ issue }: { issue: IConsistencyIssue }) => (
  <div className={`border rounded-xl p-4 space-y-2 ${SEVERITY_COLOR[issue.severity]}`}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-wider">
        {TYPE_LABEL[issue.type] ?? issue.type}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${SEVERITY_COLOR[issue.severity]}`}>
        {issue.severity}
      </span>
    </div>
    <p className="text-sm text-white/80">{issue.description}</p>
    <p className="text-xs text-white/50">📍 {issue.location}</p>
    <div className="bg-white/5 rounded-lg p-3">
      <p className="text-xs text-white/70">💡 <span className="font-semibold">Fix:</span> {issue.suggestion}</p>
    </div>
  </div>
);

export default function StoryConsistencyGuardian() {
  const [storyText, setStoryText] = useState("");
  const [activeTab, setActiveTab] = useState<"consistency" | "fact-tracker">("consistency");

  // General Consistency state
  const [result, setResult] = useState<IConsistencyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fact Tracker state
  const [factResult, setFactResult] = useState<IFactTrackingResult | null>(null);
  const [factLoading, setFactLoading] = useState(false);
  const [factError, setFactError] = useState("");

  const handleAnalyze = async () => {
    if (storyText.trim().length < 100) {
      setError("Please enter at least 100 characters of story text.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await analyzeStoryConsistency(storyText);
      setResult(data);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackFacts = async () => {
    if (storyText.trim().length < 100) {
      setFactError("Please enter at least 100 characters of story text.");
      return;
    }
    setFactError("");
    setFactLoading(true);
    try {
      const data = await trackStoryFacts(storyText);
      setFactResult(data);
    } catch {
      setFactError("Fact tracking failed. Please try again.");
    } finally {
      setFactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            🛡️ Story Consistency Guardian
          </h1>
          <p className="text-white/40 mt-2">
            Analyze your narrative structure, track timeline facts, and eliminate plot holes or logical contradictions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab("consistency")}
            className={`pb-3 font-semibold text-sm transition relative ${
              activeTab === "consistency" ? "text-indigo-400" : "text-white/40 hover:text-white/70"
            }`}
          >
            🛡️ General Consistency
            {activeTab === "consistency" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("fact-tracker")}
            className={`pb-3 font-semibold text-sm transition relative ${
              activeTab === "fact-tracker" ? "text-indigo-400" : "text-white/40 hover:text-white/70"
            }`}
          >
            ⏱️ Time-Aware Fact Tracker
            {activeTab === "fact-tracker" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <label className="text-sm font-semibold text-white/70">Your Story Text</label>
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            rows={10}
            placeholder="Paste your story here (chapters, scenes, full text)..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          
          {activeTab === "consistency" ? (
            <>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "🔍 Analyzing..." : "🛡️ Analyze Consistency"}
              </button>
            </>
          ) : (
            <>
              {factError && <p className="text-red-400 text-sm">{factError}</p>}
              <button
                onClick={handleTrackFacts}
                disabled={factLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {factLoading ? "🔍 Tracking Facts..." : "⏱️ Track Story Facts"}
              </button>
            </>
          )}
        </div>

        {/* Results: General Consistency */}
        {activeTab === "consistency" && result && (
          <div className="space-y-6">
            {/* Score + Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
              <ScoreRing score={result.consistencyScore} />
              <div className="space-y-3 flex-1">
                <h2 className="text-lg font-bold">Analysis Summary</h2>
                <p className="text-white/60 text-sm">{result.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {result.charactersFound.map((c) => (
                    <span key={c} className="text-xs px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300">
                      👤 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {result.timelineEvents.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">📅 Timeline Events Detected</h2>
                <ol className="space-y-2">
                  {result.timelineEvents.map((e, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/70">
                      <span className="text-indigo-400 font-bold">{i + 1}.</span> {e}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Issues */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                ⚠️ Issues Found ({result.issues.length})
              </h2>
              {result.issues.length === 0 ? (
                <p className="text-green-400 text-sm">✅ No consistency issues detected!</p>
              ) : (
                <div className="space-y-4">
                  {result.issues.map((issue, i) => (
                    <IssueCard key={i} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results: Time-Aware Fact Tracker */}
        {activeTab === "fact-tracker" && factResult && (
          <div className="space-y-6">
            {/* Contradictions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                ⚠️ Timeline Contradictions {factResult.contradictions ? `(${factResult.contradictions.length})` : "(0)"}
              </h2>
              {!factResult.contradictions || factResult.contradictions.length === 0 ? (
                <p className="text-green-400 text-sm">✅ No chronological or time-based contradictions detected!</p>
              ) : (
                <div className="space-y-4">
                  {factResult.contradictions.map((c: IFactContradiction, i) => (
                    <div key={i} className={`border rounded-xl p-4 space-y-3 ${SEVERITY_COLOR[c.severity] || "border-white/10 bg-white/5 text-white"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                          🚨 Temporal Conflict
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${SEVERITY_COLOR[c.severity] || "border-white/20"}`}>
                          {c.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white/80">{c.description}</p>
                      <div className="bg-white/5 rounded-lg p-3 space-y-1">
                        <p className="text-xs text-white/50">❌ <span className="font-semibold text-white/70">Violates Fact:</span> "{c.contradictedFact}"</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-white/70">💡 <span className="font-semibold text-white/90">Suggested Edit:</span> {c.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fact Timeline */}
            {factResult.timeline && factResult.timeline.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-semibold mb-4">📅 Temporal Fact Timeline</h2>
                <div className="relative pl-6 border-l border-white/10 space-y-8 ml-2">
                  {factResult.timeline.map((step: IFactTimelineStep) => (
                    <div key={step.stepNumber} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-[#0d0d14]" />
                      <div className="space-y-2">
                        <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                          Step {step.stepNumber}
                        </span>
                        <h3 className="text-md font-bold text-white/90">{step.eventSummary}</h3>
                        
                        {/* Facts Established */}
                        {step.factsEstablished && step.factsEstablished.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {step.factsEstablished.map((fact, idx) => (
                              <span key={idx} className="text-xs px-2.5 py-1 bg-green-500/10 border border-green-500/25 rounded-md text-green-400 font-medium">
                                ➕ {fact}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Facts Superseded */}
                        {step.factsSuperseded && step.factsSuperseded.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {step.factsSuperseded.map((fact, idx) => (
                              <span key={idx} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-white/40 line-through font-medium">
                                ➖ {fact}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}