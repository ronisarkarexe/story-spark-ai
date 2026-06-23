import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  HelpCircle, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Eye, 
  Edit3, 
  Languages, 
  Gauge, 
  Music,
  Compass
} from "lucide-react";

import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, prompts } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
} from "../../redux/apis/ai.model.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { getErrorMessage } from "../../error/error.message";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";

import StoriesViewComponent, { IStories } from "./stories.view.component";
import SkeletonLoader from "./SkeletonLoader";
import EmptyStoriesState from "./EmptyStoriesState";

const soundtrackMap: Record<string, string> = {
  "🧙 Fantasy": "/audio/fantasy.mp3",
  "😱 Horror": "/audio/horror.mp3",
  "💕 Romance": "/audio/romance.mp3",
  "🎭 Drama": "/audio/drama.mp3",
  "😂 Comedy": "/audio/comedy.mp3",
  "🚀 Sci-Fi": "/audio/sci-fi.mp3",
  "🔍 Mystery": "/audio/mystery.mp3",
  "🌟 Adventure": "/audio/adventure.mp3"
};

type Inputs = {
  prompt: string;
};

interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.8;
const DANGER_THRESHOLD = 0.95;

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
] as const;

const TONES = [
  { label: "Dark", emoji: "🌑" },
  { label: "Whimsical", emoji: "🌈" },
  { label: "Dramatic", emoji: "🎬" },
  { label: "Humorous", emoji: "😄" },
  { label: "Suspenseful", emoji: "😨" },
  { label: "Heartwarming", emoji: "🥰" },
] as const;

const StoriesComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  // Fetch initial draft from LocalStorage
  const draft = useMemo(() => {
    try {
      const draftJson = localStorage.getItem("story_spark_draft");
      return draftJson ? JSON.parse(draftJson) : null;
    } catch {
      return null;
    }
  }, []);

  // Shared States
  const [stories, setStories] = useState<IStories[]>(() => {
    return draft?.stories?.length ? draft.stories : [];
  });
  const [selectedStory, setSelectedStory] = useState<IStories | null>(() => {
    return draft?.stories?.length ? draft.stories[0] : null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(() => {
    return draft?.genre || "🧙 Fantasy";
  });
  const [selectedLength, setSelectedLength] = useState<string>(() => {
    return draft?.length || "medium";
  });
  const [selectedTone, setSelectedTone] = useState<string>(() => {
    return draft?.tone || "Dramatic";
  });
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return draft?.language || "English";
  });
  const [textareaValue, setTextareaValue] = useState<string>(() => {
    return location.state?.prompt || draft?.prompt || "";
  });
  const [characters, setCharacters] = useState<ICharacter[]>(() => {
    return draft?.characters || [];
  });

  // UI state variables
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"create" | "read">("create");

  // Refs & Soundtracks
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const login = isLoggedIn();
  const { data: userProfile } = useGetProfileInfoQuery(undefined, { skip: !login });
  const subscriptionType = (getUserInfo()?.subscriptionType as string) || "free";

  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();

  // Genre Soundtrack Manager
  const playSoundtrack = (genre: string) => {
    const soundtrack = soundtrackMap[genre];
    if (!soundtrack) return;
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = soundtrack;
        audioRef.current.play().catch(() => {
          /* browser autoplay blocking compatibility */
        });
      } catch (err) {
        console.error("Audio error", err);
      }
    }
  };

  // Autosave story inputs draft
  useEffect(() => {
    const draftData = {
      prompt: textareaValue,
      genre: selectedGenre,
      length: selectedLength,
      language: selectedLanguage,
      tone: selectedTone,
      characters,
      stories,
    };
    const timer = setTimeout(() => {
      localStorage.setItem("story_spark_draft", JSON.stringify(draftData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone, characters, stories]);

  // Sync route context parameters
  useEffect(() => {
    if (location.state && location.state.prompt) {
      setTextareaValue(location.state.prompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    setValue("prompt", textareaValue);
  }, [textareaValue, setValue]);

  // Keyboard accessibility triggers
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

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Character customizer CRUD
  const handleAddCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      {
        id: generateId(),
        name: "",
        role: "Protagonist",
        personality: "",
      },
    ]);
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
  };

  const handleCharacterChange = (id: string, field: keyof ICharacter, value: string) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, [field]: value } : char))
    );
  };

  const handleClearPrompt = () => {
    setTextareaValue("");
    setValue("prompt", "");
    if (inputRef.current) inputRef.current.focus();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!login && guestRequestCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    if (!data.prompt.trim()) {
      toast.error("Please fill in a story prompt.");
      return;
    }

    setLoading(true);
    // Auto shift mobile viewport to reading screen
    setActiveMobileTab("read");

    try {
      const payload = {
        prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${data.prompt}` : data.prompt,
        wordLength: selectedLength === "short" ? 150 : selectedLength === "long" ? 500 : 250,
        language: selectedLanguage,
        tone: selectedTone || undefined,
        characters: characters.map(({ name, role, personality }) => ({ name, role, personality })),
      };

      const res = login
        ? await generateModel(payload).unwrap()
        : await generateFreeModel(payload).unwrap();

      if (res && res.data) {
        toast.success("AI story generated successfully!");
        const generatedList = res.data as IStories[];
        setStories(generatedList);
        setSelectedStory(generatedList[0]);
        
        // Save statistics parameters for guests
        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
        }

        // Trigger genre audio play
        if (selectedGenre) playSoundtrack(selectedGenre);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;
  const isDangerLimit = textareaValue.length >= MAX_PROMPT_LENGTH * DANGER_THRESHOLD;

  // Pre-load prompt triggers
  const handleExampleSelect = (promptText: string) => {
    setTextareaValue(promptText);
    setValue("prompt", promptText);
    setIsDropdownOpen(false);
  };

  // Close dropdown helpers on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 relative overflow-hidden font-sans pb-10">
      <audio ref={audioRef} className="hidden" />
      <Toaster position="top-right" reverseOrder={false} />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-300px] left-[-100px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Header / Status Row */}
      <header className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/5 relative z-25 bg-[#070b13]/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold tracking-wider text-slate-300"
          >
            ← BACK
          </Link>
        </div>

        {!login && (
          <div className="hidden md:flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs text-indigo-300">
            <span>Free access for 3 requests — <Link to="/login" className="underline font-bold text-indigo-200">Login</Link> for unlimited!</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-xs text-slate-400">
            <span>Requests this month: {login ? (userProfile?.requestsThisMonth ?? 0) : guestRequestCount} / {getRequestLimit(subscriptionType)}</span>
            <span className="text-[10px] text-slate-500">Total Published Posts: {login ? (userProfile?.postsCount ?? 0) : 0}</span>
          </div>
          <Link
            to="/pricing"
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-orange-500/10 flex items-center gap-1 cursor-pointer"
          >
            Upgrade Plan ⚡
          </Link>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        
        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden w-full bg-slate-900/60 border border-white/5 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveMobileTab("create")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeMobileTab === "create"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Define Settings
          </button>
          <button
            onClick={() => setActiveMobileTab("read")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeMobileTab === "read"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" /> Workspace Canvas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel (AI Input form controls) */}
          <div className={`lg:col-span-4 flex flex-col gap-6 ${activeMobileTab !== "create" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Main Creative Form Card */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              
              {/* Settings Card */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-indigo-400" /> Story Settings
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Genre chips selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Genre Category</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre.value}
                        type="button"
                        onClick={() => setSelectedGenre(genre.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          selectedGenre === genre.value
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                            : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200"
                        }`}
                      >
                        {genre.icon} {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone picker pills */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Story Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone.label}
                        type="button"
                        onClick={() => setSelectedTone(tone.label)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          selectedTone === tone.label
                            ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
                            : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200"
                        }`}
                      >
                        {tone.emoji} {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length & Language row */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Length</label>
                    <div className="flex bg-[#0b0e14] border border-white/5 p-1 rounded-full">
                      {["short", "medium", "long"].map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setSelectedLength(len)}
                          className={`flex-1 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            selectedLength === len
                              ? "bg-indigo-600 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2" ref={languageDropdownRef}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Language</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className="w-full py-2 px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold flex items-center justify-between text-slate-300 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5 text-indigo-400" /> {selectedLanguage}</span>
                        <span>▼</span>
                      </button>

                      {isLanguageDropdownOpen && (
                        <ul className="absolute left-0 right-0 z-30 mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-48 overflow-y-auto shadow-2xl p-1.5 focus:outline-none list-none m-0 divide-y divide-white/5">
                          {LANGUAGES.map((lang) => (
                            <li key={lang.code} className="p-0 m-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLanguage(lang.name);
                                  setIsLanguageDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                                  selectedLanguage === lang.name
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
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
                </div>

              </div>

              {/* Characters Accordion */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    👥 Cast of Characters
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    className="p-1.5 hover:bg-white/5 rounded-full border border-white/10 transition-colors text-xs font-bold flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                
                {characters.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    Define custom character details to guide story generation.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
                    {characters.map((char, index) => (
                      <div
                        key={char.id}
                        className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl flex flex-col gap-3 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveCharacter(char.id)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Character #{index + 1}</span>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase">Name</label>
                            <input
                              type="text"
                              value={char.name}
                              onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)}
                              placeholder="e.g. Merlin"
                              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase">Role</label>
                            <select
                              value={char.role}
                              onChange={(e) => handleCharacterChange(char.id, "role", e.target.value)}
                              className="px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-slate-300"
                            >
                              <option value="Protagonist">Protagonist</option>
                              <option value="Companion">Companion</option>
                              <option value="Rival">Rival</option>
                              <option value="Antagonist">Antagonist</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase">Personality</label>
                          <textarea
                            value={char.personality}
                            onChange={(e) => handleCharacterChange(char.id, "personality", e.target.value)}
                            placeholder="e.g. Brave, clumsy, afraid of water"
                            rows={2}
                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 outline-none text-xs text-white resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prompt Input Area */}
              <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Enter Prompt Idea</label>
                  <div className="relative">
                    <textarea
                      {...register("prompt")}
                      ref={(el) => {
                        register("prompt").ref(el);
                        inputRef.current = el;
                      }}
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      maxLength={MAX_PROMPT_LENGTH}
                      placeholder="Every great story begins with a single idea. What's yours?"
                      rows={5}
                      className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 text-sm leading-relaxed text-white placeholder:text-slate-500 resize-none transition-colors pr-10 ${
                        isOverLimit
                          ? "border-red-500 focus:border-red-500"
                          : isNearLimit
                          ? "border-yellow-500 focus:border-yellow-500"
                          : ""
                      }`}
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
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  {/* Character Counter */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-1 mt-1">
                    {isOverLimit ? (
                      <span className="text-red-400">⚠️ Character limit reached</span>
                    ) : isNearLimit ? (
                      <span className="text-yellow-400">⚠️ {MAX_PROMPT_LENGTH - textareaValue.length} characters left</span>
                    ) : (
                      <span />
                    )}
                    <span className={isOverLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-slate-500"}>
                      {textareaValue.length} / {MAX_PROMPT_LENGTH}
                    </span>
                  </div>
                </div>

                {/* Predefined prompt dropdown */}
                <div className="flex flex-col gap-2" ref={dropdownRef}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">💡 Select Predefined Prompt</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-left text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate pr-4">Select an example idea...</span>
                      <span>▼</span>
                    </button>

                    {isDropdownOpen && (
                      <ul className="absolute left-0 right-0 z-30 mt-2 bg-slate-900 border border-white/10 rounded-2xl max-h-56 overflow-y-auto shadow-2xl p-1.5 focus:outline-none list-none m-0 divide-y divide-white/5">
                        {prompts.map((item) => (
                          <li key={item.id} className="p-0 m-0">
                            <button
                              type="button"
                              onClick={() => handleExampleSelect(item.prompt)}
                              className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors duration-150 break-words leading-relaxed cursor-pointer"
                            >
                              {item.prompt}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || isOverLimit || !textareaValue.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-sm tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {loading ? "Wielding magic..." : "Generate AI Story"}
                </button>
              </div>

            </form>
          </div>

          {/* Right Panel (Story Reading area & Workspace) */}
          <div className={`lg:col-span-8 flex flex-col h-[calc(100vh-170px)] bg-slate-900/20 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5 rounded-3xl ${activeMobileTab !== "read" ? "hidden lg:flex" : "flex"}`}>
            
            {/* Version Selection Header */}
            {stories.length > 0 && selectedStory && (
              <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-4 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Variations</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {stories.map((story, index) => (
                    <button
                      key={story.uuid}
                      onClick={() => setSelectedStory(story)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center text-[10px] font-extrabold cursor-pointer ${
                        selectedStory.uuid === story.uuid
                          ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 scale-110 shadow"
                          : "border-slate-700 hover:border-slate-500 text-slate-400"
                      }`}
                    >
                      v{index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Renders */}
            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <SkeletonLoader key="skeleton" />
                ) : selectedStory ? (
                  <motion.div
                    key={selectedStory.uuid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <StoriesViewComponent
                      stories={stories}
                      selectedStory={selectedStory}
                      setSelectedStory={setSelectedStory}
                      setStories={setStories}
                      isLogin={login}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center p-6"
                  >
                    <div className="text-center flex flex-col items-center gap-4 max-w-sm">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl shadow-inner">
                        📖
                      </div>
                      <h3 className="text-lg font-bold text-slate-200">Your next story starts here</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Enter a creative prompt or pick one of our reference suggestions on the left, then click Generate to let AI bring your thoughts to life.
                      </p>
                      <button
                        onClick={() => {
                          setActiveMobileTab("create");
                          if (inputRef.current) inputRef.current.focus();
                        }}
                        className="mt-2 px-5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Enter Prompt
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </main>

      {/* Auxiliary Shortcut Modals */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 relative">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-1.5">
              ⌨️ Keyboard Shortcuts
            </h2>
            <div className="flex flex-col gap-3 text-slate-300 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Focus Prompt Input</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">/</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Submit & Generate Story</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Ctrl + Enter</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Publish Selected Story</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Open Keyboard Shortcuts Help</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">?</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Close Active Dialogs</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Close Help
            </button>
          </div>
        </div>
      )}

      {/* Guest Limit reached modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b0e14] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Free Request Limit Reached</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              You have completed 3 free generations. Register or login to your StorySparkAI profile to continue.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs"
              >
                Login to Profile
              </Link>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-300 text-xs font-semibold"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoriesComponent;
