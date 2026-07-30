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
const lengths = ["short", "medium", "long"] as const;

const StoriesComponent = () => {
  const location = useLocation();
const navigate = useNavigate();
const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
      const res = login
        ? await generateModel(payload).unwrap()
        : await generateFreeModel(payload).unwrap();
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
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen relative overflow-x-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="pt-2 w-full md:w-auto flex justify-start">
            <Link to="/">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
                <i className="fa-solid fa-left-long"></i> BACK
              </div>
            </Link>
          </div>

          {!login && (
            <div className="pt-2 text-center">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 text-gray-400 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm whitespace-normal md:whitespace-nowrap leading-relaxed">
                <span>
                  Free access for 3 requests — <Link to="/login"><span className="text-indigo-400 underline font-semibold">Login</span></Link> for more!
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
              <span>
                <span className="text-gray-400 text-xs mr-1">Per Month</span>
                {getRequestLimit(subscriptionType)}
              </span>
              <Link to="/pricing" className="border-1 border-white/20 pl-2 text-gray-300">
               Upgrade
              </Link>
              
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-3 text-gray-500 text-xs text-center md:text-right">
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
          <h1 className="text-gray-300 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            ✨ Turn Your Ideas Into{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Amazing Stories!
            </span>{" "}
            ✨
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-blue-500/10 rounded-md p-4 border border-gray-400">
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
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedGenre === genre
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs text-gray-400 mr-1">📏 Length:</span>

      {lengths.map((length) => (
        <button
          key={length}
          type="button"
          onClick={() => setSelectedLength(length)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedLength === length
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
          }`}
        >
          {length.charAt(0).toUpperCase() + length.slice(1)}
        </button>
      ))}
    </div>

    <div className="relative">
      <textarea
  {...register("prompt")}
  ref={(el) => {
    register("prompt").ref(el);
    inputRef.current = el;
  }}
        className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-300 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 pr-10 transition-colors duration-200 ${
          isOverLimit
            ? "ring-1 ring-red-500 rounded"
            : isNearLimit
            ? "ring-1 ring-yellow-400 rounded"
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
          className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
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

      <div className="flex items-center justify-between mt-1 px-1">
        {isOverLimit ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> Character limit reached — generate is disabled
          </p>
        ) : isNearLimit ? (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <span>⚠</span>{" "}
            {MAX_PROMPT_LENGTH - textareaValue.length} characters remaining
          </p>
        ) : (
          <span />
        )}

        <span
          className={`text-xs tabular-nums ml-auto ${
            isOverLimit
              ? "text-red-400 font-medium"
              : isNearLimit
              ? "text-yellow-400"
              : "text-gray-500"
          }`}
        >
          {textareaValue.length} / {MAX_PROMPT_LENGTH}
        </span>
      </div>
    </div>

    <p className="text-xs text-gray-500 mt-1 px-1">
      💡  <span className="font-medium">Keyboard tip:</span> Press{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Enter
      </kbd>{" "}
      to generate &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Ctrl + Enter
      </kbd>{" "}
      also works &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Shift + Enter
      </kbd>{" "}
      for new line
    </p>

    <div className="flex justify-end mt-2 w-full">
      <button
        type="submit"
        disabled={loading || isOverLimit}
        className={`w-full sm:w-auto justify-center rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
          loading || isOverLimit
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:shadow-indigo-500/50"
        } transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group cursor-pointer`}
      >
        <i className="fas fa-wand-magic-sparkles text-xl transition-transform duration-300 group-hover:animate-wiggle"></i>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  </form>
</div>
            </div>

            <div className="w-full max-w-2xl m-auto mt-4">
  <h1 className="text-sm text-gray-500 mb-1">
    Here are some example prompts you can refer to:-
  </h1>

  <div className="relative" ref={dropdownRef}>
    <button
      type="button"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="w-full p-3 bg-slate-800 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between text-sm text-left transition-all duration-200"
    >
      <span className="truncate pr-4">
        {selectedPrompt || "Select a prompt"}
      </span>

      <span
        className={`text-gray-300 transition-transform duration-200 ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>

    {isDropdownOpen && (
      <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl focus:outline-none divide-y divide-slate-700/30">
        {prompts.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                setSelectedPrompt(item.prompt);
                setTextareaValue(item.prompt);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-indigo-600 hover:text-white transition-colors duration-150 whitespace-normal break-words leading-relaxed"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Keyboard Shortcuts
            </h2>

            <div className="space-y-3 text-gray-300 text-sm">
              <div><kbd>?</kbd> Open help</div>
              <div><kbd>Esc</kbd> Close help</div>
              <div><kbd>/</kbd> Focus prompt</div>
              <div><kbd>Ctrl + Enter</kbd> Generate story</div>
              <div><kbd>Ctrl + S</kbd> Publish story</div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {loading && <StoryGeneratingAnimation />}
      <StoriesViewComponent
        stories={stories}
        isLogin={login}
        setStories={setStories}
      />
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)] max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-2xl text-blue-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                Free Limit Reached
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                You've used all 3 free story generations. Login to continue
                creating more stories.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  Login
                </Link>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all"
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
