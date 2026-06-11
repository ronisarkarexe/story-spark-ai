import React, { useState } from "react";
import { HelpCircle as LucideHelp, MessageSquare as LucideMsg } from "lucide-react";

interface QuestionsSectionProps {
  comprehensionQuestions: string[];
  discussionQuestions: string[];
}

export const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  comprehensionQuestions,
  discussionQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<"comprehension" | "discussion">(
    "comprehension"
  );

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
      <div className="flex border-b border-zinc-800 bg-zinc-900/80">
        <button
          onClick={() => setActiveTab("comprehension")}
          className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === "comprehension"
              ? "border-indigo-500 text-white bg-indigo-500/5"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LucideHelp className="w-4 h-4 text-indigo-400" />
          Comprehension ({comprehensionQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab("discussion")}
          className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === "discussion"
              ? "border-indigo-500 text-white bg-indigo-500/5"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LucideMsg className="w-4 h-4 text-purple-400" />
          Discussion ({discussionQuestions.length})
        </button>
      </div>

      <div className="p-5">
        {activeTab === "comprehension" ? (
          comprehensionQuestions.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-4">
              No comprehension questions available.
            </p>
          ) : (
            <ul className="space-y-3.5">
              {comprehensionQuestions.map((q, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start bg-zinc-950/40 border border-zinc-800/40 rounded-lg p-3"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-zinc-250 text-sm leading-relaxed">{q}</p>
                </li>
              ))}
            </ul>
          )
        ) : discussionQuestions.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-4">
            No discussion questions available.
          </p>
        ) : (
          <ul className="space-y-3.5">
            {discussionQuestions.map((q, idx) => (
              <li
                key={idx}
                className="flex gap-3 items-start bg-zinc-950/40 border border-zinc-800/40 rounded-lg p-3"
              >
                <span className="w-6 h-6 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-zinc-250 text-sm leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuestionsSection;
