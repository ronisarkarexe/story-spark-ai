import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";

import { useDebounce } from "../../hooks/useDebounce";
import { useGenerateFreeModelMutation, useGenerateModelMutation, useGenerateAlternateEndingsMutation, useGenerateFreeAlternateEndingsMutation } from "../../redux/apis/ai.model.api";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";

import StoriesViewComponent, { IStories } from "./stories.view.component";
import { getWordCount, prompts } from "./stories.utils";
import { getRequestLimit } from "./stories.utils";

import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import RecentPromptsPanel from "./RecentPromptsPanel";
import { useRecentPrompts } from "../../hooks/useRecentPrompts";

// Keep this component focused: prompt -> generate -> render StoriesViewComponent.
// The previous file was heavily corrupted; this is a clean compiling replacement.

type Inputs = { prompt: string };

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.8;

const StoriesComponent: React.FC = () => {
  const login = isLoggedIn();
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";

  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !login });

  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  const [textareaValue, setTextareaValue] = useState<string>("");
  const debouncedPrompt = useDebounce(textareaValue, 400);

  // Keep in sync with react-hook-form
  useEffect(() => {
    setValue("prompt", debouncedPrompt);
  }, [debouncedPrompt, setValue]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const { recentPrompts, addPrompt, removePrompt, clearAll, recordPromptUse } = useRecentPrompts();
  const [isRecentPromptsOpen, setIsRecentPromptsOpen] = useState(false);

  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  // Guest limit tracking (existing logic in repo uses localStorage)
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() => {
    const n = parseInt(localStorage.getItem("guestRequestCount") || "0", 10);
    return Number.isFinite(n) ? n : 0;
  });

  const requestLimit = getRequestLimit(subscriptionType);

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();

  const [stories, setStories] = useState<IStories[]>([]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const prompt = (data.prompt || "").trim();

    if (!login && guestRequestCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    if (!prompt) {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(prompt) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }

    setLoading(true);
    try {
      const payload = { prompt, language: "English" };
      const res = login ? await generateModel(payload).unwrap() : await generateFreeModel(payload).unwrap();
      if (res) {
        // res.data shape is project-dependent; StoriesViewComponent expects IStories[]
        const next = (res.data || []) as IStories[];
        setStories(next);
        setSelectedPrompt("");
        addPrompt(prompt);

        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
        }

        reset();
        setTextareaValue("");
      }

      toast.success(res?.message || "Story generated!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;

  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  const handleClear = useCallback(() => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    try {
      localStorage.removeItem("story_spark_draft");
    } catch {
      // ignore
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [setValue]);

  // Keyboard shortcuts: Ctrl/Cmd + Enter to submit, ? to open help
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && (e.target as HTMLElement)?.tagName !== "TEXTAREA") {
        setShowHelp(true);
      }
      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const shouldTrigger = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === "Enter" && shouldTrigger && !e.shiftKey) {
        if (isGenerateDisabled) return;
        e.preventDefault();
        const form = inputRef.current?.closest("form");
        form?.requestSubmit();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isGenerateDisabled]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <StoryGeneratingAnimation />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <i className="fa-solid fa-left-long" /> BACK
          </Link>

          {!login && (
            <div className="text-center text-xs text-slate-400">
              Free access for 3 requests —{" "}
              <Link to="/login" className="text-indigo-300 underline font-semibold">Login</Link> for more!
            </div>
          )}

          <div className="text-right text-xs text-slate-400">
            <div className="font-semibold text-slate-200">
              {login ? dataLabel(profile?.subscriptionType) : `${guestRequestCount} / 3`}
            </div>
          </div>
        </div>

        <h1 className="text-center text-3xl sm:text-4xl font-extrabold mb-8">
          ✨ Turn Your Ideas Into{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
            Amazing Stories!
          </span>
        </h1>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Prompt</label>
              <textarea
                {...register("prompt")}
                ref={(el) => {
                  register("prompt").ref(el);
                  inputRef.current = el;
                }}
                disabled={loading}
                aria-busy={loading}
                className={`w-full h-28 sm:h-32 resize-none bg-transparent border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  isOverLimit ? "ring-1 ring-red-500" : isNearLimit ? "ring-1 ring-amber-400" : ""
                }`}
                placeholder="Every great story begins with a single idea. What's yours?"
                value={textareaValue}
                maxLength={MAX_PROMPT_LENGTH}
                onChange={(e) => setTextareaValue(e.target.value)}
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div>
                  {isOverLimit ? (
                    <span className="text-red-400 font-semibold">⚠ Character limit reached - generate is disabled</span>
                  ) : isNearLimit ? (
                    <span className="text-amber-400 font-semibold">⚠ {MAX_PROMPT_LENGTH - textareaValue.length} characters remaining</span>
                  ) : (
                    <span />
                  )}
                </div>
                <div className={`font-bold ${isOverLimit ? "text-red-400" : isNearLimit ? "text-amber-400" : "text-slate-400"}`}>
                  {textareaValue.length} / {MAX_PROMPT_LENGTH}
                </div>
              </div>

              {textareaValue.trim().length > 0 && (
                <button type="button" onClick={handleClear} className="text-xs text-red-300 hover:text-red-200">
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-slate-400">
                  💡 <span className="font-bold text-slate-300">Keyboard tip:</span> Press{' '}
                  <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 border border-slate-700 rounded">Enter</kbd>{' '}
                  to continue • Ctrl/Cmd + Enter to generate
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecentPromptsOpen((v) => !v)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider"
                  aria-label="Recent prompts"
                  title="Recent prompts"
                >
                  Recent Prompts
                </button>

                <button
                  type="button"
                  onClick={() => setShowHelp(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider"
                >
                  Help
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerateDisabled}
                className={`rounded-xl px-6 py-3 font-semibold text-white transition-all duration-200 shadow-sm shadow-indigo-500/10 ${
                  isGenerateDisabled ? "bg-indigo-500/40 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500"
                }`}
              >
                Generate
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Examples</div>
            <div className="flex flex-wrap gap-2">
              {prompts.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPrompt(p.prompt);
                    setTextareaValue(p.prompt);
                    setValue("prompt", p.prompt);
                    requestAnimationFrame(() => inputRef.current?.focus());
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                >
                  {p.prompt.length > 28 ? p.prompt.slice(0, 28) + "…" : p.prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {stories.length > 0 && (
          <div className="mt-8">
            <StoriesViewComponent
              stories={stories}
              isLogin={login}
              setStories={setStories}
            />
          </div>
        )}
      </div>

      <RecentPromptsPanel
        recentPrompts={recentPrompts}
        onSelectPrompt={(prompt) => {
          setTextareaValue(prompt);
          setValue("prompt", prompt);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        onRemovePrompt={removePrompt}
        onClearAll={clearAll}
        isOpen={isRecentPromptsOpen}
        onToggle={() => setIsRecentPromptsOpen((v) => !v)}
        text={{
          recentPrompts: "Recent Prompts",
          usePrompt: "Use",
          delete: "Delete",
          clearAll: "Clear All",
          noRecentPrompts: "No recent prompts yet",
          close: "Close",
        }}
        onPromptUse={(id) => recordPromptUse(id)}
      />

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-lg font-extrabold mb-4">Keyboard Shortcuts</h2>
            <div className="text-sm text-slate-300 space-y-2">
              <div><kbd>?</kbd> Open help</div>
              <div><kbd>Esc</kbd> Close help</div>
              <div><kbd>/</kbd> Focus prompt (textarea)</div>
              <div><kbd>Ctrl + Enter</kbd> Generate story</div>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-2xl text-indigo-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Free Limit Reached</h3>
              <p className="text-slate-300 mb-6">You've used all 3 free story generations. Login to continue creating more stories.</p>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-center">
                  Login
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLimitModal(false)}
                  className="w-full bg-transparent hover:bg-white/5 text-slate-300 font-semibold py-3 rounded-xl border border-white/10"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function dataLabel(subscriptionType?: string) {
  if (!subscriptionType) return "Free";
  if (subscriptionType === "free") return "Free";
  return subscriptionType;
}

export default StoriesComponent;

