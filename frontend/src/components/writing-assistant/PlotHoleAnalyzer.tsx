import React, { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "../../helpers/config";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface IPlotHole {
  inconsistency: string;
  context: string;
  suggested_fix: string;
}

interface PlotHoleAnalyzerProps {
  storyText: string;
}

export default function PlotHoleAnalyzer({ storyText }: PlotHoleAnalyzerProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [plotHoles, setPlotHoles] = useState<IPlotHole[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!storyText || storyText.trim().length === 0) {
      toast.error("Please provide a story draft to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    const toastId = toast.loading("AI Editor is reviewing your story...");

    try {
      const baseUrl = getBaseUrl() || import.meta.env.VITE_BASE_URL || "";
      const response = await axios.post(`${baseUrl}/ai-editor/analyze`, {
        storyText,
      });

      if (response.data && response.data.success) {
        setPlotHoles(response.data.data.plot_holes);
        const count = response.data.data.plot_holes.length;
        if (count === 0) {
          toast.success("Brilliant! No logical consistency errors found.", { id: toastId });
        } else {
          toast.success(`Analysis complete! Identified ${count} plot holes.`, { id: toastId });
        }
      } else {
        throw new Error("Invalid response format received from backend.");
      }
    } catch (err: unknown) {
      console.error("Plot hole analysis error:", err);

      const errMsg =
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message || "Failed to analyze story."
          : err instanceof Error
            ? err.message
            : "Failed to analyze story.";

      setError(errMsg);
      toast.error(errMsg, { id: toastId });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 relative overflow-hidden mt-8">
      {/* Light highlights */}
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass-chart text-purple-400"></i>
            AI Plot-Hole & Consistency Checker
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Deep-scans your narrative for contradictions, timeline skips, and logical bugs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !storyText}
          className={`rounded-lg px-5 py-2.5 font-semibold text-sm flex items-center gap-2 border transition-all active:scale-95 cursor-pointer ${loading || !storyText
              ? "bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-50"
              : "bg-purple-700 hover:bg-purple-600 text-white border-purple-600/50 hover:shadow-lg hover:shadow-purple-500/25"
            }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Analyzing Draft...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Scan for Plot Holes
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-12"
          >
            {/* Pulsing editorial review loader */}
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping"></div>
              <div className="w-14 h-14 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center">
                <i className="fa-solid fa-book-open-reader text-2xl text-purple-400 animate-pulse"></i>
              </div>
            </div>
            <p className="text-slate-300 text-sm font-medium animate-pulse text-center">
              AI Editor is checking timelines, character continuity, and logical threads...
            </p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-950/20 border border-red-800/40 rounded-xl p-4 flex gap-3 text-red-400 text-sm mt-2 relative z-10"
          >
            <i className="fa-solid fa-circle-exclamation text-lg flex-shrink-0 mt-0.5"></i>
            <div>
              <p className="font-bold">Editorial Review Halted</p>
              <p className="opacity-90">{error}</p>
            </div>
          </motion.div>
        )}

        {plotHoles !== null && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 mt-2 relative z-10"
          >
            {plotHoles.length === 0 ? (
              <div className="border border-emerald-800/30 bg-emerald-950/10 rounded-xl p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-900/40 border border-emerald-500/30 rounded-full flex items-center justify-center mb-3">
                  <i className="fa-solid fa-circle-check text-2xl text-emerald-400 animate-bounce"></i>
                </div>
                <h4 className="text-emerald-300 font-semibold text-lg mb-1">
                  Plot-Hole Analysis Clean!
                </h4>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  Your narrative exhibits outstanding logical integrity. The timelines align perfectly and character profiles remain fully consistent throughout.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-slate-400 text-xs font-semibold mb-3 flex items-center justify-between">
                  <span>FOUND {plotHoles.length} NARRATIVE INCONSISTENCIES</span>
                  <span className="text-purple-400">Gemini Literary Review Engine</span>
                </div>
                <div className="grid gap-4">
                  {plotHoles.map((hole, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.08 } }}
                      key={index}
                      className="border border-slate-700/40 bg-slate-800/40 rounded-xl p-5 hover:border-purple-500/30 transition-all duration-300 shadow-md group"
                    >
                      <div className="flex gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200">
                          <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                        </div>
                        <div className="flex-1 space-y-4">
                          {/* Inconsistency Description */}
                          <div>
                            <h4 className="text-amber-400 font-bold text-base leading-snug">
                              {hole.inconsistency}
                            </h4>
                          </div>

                          {/* Context Highlight */}
                          <div className="bg-slate-900/60 border-l-3 border-slate-600 rounded-r-lg px-4 py-3 text-slate-300 text-sm leading-relaxed italic">
                            <span className="text-slate-500 block text-[10px] font-bold tracking-widest uppercase mb-1.5 not-italic">
                              NARRATIVE CONTEXT
                            </span>
                            "{hole.context}"
                          </div>

                          {/* Suggested Fix */}
                          <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg px-4 py-3 flex gap-3 text-purple-300 text-sm leading-relaxed">
                            <i className="fa-solid fa-lightbulb text-lg flex-shrink-0 mt-0.5 text-purple-400"></i>
                            <div>
                              <span className="text-purple-400 block text-[10px] font-bold tracking-widest uppercase mb-1">
                                SUGGESTED EDIT / SOLUTION
                              </span>
                              {hole.suggested_fix}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
