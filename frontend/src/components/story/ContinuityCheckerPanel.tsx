import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  analyzeStoryConsistency,
  IConsistencyResult,
  IConsistencyIssue,
} from "../../services/consistency.service";

interface ContinuityCheckerPanelProps {
  storyText: string;
  storyId: string;
}

const ContinuityCheckerPanel: React.FC<ContinuityCheckerPanelProps> = ({ storyText, storyId }) => {
  const [result, setResult] = useState<IConsistencyResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!storyText.trim()) {
      toast.error("Story is empty. Write something first!");
      return;
    }

    try {
      setAnalyzing(true);
      toast.loading("Analyzing continuity...", { id: "continuity" });
      const data = await analyzeStoryConsistency(storyText, storyId);
      setResult(data);
      toast.success("Continuity analysis complete!", { id: "continuity" });
    } catch (error) {
      console.error("Analysis failed", error);
      toast.error("Failed to analyze continuity.", { id: "continuity" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-96">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-white font-bold">Continuity Checker</h3>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded disabled:opacity-50"
        >
          {analyzing ? "Analyzing..." : "Check Continuity"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!result && !analyzing && (
          <div className="text-sm text-slate-500 text-center mt-10">
            Click Check Continuity to scan for plot holes, timeline errors, and character contradictions.
          </div>
        )}

        {analyzing && (
          <div className="text-sm text-slate-400 text-center mt-10 animate-pulse">
            AI is reading your story...
          </div>
        )}

        {result && (
          <div>
            <div className="flex justify-between items-center mb-6 bg-zinc-800 p-4 rounded-xl border border-zinc-700">
              <span className="text-sm text-slate-300">Consistency Score</span>
              <span className={`text-2xl font-bold ${result.consistencyScore > 80 ? 'text-green-400' : result.consistencyScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {result.consistencyScore}/100
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-6 italic">{result.summary}</p>

            {result.issues && result.issues.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm">Issues Found ({result.issues.length})</h4>
                {result.issues.map((issue: IConsistencyIssue, i: number) => (
                  <div key={i} className="bg-zinc-800 p-3 rounded-lg border border-red-900/50 relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    
                    <div className="pl-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{issue.type.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-white mb-2">{issue.description}</p>
                      <div className="text-xs text-slate-400 mb-2"><strong>Location:</strong> {issue.location}</div>
                      <div className="bg-green-900/20 border border-green-800/30 p-2 rounded text-xs text-green-400">
                        <strong>Fix:</strong> {issue.suggestion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-green-900/20 border border-green-800/50 rounded-xl">
                <p className="text-green-400 font-bold mb-1">Looking Good!</p>
                <p className="text-xs text-slate-300">No major continuity issues found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinuityCheckerPanel;
