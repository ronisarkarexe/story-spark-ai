import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useGenerateModelMutation, useGenerateFreeModelMutation } from "../../redux/apis/ai.model.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { getUniqueStories, getWordCount, prompts, getRequestLimit } from "./stories.utils";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import StoriesViewComponent, { IStories } from "./stories.view.component";

// --- Constants & Configurations ---
const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.8;
const DANGER_THRESHOLD = 0.95;
const DRAFT_KEY = "storyspark_story_draft_v1";
const lengths = ["short", "medium", "long"] as const;

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
  { label: "Dark", emoji: "🌑", activeClass: "bg-gray-700 text-gray-100 border-gray-500 shadow-gray-700/40", inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200" },
  { label: "Whimsical", emoji: "🌈", activeClass: "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sky-500/20", inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200" },
  { label: "Dramatic", emoji: "🎬", activeClass: "bg-red-500/20 text-red-300 border-red-500/60 shadow-red-500/20", inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200" },
  { label: "Humorous", emoji: "😄", activeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/60 shadow-yellow-500/20", inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200" },
  { label: "Suspenseful", emoji: "😨", activeClass: "bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-orange-500/20", inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200" },
  { label: "Heartwarming", emoji: "🥰", activeClass: "bg-pink-500/20 text-pink-300 border-pink-500/60 shadow-pink-500/20", inactiveClass: "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200" },
] as const;

type ToneLabel = (typeof TONES)[number]["label"];

const UI_TEXT: Record<string, any> = {
  English: {
    back: "BACK", freeAccess: "Free access for 3 requests", login: "Login", forMore: "for more!",
    perMonth: "Per Month", upgrade: "Upgrade", monthlyRequests: "This month request", totalPosts: "Total posts",
    titleStart: "Turn Your Ideas Into", titleAccent: "Amazing Stories!", length: "Length", language: "Language",
    promptPlaceholder: "Every great story begins with a single idea. What's yours?",
    keyboardTip: "Keyboard tip:", press: "Press", toGenerate: "to generate", alsoWorks: "also works", forNewLine: "for new line",
    generating: "Generating...", generate: "Generate", examples: "Here are some example prompts you can refer to:-",
    selectPrompt: "Select a prompt", characterLimit: "Character limit reached - generate is disabled",
    charactersRemaining: "characters remaining", close: "Close"
  },
};

// --- Sub-components ---
const TonePicker: React.FC<{ selected: ToneLabel | ""; onChange: (tone: ToneLabel | "") => void }> = React.memo(({ selected, onChange }) => (
  <div className="flex flex-wrap gap-2 mb-3">
    <span className="w-full text-xs text-gray-400 mb-1">🎭 Tone:</span>
    {TONES.map((tone) => {
      const isActive = selected === tone.label;
      return (
        <button
          key={tone.label}
          type="button"
          onClick={() => onChange(isActive ? "" : tone.label)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${isActive ? `${tone.activeClass} shadow-md scale-105` : tone.inactiveClass}`}
        >
          {tone.emoji} {tone.label}
        </button>
      );
    })}
  </div>
));

// --- Main Component ---
export interface StoriesComponentProps {
  isLogin: boolean;
  isLoggedIn: () => boolean;
  getUserInfo: () => any;
}

interface ICharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
}

type Inputs = { prompt: string };

const StoriesComponent: React.FC<StoriesComponentProps> = ({ isLogin, getUserInfo }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<Inputs>();

  const [generateModel, { isLoading: isGenModel }] = useGenerateModelMutation();
  const [generateFreeModel, { isLoading: isGenFree }] = useGenerateFreeModelMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const loading = isGenModel || isGenFree;

  // Local States
  const [stories, setStories] = useState<IStories[]>([]);
  const [textareaValue, setTextareaValue] = useState(location.state?.prompt || "");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedGenre, setSelectedGenre] = useState("🧙 Fantasy");
  const [selectedLength, setSelectedLength] = useState("medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">("Dramatic");
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isHighLatency, setIsHighLatency] = useState(false);

  // Search/Filter states for the generated variations
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
  const isGenerationInProgressRef = useRef(false);

  const guestRequestCount = parseInt(localStorage.getItem("guestRequestCount") || "0", 10);
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";
  const text = UI_TEXT[selectedLanguage] || UI_TEXT.English;

  // Limits
  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isDangerLimit = textareaValue.length >= MAX_PROMPT_LENGTH * DANGER_THRESHOLD;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD && !isDangerLimit;
  const isGenerateDisabled = loading || isOverLimit || textareaValue.trim().length === 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft && !textareaValue) {
      setShowRestorePrompt(true);
    }
  }, [textareaValue]);

  // Draft Handlers
  const handleRestoreDraft = useCallback(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (draft.prompt) setTextareaValue(draft.prompt);
      if (draft.genre) setSelectedGenre(draft.genre);
      if (draft.length) setSelectedLength(draft.length);
      if (draft.language) setSelectedLanguage(draft.language);
      if (draft.tone) setSelectedTone(draft.tone);
      setShowRestorePrompt(false);
      toast.success("Draft restored!");
    } catch {
      toast.error("Failed to restore draft.");
    }
  }, []);

  const handleDiscardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setShowRestorePrompt(false);
  }, []);

  const handleCancelGeneration = useCallback(() => {
    if (activeGenerationRef.current) activeGenerationRef.current.abort();
    isGenerationInProgressRef.current = false;
    setIsHighLatency(false);
    toast.success("Story generation cancelled.");
  }, []);

  // Character Handlers
  const handleAddCharacter = () => setCharacters([...characters, { id: Math.random().toString(), name: "", role: "Protagonist", personality: "" }]);
  const handleRemoveCharacter = (id: string) => setCharacters(characters.filter(c => c.id !== id));
  const handleCharacterChange = (id: string, field: keyof ICharacter, val: string) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const onSubmit: SubmitHandler<Inputs> = async () => {
    if (isGenerationInProgressRef.current || isGenerateDisabled) return;
    if (getWordCount(textareaValue) < 10) {
      setValidationError("Please enter a prompt with at least 10 words.");
      return;
    }

    isGenerationInProgressRef.current = true;
    const timeoutId = setTimeout(() => setIsHighLatency(true), 8000);

    const payload = {
      prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${textareaValue}` : textareaValue,
      wordLength: selectedLength === "short" ? 175 : selectedLength === "long" ? 800 : 450,
      language: selectedLanguage,
      tone: selectedTone || undefined,
      characters: characters.map(c => ({ name: c.name, role: c.role, personality: c.personality }))
    };

    try {
      const req = isLogin ? generateModel(payload) : generateFreeModel(payload);
      activeGenerationRef.current = req as any;
      const res = await req.unwrap();
      
      if (res && res.data) {
        toast.success(res.message || "Story generated!");
        setStories(getUniqueStories(res.data as IStories[]));
        localStorage.removeItem(DRAFT_KEY);
        setTextareaValue("");
        setCurrentStep(1);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        toast.error(err?.data?.message || "Failed to generate story. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      isGenerationInProgressRef.current = false;
      activeGenerationRef.current = null;
      setIsHighLatency(false);
    }
  };

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return getUniqueStories(stories);
    const query = searchQuery.toLowerCase();
    return getUniqueStories(stories).filter((story: any) => {
      if (searchFilter === "title") return story.title?.toLowerCase().includes(query);
      if (searchFilter === "content") return story.content?.toLowerCase().includes(query);
      if (searchFilter === "genre") return story.tag?.toLowerCase().includes(query);
      return story.title?.toLowerCase().includes(query) || story.content?.toLowerCase().includes(query) || story.tag?.toLowerCase().includes(query);
    });
  }, [stories, searchQuery, searchFilter]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative overflow-x-hidden pt-10">
      <Toaster position="top-right" />
      {loading && <StoryGeneratingAnimation onCancel={handleCancelGeneration} isHighLatency={isHighLatency} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <Link to="/" className="px-4 py-2 rounded-lg bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/20 transition-all">
            <i className="fa-solid fa-left-long mr-2"></i> {text.back}
          </Link>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {isLogin ? (
              <span>{text.monthlyRequests}: {profile?.requestsThisMonth ?? 0} | {text.totalPosts}: {profile?.postsCount ?? 0}</span>
            ) : (
              <span>{text.freeAccess} — <Link to="/login" className="text-blue-500 underline">{text.login}</Link> {text.forMore}</span>
            )}
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ✨ {text.titleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{text.titleAccent}</span> ✨
          </h1>
        </div>

        {/* Generator Form */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-xl max-w-4xl mx-auto mb-16">
          {showRestorePrompt && (
            <div className="mb-4 p-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 flex justify-between items-center">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">📄 A previously saved draft was found. Restore it?</p>
              <div className="flex gap-2">
                <button onClick={handleRestoreDraft} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors">Restore</button>
                <button onClick={handleDiscardDraft} className="px-4 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-500 text-sm font-bold transition-colors">Discard</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">{text.language}</label>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors">
                      {LANGUAGES.map((lang) => (<option key={lang.code} value={lang.name}>{lang.name}</option>))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Genre</label>
                    <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors">
                      {GENRES.map((g) => (<option key={g.value} value={g.value}>{g.value}</option>))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">{text.length}</label>
                    <select value={selectedLength} onChange={(e) => setSelectedLength(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors">
                      {lengths.map((l) => (<option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>))}
                    </select>
                  </div>
                </div>

                <TonePicker selected={selectedTone} onChange={setSelectedTone} />

                <div className="relative">
                  <textarea
                    {...register("prompt")}
                    value={textareaValue}
                    onChange={(e) => { setTextareaValue(e.target.value); setValidationError(""); }}
                    placeholder={text.promptPlaceholder}
                    maxLength={MAX_PROMPT_LENGTH}
                    className={`w-full h-40 p-4 rounded-xl resize-none bg-slate-50 dark:bg-slate-950/50 border transition-colors outline-none text-slate-800 dark:text-slate-200 ${
                      isDangerLimit ? "border-red-500" : isNearLimit ? "border-yellow-400" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-xs text-red-500">{validationError}</span>
                    <span className={`text-xs font-bold ${isDangerLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-slate-400"}`}>
                      {textareaValue.length} / {MAX_PROMPT_LENGTH}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    Next: Characters ➡️
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Cast of Characters</h3>
                  <button type="button" onClick={() => setCurrentStep(1)} className="text-sm text-blue-500 hover:underline">← Back to Prompt</button>
                </div>

                {characters.map((char, index) => (
                  <div key={char.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">Character #{index + 1}</span>
                      <button type="button" onClick={() => handleRemoveCharacter(char.id)} className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={char.name} onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200" />
                      <select value={char.role} onChange={(e) => handleCharacterChange(char.id, "role", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200">
                        <option value="Protagonist">Protagonist</option>
                        <option value="Antagonist">Antagonist</option>
                        <option value="Companion">Companion</option>
                      </select>
                    </div>
                    <input type="text" value={char.personality} onChange={(e) => handleCharacterChange(char.id, "personality", e.target.value)} placeholder="Personality & Traits" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-slate-800 dark:text-slate-200" />
                  </div>
                ))}

                <button type="button" onClick={handleAddCharacter} className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <i className="fas fa-plus"></i> Add Character
                </button>

                <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button type="submit" disabled={isGenerateDisabled} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
                    <i className="fas fa-wand-magic-sparkles"></i> {loading ? text.generating : text.generate}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Generated Stories Viewer */}
        {stories.length > 0 && (
          <div className="mt-10">
            <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex gap-4 items-center">
              <input type="text" placeholder="Search generated variations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-slate-200" />
              <select value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none text-slate-800 dark:text-slate-200">
                <option value="all">All Fields</option>
                <option value="title">Title</option>
                <option value="content">Content</option>
                <option value="genre">Genre</option>
              </select>
            </div>

            <StoriesViewComponent 
              stories={filteredStories} 
              isLogin={isLogin} 
              isLoading={loading} 
              setStories={setStories} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesComponent;