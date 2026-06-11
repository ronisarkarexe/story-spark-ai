import React, { useState } from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import {
  getEducationalInsights,
  IEducationalInsights,
} from "../../services/educational-insights.service";
import ReadingLevelBadge from "./ReadingLevelBadge";
import VocabularyList from "./VocabularyList";
import QuestionsSection from "./QuestionsSection";
import ThemesSection from "./ThemesSection";
import EducationalInsightsCard from "./EducationalInsightsCard";

interface EducationalInsightsPanelProps {
  storyId: string;
}

const insightsCache: Record<string, IEducationalInsights> = {};

export const EducationalInsightsPanel: React.FC<
  EducationalInsightsPanelProps
> = ({ storyId }) => {
  const [insights, setInsights] = useState<IEducationalInsights | null>(
    insightsCache[storyId] || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEducationalInsights(storyId);
      insightsCache[storyId] = data;
      setInsights(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to generate educational insights. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 text-white space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            💡 Educational Insights
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Analyze your story to extract vocabulary, comprehension & discussion
            questions, themes, and writing prompts.
          </p>
        </div>
        {insights && (
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold border border-zinc-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Regenerate
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-550/20 text-red-400 text-sm p-4 rounded-xl flex gap-3 items-center">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            onClick={fetchInsights}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded text-xs font-semibold transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {!insights && !loading && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center max-w-2xl mx-auto my-8 space-y-5 shadow-lg">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">
              Transform Story into a Learning Resource
            </h4>
            <p className="text-zinc-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              Generate classroom-ready materials such as vocabulary, critical
              thinking discussion prompts, comprehension checks, themes, writing
              ideas, and difficulty levels.
            </p>
          </div>
          <button
            onClick={fetchInsights}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition shadow-lg hover:shadow-indigo-500/25 cursor-pointer inline-flex items-center gap-2"
          >
            Generate Educational Insights
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <div className="text-center">
            <p className="text-zinc-300 font-semibold text-sm">
              Analyzing story content...
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              This will take a moment to generate full resources.
            </p>
          </div>
        </div>
      )}

      {insights && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ReadingLevelBadge readingLevel={insights.readingLevel} />

          <div className="border-t border-zinc-900 pt-6">
            <h4 className="text-white font-bold text-base mb-4">
              Vocabulary Word Bank
            </h4>
            <VocabularyList vocabulary={insights.vocabulary} />
          </div>

          <div className="border-t border-zinc-900 pt-6">
            <QuestionsSection
              comprehensionQuestions={insights.comprehensionQuestions}
              discussionQuestions={insights.discussionQuestions}
            />
          </div>

          <div className="border-t border-zinc-900 pt-6">
            <ThemesSection
              themes={insights.themes}
              moralLessons={insights.moralLessons}
            />
          </div>

          <div className="border-t border-zinc-900 pt-6 pb-8">
            <EducationalInsightsCard prompts={insights.writingPrompts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalInsightsPanel;
