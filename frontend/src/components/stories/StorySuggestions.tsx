import React, { useState, useEffect } from "react";
import {
  useGenerateSuggestionMutation,
  useAcceptSuggestionMutation,
  useRejectSuggestionMutation,
  useGetSuggestionsHistoryQuery,
  useDeleteSuggestionFromHistoryMutation,
} from "../../redux/apis/suggestion.api";
import toast from "react-hot-toast";

interface StorySuggestionsProps {
  story: any;
  isLogin: boolean;
  setStories: (stories: any[]) => void;
  stories: any[];
  setSelectedStory: (story: any) => void;
}

const CATEGORIES = [
  { value: "plot", label: "📖 Plot Continuation" },
  { value: "character", label: "👤 Character Development" },
  { value: "dialogue", label: "💬 Dialogue Improvement" },
  { value: "scene", label: "🌲 Scene Description" },
  { value: "structure", label: "📐 Story Structure" },
  { value: "tone", label: "🎨 Tone & Style" },
  { value: "conflict", label: "🌪️ Conflict Generation" },
];

export default function StorySuggestions({
  story,
  isLogin,
  setStories,
  stories,
  setSelectedStory,
}: StorySuggestionsProps) {
  const [suggestionType, setSuggestionType] = useState<string>("plot");
  const [originalText, setOriginalText] = useState<string>("");
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  // RTK Query hooks
  const [generateSuggestion, { isLoading: isGenerating }] = useGenerateSuggestionMutation();
  const [acceptSuggestion] = useAcceptSuggestionMutation();
  const [rejectSuggestion] = useRejectSuggestionMutation();
  const [deleteSuggestion] = useDeleteSuggestionFromHistoryMutation();

  const { data: historyData, refetch: refetchHistory } = useGetSuggestionsHistoryQuery(
    { page, limit },
    { skip: !isLogin }
  );

  const [currentSuggestion, setCurrentSuggestion] = useState<any>(null);

  // Triggered on page load or tab changes to update history
  useEffect(() => {
    if (isLogin) {
      refetchHistory();
    }
  }, [isLogin, page, refetchHistory]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      toast.error("Please log in to generate story suggestions.");
      return;
    }
    if (!story?.content) {
      toast.error("No story context available. Generate or select a story first.");
      return;
    }

    try {
      const payload = {
        storyId: story.uuid && story.uuid.startsWith("test-") ? undefined : story.uuid,
        suggestionType,
        originalText: originalText.trim() || undefined,
        storyContext: story.content,
        additionalInstructions: additionalInstructions.trim() || undefined,
      };

      const result = await generateSuggestion(payload).unwrap();
      if (result?.data) {
        setCurrentSuggestion(result.data);
        toast.success("AI Suggestions generated successfully!");
        refetchHistory();
      } else {
        toast.error("Empty response received from AI.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Failed to generate suggestions.");
    }
  };

  const handleAccept = async (id: string, itemData: any) => {
    try {
      await acceptSuggestion(id).unwrap();
      toast.success("Suggestion accepted!");

      // Integrate suggestion content back into story
      let textToAppend = "";
      const sType = itemData.suggestionType;
      const data = itemData.generatedSuggestion;

      if (sType === "plot" && data?.suggestions?.[0]) {
        textToAppend = `\n\n[Plot continuation path: ${data.suggestions[0].title}]\n${data.suggestions[0].description}\nOutcome: ${data.suggestions[0].outcome}`;
      } else if (sType === "dialogue" && data?.rewrites?.[0]) {
        textToAppend = `\n\n[Dialogue improvement]:\n"${data.rewrites[0].improved}"`;
      } else if (sType === "tone") {
        const toneVal = data.emotional || data.suspenseful || data.dramatic || Object.values(data)[0];
        if (toneVal) {
          textToAppend = `\n\n[Style polish]:\n"${toneVal}"`;
        }
      } else if (sType === "scene" && data?.environmentEnhancements) {
        textToAppend = `\n\n[Scene description enhancement]:\n${data.environmentEnhancements}`;
      } else if (sType === "conflict") {
        textToAppend = `\n\n[New Conflict Threat]:\n${data.externalConflicts || data.internalConflicts}`;
      }

      if (textToAppend) {
        const updatedStory = { ...story, content: story.content + textToAppend };
        setSelectedStory(updatedStory);
        setStories(stories.map((s: any) => (s.uuid === story.uuid ? updatedStory : s)));
        toast.success("Applied to draft!");
      }

      if (currentSuggestion?._id === id) {
        setCurrentSuggestion((prev: any) => ({ ...prev, accepted: true, rejected: false }));
      }
      refetchHistory();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept suggestion.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectSuggestion(id).unwrap();
      toast.success("Suggestion rejected.");
      if (currentSuggestion?._id === id) {
        setCurrentSuggestion((prev: any) => ({ ...prev, rejected: true, accepted: false }));
      }
      refetchHistory();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject suggestion.");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSuggestion(id).unwrap();
      toast.success("Suggestion deleted from history.");
      if (currentSuggestion?._id === id) {
        setCurrentSuggestion(null);
      }
      refetchHistory();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete history item.");
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied rewrite variant!");
  };

  const renderSuggestionContent = (type: string, data: any) => {
    if (!data) return <p className="text-slate-400 text-xs">No response data.</p>;
    switch (type) {
      case "plot":
        return (
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Continuation Paths</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.suggestions?.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                    <p className="font-bold text-slate-200 text-sm mb-1">{item.title}</p>
                    <p className="text-slate-300 text-xs leading-relaxed mb-2">{item.description}</p>
                    <p className="text-emerald-400 text-xs italic">
                      <span className="text-slate-500 not-italic font-semibold">Outcome:</span> {item.outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {data.unexpectedTwist && (
              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">⚡ Unexpected Twist</h5>
                <p className="font-semibold text-slate-200 text-sm mb-1">{data.unexpectedTwist.title}</p>
                <p className="text-slate-300 text-xs leading-relaxed">{data.unexpectedTwist.description}</p>
              </div>
            )}
          </div>
        );
      case "character":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">💡 Growth Ideas</h5>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {data.growthIdeas?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">⚠️ Flaws</h5>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {data.flaws?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">🎯 Motivations</h5>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {data.motivations?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
            {data.backstoryEnhancements && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">📖 Backstory Enhancements</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.backstoryEnhancements}</p>
              </div>
            )}
            {data.relationshipImprovements && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">👥 Relationship Dynamics</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.relationshipImprovements}</p>
              </div>
            )}
          </div>
        );
      case "dialogue":
        return (
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Dialogue Rewrites</h5>
              <div className="space-y-3">
                {data.rewrites?.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30 space-y-2">
                    <div className="text-xs text-slate-500 italic">
                      <span className="font-semibold text-slate-400 not-italic">Original:</span> "{item.original}"
                    </div>
                    <div className="text-sm text-emerald-400 font-medium">
                      <span className="text-xs text-slate-400 font-semibold">Improved:</span> "{item.improved}"
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="text-slate-500 font-semibold">Reason:</span> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {data.pacingTips && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">⏱️ Dialogue Pacing Tips</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.pacingTips}</p>
              </div>
            )}
          </div>
        );
      case "scene":
        return (
          <div className="space-y-4">
            {data.environmentEnhancements && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">🌲 Environment Details</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.environmentEnhancements}</p>
              </div>
            )}
            {data.sensoryDetails && (
              <div>
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">👁️ Sensory Imagery</h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(data.sensoryDetails).map(([key, value]: any) => (
                    <div key={key} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{key}</span>
                      <span className="text-xs text-slate-300 italic">{value || "N/A"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.moodAndAtmosphere && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">✨ Mood & Atmosphere</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.moodAndAtmosphere}</p>
              </div>
            )}
          </div>
        );
      case "structure":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
              <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">🪝 Hook (Beginning)</h5>
              <p className="text-slate-300 text-xs leading-relaxed">{data.beginningImprovements}</p>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
              <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">📈 Midpoint Escalation</h5>
              <p className="text-slate-300 text-xs leading-relaxed">{data.midpointImprovements}</p>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">💥 Climax Payoff</h5>
              <p className="text-slate-300 text-xs leading-relaxed">{data.climaxRecommendations}</p>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">🏁 Resolution (Ending)</h5>
              <p className="text-slate-300 text-xs leading-relaxed">{data.endingRecommendations}</p>
            </div>
          </div>
        );
      case "tone":
        return (
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Stylistic Rewrites</h5>
            <div className="space-y-3">
              {Object.entries(data).map(([toneName, textVariant]: any) => (
                <div key={toneName} className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{toneName} variant</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(textVariant)}
                      className="text-xs text-slate-400 hover:text-slate-200 border border-slate-700 rounded px-2.5 py-1 bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">"{textVariant}"</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "conflict":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">🧘 Internal Struggles</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.internalConflicts}</p>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">🌪️ External Hurdles</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.externalConflicts}</p>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">👥 Relationship Friction</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.relationshipConflicts}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">🔍 Hooks & Mysteries</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.mysteryCreation}</p>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/30">
                <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">📈 Tension Pressure</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{data.tensionEscalation}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <pre className="text-slate-300 text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mt-8 relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-200">✨ AI Writing Suggestions</h3>
          <p className="text-xs text-slate-400 mt-1">Get custom creative hints, tone adjustments, character growth, or conflict events.</p>
        </div>

        <div className="flex border border-slate-700/50 rounded-lg p-0.5 bg-slate-950/20">
          <button
            type="button"
            onClick={() => setActiveTab("generate")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === "generate" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Generate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === "history" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            History {isLogin && historyData?.meta?.total ? `(${historyData.meta.total})` : ""}
          </button>
        </div>
      </div>

      {!isLogin ? (
        <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-dashed border-slate-700/40">
          <p className="text-slate-300 text-sm mb-4">Please log in to use AI Writing Suggestions.</p>
          <a
            href="/login"
            className="inline-block rounded-xl px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs hover:from-purple-600 hover:to-indigo-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            Go to Login
          </a>
        </div>
      ) : activeTab === "generate" ? (
        <div className="space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Suggestion Category
                </label>
                <select
                  value={suggestionType}
                  onChange={(e) => setSuggestionType(e.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-slate-900">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Selected / Original Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste highlighted text to rewrite or analyze..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                placeholder="e.g. 'Make the dialogue snarkier', 'Introduce a ghost threat', 'Enhance the descriptive prose'..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  "Generate Suggestions"
                )}
              </button>
            </div>
          </form>

          {currentSuggestion && (
            <div className="mt-8 border-t border-slate-700/40 pt-6 animate-fade-in-up">
              <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-700/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-full">
                      {suggestionType} suggestion
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentSuggestion.accepted ? (
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-semibold">
                        <i className="fa-solid fa-check mr-1.5"></i> Accepted
                      </span>
                    ) : currentSuggestion.rejected ? (
                      <span className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-full font-semibold">
                        <i className="fa-solid fa-xmark mr-1.5"></i> Rejected
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAccept(currentSuggestion._id, currentSuggestion)}
                          className="rounded-lg px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(currentSuggestion._id)}
                          className="rounded-lg px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 leading-relaxed text-slate-300">
                  {renderSuggestionContent(suggestionType, currentSuggestion.generatedSuggestion)}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {!historyData?.data || historyData.data.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/20 border border-dashed border-slate-700/40 rounded-xl">
              <p className="text-slate-400 text-xs">No suggestion history found. Create one above! ✨</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {historyData.data.map((item: any) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setSuggestionType(item.suggestionType);
                    setCurrentSuggestion(item);
                    setActiveTab("generate");
                  }}
                  className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/20 hover:border-slate-600 transition-all cursor-pointer flex justify-between items-center group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">
                        {item.suggestionType}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs truncate max-w-[280px] sm:max-w-[480px]">
                      {item.storyContext}
                    </p>
                    <div className="flex items-center gap-2">
                      {item.accepted ? (
                        <span className="text-[9px] text-emerald-400 font-semibold">Accepted</span>
                      ) : item.rejected ? (
                        <span className="text-[9px] text-rose-400 font-semibold">Rejected</span>
                      ) : (
                        <span className="text-[9px] text-slate-500 font-semibold">Pending</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item._id, e)}
                    className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                    title="Delete suggestion"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Simple pagination */}
          {historyData?.meta && historyData.meta.total > limit && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/30">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-slate-400">
                Page {page} of {Math.ceil(historyData.meta.total / limit)}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => (p * limit < historyData.meta.total ? p + 1 : p))}
                disabled={page * limit >= historyData.meta.total}
                className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
