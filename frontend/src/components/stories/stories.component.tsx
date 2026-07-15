import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import { Link } from "react-router-dom";
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
// import { useDebounce } from "../../hooks/useDebounce";
// import ConfirmDialog from "./ConfirmDialog";
// import {
//   clearStoryDraft,
//   loadStoryDraft,
//   saveStoryDraft,
//   type StoryDraftData,
// } from "../../utils/story-draft";
// import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
// import { useRecentPrompts } from "../../hooks/useRecentPrompts";

// Types and constants
type Inputs = {
  prompt: string;
};

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.85;
const DANGER_THRESHOLD = 0.95;
const lengths = ["short", "medium", "long"] as const;

const soundtrackMap: Record<string, string> = {
  "🧙 Fantasy": "/audio/fantasy.mp3",
  "😱 Horror": "/audio/horror.mp3",
  "💕 Romance": "/audio/romance.mp3",
  "🎭 Drama": "/audio/drama.mp3",
  "😂 Comedy": "/audio/comedy.mp3",
  "🚀 Sci-Fi": "/audio/sci-fi.mp3",
  "🔍 Mystery": "/audio/mystery.mp3",
  "🌟 Adventure": "/audio/adventure.mp3",
  "🗺️ Adventurous": "/audio/adventure.mp3",
  "🤖 Tech / Sci-Fi": "/audio/sci-fi.mp3",
  "💖 Romance / Love": "/audio/romance.mp3",
};


const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
];

const GENRES = [
  { value: "🎭 Drama", icon: "🎭", name: "Drama" },
  { value: "😂 Comedy", icon: "😂", name: "Comedy" },
  { value: "😱 Horror", icon: "😱", name: "Horror" },
  { value: "💕 Romance", icon: "💕", name: "Romance" },
  { value: "🚀 Sci-Fi", icon: "🚀", name: "Sci-Fi" },
  { value: "🧙 Fantasy", icon: "🧙", name: "Fantasy" },
  { value: "🔍 Mystery", icon: "🔍", name: "Mystery" },
  { value: "🌟 Adventure", icon: "🌟", name: "Adventure" },
  { value: "🗺️ Adventurous", icon: "🗺️", name: "Adventurous" },
  { value: "🤖 Tech / Sci-Fi", icon: "🤖", name: "Tech / Sci-Fi" },
  { value: "💖 Romance / Love", icon: "💖", name: "Romance / Love" },
] as const;

// type GenreName = (typeof GENRES)[number]["name"];

const TONES = [
  {
    label: "Dark",
    emoji: "🌑",
    activeClass: "bg-gray-700 text-gray-100 border-gray-500 shadow-gray-700/40",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Whimsical",
    emoji: "🌈",
    activeClass: "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sky-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Dramatic",
    emoji: "🎬",
    activeClass: "bg-red-500/20 text-red-300 border-red-500/60 shadow-red-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Humorous",
    emoji: "😄",
    activeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60 shadow-yellow-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Suspenseful",
    emoji: "😨",
    activeClass: "bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-orange-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
  {
    label: "Heartwarming",
    emoji: "🥰",
    activeClass: "bg-pink-500/20 text-pink-300 border-pink-500/60 shadow-pink-500/20",
    inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200",
  },
] as const;

type ToneLabel = (typeof TONES)[number]["label"];

// UI Text translations
const UI_TEXT: Record<string, Record<string, string>> = {
  English: {
    back: "BACK",
    freeAccess: "Free access for 3 requests",
    login: "Login",
    forMore: "for more!",
    perMonth: "Per Month",
    upgrade: "Upgrade",
    monthlyRequests: "This month request",
    totalPosts: "Total posts",
    titleStart: "Turn Your Ideas Into",
    titleAccent: "Amazing Stories!",
    length: "Length",
    language: "Language",
    short: "Short",
    medium: "Medium",
    long: "Long",
    promptPlaceholder: "Every great story begins with a single idea. What's yours?",
    keyboardTip: "Keyboard tip:",
    press: "Press",
    toGenerate: "to generate",
    alsoWorks: "also works",
    forNewLine: "for new line",
    generating: "Generating...",
    generate: "Generate",
    examples: "Here are some example prompts you can refer to:-",
    selectPrompt: "Select a prompt",
    characterLimit: "Character limit reached - generate is disabled",
    charactersRemaining: "characters remaining",
    shortcuts: "Keyboard Shortcuts",
    openHelp: "Open help",
    closeHelp: "Close help",
    focusPrompt: "Focus prompt",
    generateStory: "Generate story",
    publishStory: "Publish story",
    close: "Close",
    freeLimitReached: "Free Limit Reached",
    freeLimitMessage: "You've used all 3 free story generations. Login to continue creating more stories.",
    continueBrowsing: "Continue Browsing",
    recentPrompts: "Recent Prompts",
    usePrompt: "Use",
    delete: "Delete",
    clearAll: "Clear All",
    noRecentPrompts: "No recent prompts yet",
  },
  // Add other language translations here...
};

// Helper function - define before using it
const loadStoryDraft = () => {
  try {
    const draft = localStorage.getItem("storyDraft");
    if (draft) {
      return JSON.parse(draft);
    }
  } catch (error) {
    console.warn("Failed to load story draft:", error);
  }
  return null;
};

// Tone Picker Component
const TonePicker: React.FC<{ selected: ToneLabel | ""; onChange: (tone: ToneLabel | "") => void }> = 
  React.memo(({ selected, onChange }) => {
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="w-full text-xs text-gray-400 mb-1">🎭 Tone:</span>
        {TONES.map((tone) => {
          const isActive = selected === tone.label;
          return (
            <button
              key={tone.label}
              type="button"
              onClick={() => onChange(isActive ? "" : tone.label)}
              aria-pressed={isActive}
              title={isActive ? `Remove "${tone.label}" tone` : `Set tone to "${tone.label}"`}
              className={`
                px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                ${isActive
                  ? `${tone.activeClass} shadow-md scale-105`
                  : tone.inactiveClass
                }
              `}
            >
              {tone.emoji} {tone.label}
            </button>
          );
        })}
      </div>
    );
  });

// Main StoriesComponent
const StoriesComponent: React.FC = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
  
  // State declarations
  const [stories, setStories] = useState<IStories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // Removed unused setSelectedStory
  // const [selectedStory] = useState<IStories | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedLength, setSelectedLength] = useState<string>("medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  // Removed unused setDraftStatus
  // const [draftStatus] = useState<string>("");
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const login = isLoggedIn();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !login });
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";
  
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  // const [createPost] = useCreatePostMutation();
  
  // Simple addPrompt function - stores prompts in localStorage
  const addPrompt = useCallback((prompt: string) => {
    try {
      const existing = localStorage.getItem("recentPrompts");
      const prompts = existing ? JSON.parse(existing) : [];
      const updated = [prompt, ...prompts.filter((p: string) => p !== prompt)].slice(0, 10);
      localStorage.setItem("recentPrompts", JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to save recent prompt:", error);
    }
  }, []);

  const text = UI_TEXT[selectedLanguage] ?? UI_TEXT.English;
  
  // Load draft on mount
  useEffect(() => {
    const draft = loadStoryDraft();
    if (draft) {
      setTextareaValue(draft.prompt || "");
      setSelectedGenre(draft.genre || "");
      setSelectedLength(draft.length || "medium");
      setSelectedLanguage(draft.language || "English");
      setSelectedTone((draft.tone as ToneLabel) || "");
    }
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Play soundtrack when genre changes
  const playSoundtrack = useCallback((genre: string) => {
    const soundtrack = soundtrackMap[genre];
    if (!soundtrack) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = soundtrack;
      audioRef.current.play().catch(() => {});
    }

  }, []);

  // Clear prompt
  const handleClearPrompt = useCallback(() => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
  }, [setValue]);

  // Generate story handler
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    if (getWordCount(data.prompt) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }

    // Guest limit check
    if (!login && guestRequestCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${data.prompt}` : data.prompt,
        wordLength: selectedLength === "short" ? 175 : selectedLength === "long" ? 800 : 450,
        language: selectedLanguage,
        tone: selectedTone || undefined,
      };

      const generationRequest = login ? generateModel(payload) : generateFreeModel(payload);
      const res = await generationRequest.unwrap();
      
      if (res) {
        toast.success(res.message);
        addPrompt(data.prompt);
        const newStories = res.data as IStories[];
        setStories((prev) => [...prev, ...newStories]);
        // setSelectedStory is not used, but we're keeping the state
        setTextareaValue("");
        setSelectedPrompt("");
        setValue("prompt", "");
        localStorage.removeItem("storyDraft");
        reset();
        
        if (selectedGenre) {
          playSoundtrack(selectedGenre);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (!login) {
          setGuestRequestCount((prev) => {
            const newCount = prev + 1;
            localStorage.setItem("guestRequestCount", String(newCount));
            return newCount;
          });
        }
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [login, guestRequestCount, selectedGenre, selectedLength, selectedLanguage, selectedTone, generateModel, generateFreeModel, addPrompt, setValue, playSoundtrack, reset]);

  // Get unique stories
  const getUniqueStories = useCallback((storyList: IStories[]) => {
    const seen = new Set<string>();
    return storyList.filter((story) => {
      const key = `${story.title}-${story.content}-${story.tag}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  const uniqueStories = useMemo(() => getUniqueStories(stories), [stories, getUniqueStories]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onOpenHelp: () => setShowHelpModal(true),
    onCloseHelp: () => setShowHelpModal(false),
    onGenerate: () => {
      if (isGenerateDisabled) return;
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

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isDangerLimit = textareaValue.length >= MAX_PROMPT_LENGTH * DANGER_THRESHOLD;
  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen relative overflow-x-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="pt-2 w-full md:w-auto flex justify-start">
            <Link to="/">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
                <i className="fa-solid fa-left-long"></i> {text.back}
              </div>
            </Link>
          </div>

          {!login && (
            <div className="pt-2 text-center">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 text-gray-400 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm whitespace-normal md:whitespace-nowrap leading-relaxed">
                <span>
                  {text.freeAccess} — <Link to="/login"><span className="text-indigo-400 underline font-semibold">{text.login}</span></Link> {text.forMore}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
              <span>
                <span className="text-gray-400 text-xs mr-1">{text.perMonth}</span>
                {getRequestLimit(subscriptionType)}
              </span>
              <Link to="/pricing" className="border-1 border-white/20 pl-2 text-gray-300">
                {text.upgrade}
              </Link>
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-3 text-gray-500 text-xs text-center md:text-right">
              <span>
                {text.monthlyRequests}: {login ? (profile?.requestsThisMonth ?? 0) : guestRequestCount}
              </span>
              <br />
              <span>{text.totalPosts}: {login ? (profile?.postsCount ?? 0) : 0}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-11">
          <h1 className="text-slate-900 dark:text-gray-300 text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            ✨ {text.titleStart}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              {text.titleAccent}
            </span> ✨
          </h1>

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-blue-500/10 rounded-md p-4 border border-gray-400">
              <div className="relative">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {/* Genre chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {GENRES.map((genre) => (
                      <button
                        key={genre.value}
                        type="button"
                        onClick={() => {
                          const newGenre = selectedGenre === genre.value ? "" : genre.value;
                          setSelectedGenre(newGenre);
                          if (newGenre) playSoundtrack(newGenre);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          selectedGenre === genre.value
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200"
                        } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {genre.icon} {genre.name}
                      </button>
                    ))}
                  </div>

                  {/* Tone Picker */}
                  <TonePicker selected={selectedTone} onChange={setSelectedTone} />

                  {/* Length selector */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400 mr-1">📏 {text.length}:</span>
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
                        {text[length]}
                      </button>
                    ))}
                  </div>

                  {/* Language selector */}
                  <div className="flex items-center gap-2 mb-3" ref={languageDropdownRef}>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">🌐 {text.language}:</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 border border-slate-700/50 rounded-full text-xs font-semibold hover:bg-white/20 transition-all duration-200"
                      >
                        <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
                        <span className="text-gray-400 text-[10px]">▼</span>
                      </button>
                      {isLanguageDropdownOpen && (
                        <ul className="absolute right-0 z-20 mt-1.5 max-h-48 w-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl divide-y divide-slate-100 dark:divide-white/5 p-1">
                          {LANGUAGES.map((lang) => (
                            <li key={lang.code}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLanguage(lang.name);
                                  setIsLanguageDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 rounded-lg ${
                                  selectedLanguage === lang.name
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-gray-400 hover:bg-indigo-600/50 hover:text-white"
                                }`}
                              >
                                {lang.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Prompt textarea */}
                  <div className="relative w-full">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      disabled={loading}
                      className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-gray-200 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-12 transition-colors duration-200 box-border ${
                        isOverLimit ? "ring-1 ring-red-500 rounded" : isNearLimit ? "ring-1 ring-yellow-400 rounded" : ""
                      }`}
                      placeholder={text.promptPlaceholder}
                      value={textareaValue}
                      maxLength={MAX_PROMPT_LENGTH}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                          if (isGenerateDisabled) return;
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
                        aria-label={text.close}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Character count */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 dark:border-white/5">
                    <div className="flex-1 min-w-0 pr-4">
                      {isOverLimit ? (
                        <p className="text-[11px] font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 truncate m-0">
                          <span>⚠</span> {text.characterLimit}
                        </p>
                      ) : isNearLimit ? (
                        <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                          <span>⚠</span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                        </p>
                      ) : null}
                    </div>
                    <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${isOverLimit || isDangerLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"}`}>
                      {textareaValue.length} / {MAX_PROMPT_LENGTH}
                    </span>
                  </div>

                  {/* Keyboard tips */}
                  <div className="text-[11px] font-medium leading-relaxed text-slate-400 dark:text-slate-500">
                    💡 <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                    {text.press} <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd> to continue •{" "}
                    Press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Ctrl + Enter</kbd> to generate •{" "}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd> {text.forNewLine}
                  </div>

                  {/* Generate button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isGenerateDisabled}
                      className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
                        isGenerateDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-indigo-500/50"
                      } transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group cursor-pointer`}
                    >
                      <i className={`fas ${loading ? "fa-circle-notch animate-spin" : "fa-wand-magic-sparkles"} text-xl transition-transform duration-300 group-hover:animate-wiggle`}></i>
                      <span>{loading ? text.generating : text.generate}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Example prompts dropdown */}
            <div className="w-full max-w-2xl m-auto mt-4">
              <h1 className="text-sm text-gray-500 mb-1">{text.examples}</h1>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 bg-slate-800 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between text-sm text-left transition-all duration-200"
                >
                  <span className="truncate pr-4">{selectedPrompt || text.selectPrompt}</span>
                  <span className={`text-gray-300 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl divide-y divide-slate-700/30">
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

        {/* Stories View */}
        <StoriesViewComponent
          stories={uniqueStories}
          isLogin={login}
          setStories={setStories}
          isLoading={loading}
        />

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-white mb-4">{text.shortcuts}</h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <div><kbd>?</kbd> {text.openHelp}</div>
                <div><kbd>Esc</kbd> {text.closeHelp}</div>
                <div><kbd>/</kbd> {text.focusPrompt}</div>
                <div><kbd>Ctrl + Enter</kbd> {text.generateStory}</div>
                <div><kbd>Ctrl + S</kbd> {text.publishStory}</div>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
                {text.close}
              </button>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {loading && <StoryGeneratingAnimation />}

        {/* Limit Modal */}
        {showLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)] max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lock text-2xl text-blue-400"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-200 mb-2">{text.freeLimitReached}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{text.freeLimitMessage}</p>
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25">
                    {text.login}
                  </Link>
                  <button onClick={() => setShowLimitModal(false)} className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all">
                    {text.continueBrowsing}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

// Default export
export default StoriesComponent;