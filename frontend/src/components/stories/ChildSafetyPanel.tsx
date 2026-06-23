import React, { useState } from "react";
import { IStories } from "./stories.view.component";

interface ChildSafetyPanelProps {
  story: IStories;
}

export const ChildSafetyPanel: React.FC<ChildSafetyPanelProps> = ({ story }) => {
  const [activeTab, setActiveTab] = useState<"sentence" | "discourse">("sentence");

  if (!story) return null;

  const childSafety = story.childSafety;
  const warnings = story.contentWarnings || [];

  if (!childSafety) {
    return (
      <div className="mt-6 p-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl text-center text-slate-400">
        <p className="text-sm font-semibold">🛡️ PG-STORY Child Safety Audit</p>
        <p className="text-xs text-slate-500 mt-2">Safety analysis data is currently unavailable for this story.</p>
      </div>
    );
  }

  const { recommendedAgeGroup, reasoning, severity, sentenceLevel = [], discourseLevel = [] } = childSafety;

  const severityConfig = {
    Safe: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: "fa-circle-check",
      glow: "shadow-emerald-500/20",
    },
    Borderline: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      icon: "fa-triangle-exclamation",
      glow: "shadow-amber-500/20",
    },
    Unsafe: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      icon: "fa-ban",
      glow: "shadow-rose-500/20",
    },
  }[severity as "Safe" | "Borderline" | "Unsafe"] || {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    icon: "fa-shield-halved",
    glow: "shadow-slate-500/20",
  };

  return (
    <div className="mt-6 p-6 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative safety glow */}
      <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header safety row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-700/40">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${severityConfig.bg} ${severityConfig.text} border ${severityConfig.border} shadow-lg ${severityConfig.glow}`}>
            <i className={`fa-solid ${severityConfig.icon} text-lg`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              🛡️ PG-STORY Safety Audit
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              EMNLP 2024 Child-Centric Evaluation Framework
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityConfig.bg} ${severityConfig.text} border ${severityConfig.border}`}>
            {severity}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            🍼 {recommendedAgeGroup}
          </span>
        </div>
      </div>

      {/* Safety reasoning summary */}
      <div className="mt-4 p-4 bg-slate-900/40 border border-slate-700/30 rounded-xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Safety Overview</p>
        <p className="text-sm text-slate-300 leading-relaxed font-light">{reasoning}</p>
      </div>

      {/* Content Warning Badges ("Does the Dog Die?" / "StoryGraph" style) */}
      <div className="mt-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content Warnings & Triggers</p>
        {warnings.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {warnings.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5 transition-all hover:bg-amber-500/20"
              >
                <i className="fa-solid fa-triangle-exclamation text-[10px]" />
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 p-2 px-3 rounded-lg w-fit">
            <i className="fa-solid fa-circle-check" />
            No problematic trigger elements or warnings detected.
          </div>
        )}
      </div>

      {/* Taxonomy Audit Tab Controller */}
      <div className="mt-6">
        <div className="flex border-b border-slate-700/40 mb-4">
          <button
            onClick={() => setActiveTab("sentence")}
            className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "sentence"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Sentence-Level ({sentenceLevel.length})
          </button>
          <button
            onClick={() => setActiveTab("discourse")}
            className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "discourse"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Discourse-Level ({discourseLevel.length})
          </button>
        </div>

        {/* Sentence Level Safety Analysis */}
        {activeTab === "sentence" && (
          <div className="space-y-3">
            {sentenceLevel.length > 0 ? (
              sentenceLevel.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-xl space-y-2 hover:border-slate-600/60 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      📝 {item.category}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      item.severity === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                      item.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    }`}>
                      {item.severity} Severity
                    </span>
                  </div>
                  <blockquote className="text-sm italic text-slate-300 border-l-2 border-slate-600 pl-3 py-0.5 my-2">
                    "{item.sentence}"
                  </blockquote>
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Issue:</span> {item.detail}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 bg-slate-900/20 border border-dashed border-slate-700/40 rounded-xl text-center text-xs text-slate-500">
                🌱 No safety concerns flagged in individual sentences.
              </div>
            )}
          </div>
        )}

        {/* Discourse Level Safety Analysis */}
        {activeTab === "discourse" && (
          <div className="space-y-3">
            {discourseLevel.length > 0 ? (
              discourseLevel.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-xl space-y-2 hover:border-slate-600/60 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      📖 {item.aspect} Aspect ({item.category})
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      item.severity === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                      item.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    }`}>
                      {item.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-light mt-1">
                    {item.detail}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 bg-slate-900/20 border border-dashed border-slate-700/40 rounded-xl text-center text-xs text-slate-500">
                🌈 No safety issues found in overall plot, tone, or structural implications.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
