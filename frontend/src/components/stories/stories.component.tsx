import React, { useState, useEffect, useRef } from "react";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, getWordCount, prompts } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
} from "../../redux/apis/ai.model.api";
import toast, { Toaster } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { getErrorMessage } from "../../error/error.message";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
type Inputs = {
  prompt: string;
};

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.85;

const StoriesComponent = () => {
  const location = useLocation();
const navigate = useNavigate();
const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
const [selectedGenre, setSelectedGenre] = useState<string>("");
const [selectedLength, setSelectedLength] = useState<string>("medium");
const [textareaValue, setTextareaValue] = useState<string>("");
const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
const dropdownRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
  parseInt(localStorage.getItem("guestRequestCount") || "0", 10),
);
const [showLimitModal, setShowLimitModal] = useState<boolean>(false);

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);

useEffect(() => {
  if (location.state && location.state.prompt) {
    setTextareaValue(location.state.prompt);
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location, navigate]);

useEffect(() => {
  setValue("prompt", textareaValue);
}, [textareaValue, setValue]);

useEffect(() => {
  return () => {
    activeGenerationRef.current?.abort();
  };
}, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading) {
      return;
    }

    if (!login && guestRequestCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    if (data.prompt === "") {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(data.prompt) < 10) {
      toast.error(
        "Please enter a prompt with at least 10 words to generate a story.",
      );
      return;
    }
    setLoading(true);

    try {
      const payload = {
        prompt: selectedGenre
          ? `[Genre: ${selectedGenre}] ${data.prompt}`
          : data.prompt,
        wordLength:
          selectedLength === "short" ? 150
          : selectedLength === "long" ? 500
          : 250,
      };
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);
      activeGenerationRef.current = generationRequest;
      const res = await generationRequest.unwrap();
      if (res) {
        toast.success(res.message);
        setStories(res.data as IStories[]);
        setSelectedPrompt("");
        setValue("prompt", "");
        reset();
        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
        }
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (message !== "Story generation was cancelled.") {
        toast.error(message);
      }
    } finally {
      activeGenerationRef.current = null;
      setLoading(false);
    }
  };

const handleCancelGeneration = () => {
  activeGenerationRef.current?.abort();
  activeGenerationRef.current = null;
  setLoading(false);
  toast("Story generation cancelled.");
};

const handleClearPrompt = () => {
  setTextareaValue("");
  setSelectedPrompt("");
  setValue("prompt", "");

  if (inputRef.current) {
    inputRef.current.focus();
  }
};

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  
  useKeyboardShortcuts({
  onOpenHelp: () => setShowHelpModal(true),
  onCloseHelp: () => setShowHelpModal(false),
  onGenerate: () => {
    if (inputRef.current) {
      const form = inputRef.current.closest("form");
      if (form) form.requestSubmit();
    }
  },
  onPublish: () => {
    const publishBtn = document.getElementById("publish-story-btn");
    publishBtn?.click();
  },
  focusPrompt: () => {
    inputRef.current?.focus();
  },
  hasStory: stories.length > 0,
});
  return (
    <div className="min-h-screen bg-[#fdf8f0] text-[#2c1810] transition-colors duration-300 dark:bg-[#1a0f08] dark:text-[#f5ead6] parchment-page">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="pt-2 w-full md:w-auto flex justify-start">
            <Link to="/">
              <div className="parchment-btn flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap text-xs">
                <i className="fa-solid fa-left-long"></i> BACK
              </div>
            </Link>
          </div>

          {!login && (
            <div className="pt-2 text-center">
              <div className="parchment-card px-4 py-2 flex items-center gap-2 rounded text-xs whitespace-normal md:whitespace-nowrap leading-relaxed font-[Cormorant_Garamond] font-semibold text-[#8b5e3c] dark:text-[#d4b896]">
                <span>
                  Free access for 3 requests —{" "}
                  <Link to="/login">
                    <span className="text-[#8b1a1a] underline font-bold dark:text-[#c9a227]">
                      Login
                    </span>
                  </Link>{" "}
                  for more!
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="parchment-btn flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap text-xs">
              <span>
                {" "}
                <span className="text-[#8b5e3c] text-xs font-[Cormorant_Garamond] dark:text-[#d4b896]/70">Per Month</span>{" "}
                {getRequestLimit(userRole?.subscriptionType as string)}
              </span>
              <Link to="/pricing" className="border-l border-[#d4b896] pl-2 text-[#8b1a1a] font-bold dark:text-[#c9a227]">
               Upgrade
              </Link>
              
              <i className="fas fa-bolt text-[#c9a227]"></i>
            </button>
            <div className="mt-3 text-[#5c3d2e] text-xs text-center md:text-right font-[Cormorant_Garamond] dark:text-[#d4b896]">
              <span>
                This month request:{" "}
                {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}
              </span>
              <br />
              <span>Total posts: {login ? (data?.postsCount ?? 0) : 0}</span>
            </div>
          </div>
        </div>

        <div className="mt-11">
          <h1 className="text-[#2c1810] dark:text-[#f5ead6] text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 font-[Playfair_Display]">
            ✨ Turn Your Ideas Into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8b1a1a] to-[#c9a227]">
              Amazing Stories!
            </span>{" "}
            ✨
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="parchment-card p-6">
<div className="relative">
  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-wrap gap-2 mb-3">
      {[
        "🎭 Drama",
        "😂 Comedy",
        "😱 Horror",
        "💕 Romance",
        "🚀 Sci-Fi",
        "🧙 Fantasy",
        "🔍 Mystery",
        "🌟 Adventure",
      ].map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={() =>
            setSelectedGenre(selectedGenre === genre ? "" : genre)
          }
          className={`px-3 py-1 rounded-full text-xs font-semibold font-[Cormorant_Garamond] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            selectedGenre === genre
              ? "bg-[#8b1a1a] text-[#fdf8f0] shadow-md border border-[#8b1a1a]"
              : "bg-[#fdf8f0] text-[#5c3d2e] border border-[#d4b896] hover:bg-[#e8d5b0] dark:bg-[#1a0f08] dark:text-[#d4b896] dark:border-[#5c3d2e] dark:hover:bg-[#2c1810]"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs text-[#8b5e3c] font-semibold uppercase tracking-wider font-[Cormorant_Garamond] mr-1 dark:text-[#d4b896]">📏 Length:</span>

      {(["short", "medium", "long"] as const).map((length) => (
        <button
          key={length}
          type="button"
          onClick={() => setSelectedLength(length)}
          className={`px-3 py-1 rounded-full text-xs font-semibold font-[Cormorant_Garamond] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            selectedLength === length
              ? "bg-[#8b1a1a] text-[#fdf8f0] shadow-md border border-[#8b1a1a]"
              : "bg-[#fdf8f0] text-[#5c3d2e] border border-[#d4b896] hover:bg-[#e8d5b0] dark:bg-[#1a0f08] dark:text-[#d4b896] dark:border-[#5c3d2e] dark:hover:bg-[#2c1810]"
          }`}
        >
          {length.charAt(0).toUpperCase() + length.slice(1)}
        </button>
      ))}
    </div>

    <div className="relative border border-[#d4b896] rounded-lg p-4 bg-[#fdf8f0] dark:bg-[#1a0f08] dark:border-[#5c3d2e]">
      <textarea
  {...register("prompt")}
  ref={(el) => {
    register("prompt").ref(el);
    inputRef.current = el;
  }}
        className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-[#2c1810] dark:text-[#f5ead6] focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-[#5c3d2e]/40 pr-10 transition-colors duration-200 font-[EB_Garamond] ${
          isOverLimit
            ? "ring-1 ring-red-500 rounded"
            : isNearLimit
            ? "ring-1 ring-[#c9a227] rounded"
            : ""
        }`}
        placeholder="Every great story begins with a single idea. What's yours?"
        value={textareaValue}
        maxLength={MAX_PROMPT_LENGTH}
        onChange={(e) => setTextareaValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.closest("form");
            if (form) form.requestSubmit();
          }
        }}
        />

      {textareaValue.length > 0 && (
        <button
          type="button"
          onClick={handleClearPrompt}
          className="absolute right-3 top-3 text-[#5c3d2e]/70 hover:text-red-600 transition-colors duration-200 dark:text-[#d4b896]/70 dark:hover:text-red-400"
          aria-label="Clear prompt"
          title="Clear prompt"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div className="flex items-center justify-between mt-2 px-1 font-[Cormorant_Garamond]">
        {isOverLimit ? (
          <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
            <span>⚠</span> Character limit reached — generate is disabled
          </p>
        ) : isNearLimit ? (
          <p className="text-xs text-[#c9a227] font-semibold flex items-center gap-1">
            <span>⚠</span>{" "}
            {MAX_PROMPT_LENGTH - textareaValue.length} characters remaining
          </p>
        ) : (
          <span />
        )}

        <span
          className={`text-xs font-semibold tabular-nums ml-auto ${
            isOverLimit
              ? "text-red-500"
              : isNearLimit
              ? "text-[#c9a227]"
              : "text-[#5c3d2e]/70 dark:text-[#d4b896]/60"
          }`}
        >
          {textareaValue.length} / {MAX_PROMPT_LENGTH}
        </span>
      </div>
    </div>

    <p className="text-xs text-[#5c3d2e] font-[Cormorant_Garamond] mt-1 px-1 dark:text-[#d4b896]">
      💡  <span className="font-bold">Keyboard tip:</span> Press{" "}
      <kbd className="px-1 py-0.5 text-xs bg-[#f5ead6] text-[#2c1810] rounded border border-[#d4b896] dark:bg-[#2c1810] dark:text-[#f5ead6] dark:border-[#5c3d2e]">
        Enter
      </kbd>{" "}
      to generate &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-[#f5ead6] text-[#2c1810] rounded border border-[#d4b896] dark:bg-[#2c1810] dark:text-[#f5ead6] dark:border-[#5c3d2e]">
        Ctrl + Enter
      </kbd>{" "}
      also works &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-[#f5ead6] text-[#2c1810] rounded border border-[#d4b896] dark:bg-[#2c1810] dark:text-[#f5ead6] dark:border-[#5c3d2e]">
        Shift + Enter
      </kbd>{" "}
      for new line
    </p>

    <div className="flex justify-end mt-2 w-full">
      <button
        type="submit"
        disabled={loading || isOverLimit}
        className={`parchment-btn-primary px-8 py-3 font-semibold font-[Cormorant_Garamond] tracking-widest uppercase flex items-center space-x-2 transition-all duration-300 hover:scale-[1.03] ${
          loading || isOverLimit
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <i className="fas fa-wand-magic-sparkles text-lg"></i>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  </form>
</div>
            </div>

            <div className="w-full max-w-2xl m-auto mt-6">
          <h1 className="text-sm font-semibold font-[Cormorant_Garamond] text-[#8b5e3c] mb-2 uppercase tracking-wide dark:text-[#d4b896]">
    Here are some example prompts you can refer to:-
  </h1>

  <div className="relative" ref={dropdownRef}>
    <button
      type="button"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="w-full p-3 bg-[#fdf8f0] border border-[#d4b896] text-[#5c3d2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/30 flex items-center justify-between text-sm text-left font-[EB_Garamond] transition-all duration-200 dark:bg-[#1a0f08] dark:border-[#5c3d2e] dark:text-[#d4b896] dark:focus:ring-[#c9a227]/30"
    >
      <span className="truncate pr-4 font-semibold italic">
        {selectedPrompt || "Select a classical motif..."}
      </span>

      <span
        className={`text-[#c9a227] transition-transform duration-200 ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>

    {isDropdownOpen && (
      <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-[#fdf8f0] border border-[#d4b896] rounded-lg shadow-xl focus:outline-none divide-y divide-[#d4b896]/30 dark:bg-[#1a0f08] dark:border-[#5c3d2e] dark:divide-[#5c3d2e]/30">
        {prompts.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                setSelectedPrompt(item.prompt);
                setTextareaValue(item.prompt);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-[#5c3d2e] hover:bg-[#8b1a1a] hover:text-[#fdf8f0] transition-colors duration-150 whitespace-normal break-words font-[EB_Garamond] leading-relaxed dark:text-[#d4b896] dark:hover:bg-[#c9a227] dark:hover:text-[#1a0f08]"
            >
              {item.prompt}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
          </div>
        </div>
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#f5ead6] border border-[#d4b896] rounded-2xl p-6 max-w-md w-full text-[#2c1810] shadow-xl dark:bg-[#2c1810] dark:border-[#5c3d2e] dark:text-[#f5ead6]">
              <h2 className="text-xl font-bold font-[Playfair_Display] mb-4 text-[#8b1a1a] dark:text-[#c9a227]">
              Keyboard Shortcuts
            </h2>

            <div className="space-y-3 text-[#5c3d2e] text-sm font-[EB_Garamond] dark:text-[#d4b896]">
              <div><kbd className="px-1.5 py-0.5 bg-[#fdf8f0] border border-[#d4b896] rounded text-xs dark:bg-[#1a0f08] dark:border-[#5c3d2e] font-mono">?</kbd> Open help</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#fdf8f0] border border-[#d4b896] rounded text-xs dark:bg-[#1a0f08] dark:border-[#5c3d2e] font-mono">Esc</kbd> Close help</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#fdf8f0] border border-[#d4b896] rounded text-xs dark:bg-[#1a0f08] dark:border-[#5c3d2e] font-mono">/</kbd> Focus prompt</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#fdf8f0] border border-[#d4b896] rounded text-xs dark:bg-[#1a0f08] dark:border-[#5c3d2e] font-mono">Ctrl + Enter</kbd> Generate story</div>
              <div><kbd className="px-1.5 py-0.5 bg-[#fdf8f0] border border-[#d4b896] rounded text-xs dark:bg-[#1a0f08] dark:border-[#5c3d2e] font-mono">Ctrl + S</kbd> Publish story</div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full parchment-btn-primary py-2 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

{loading && (
  <StoryGeneratingAnimation onCancel={handleCancelGeneration} />
)}
      <StoriesViewComponent
        stories={stories}
        isLogin={login}
        setStories={setStories}
        isLoading={loading}
      />
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-[#c9a227]/5 rounded-full blur-3xl -z-10"></div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#f5ead6] border border-[#d4b896] rounded-2xl shadow-2xl max-w-md w-full p-6 text-[#2c1810] dark:bg-[#2c1810] dark:border-[#5c3d2e] dark:text-[#f5ead6]">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8b1a1a]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#8b1a1a]/30">
                <i className="fas fa-lock text-2xl text-[#8b1a1a] dark:text-[#c9a227]"></i>
              </div>
              <h3 className="text-2xl font-bold font-[Playfair_Display] text-[#8b1a1a] mb-2 dark:text-[#c9a227]">
                Free Limit Reached
              </h3>
              <p className="text-[#5c3d2e] font-[EB_Garamond] mb-6 leading-relaxed dark:text-[#d4b896]">
                You've used all 3 free story generations. Login to continue
                creating more stories.
              </p>
              <div className="flex flex-col gap-3 font-[Cormorant_Garamond]">
                <Link
                  to="/login"
                  className="w-full parchment-btn-primary py-3 text-sm text-center"
                >
                  Login
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full parchment-btn py-3 text-sm"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;
