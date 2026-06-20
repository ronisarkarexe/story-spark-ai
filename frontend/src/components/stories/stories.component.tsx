import React, { useState, useEffect, useRef, useMemo } from "react";
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

type Inputs = { prompt: string };

// Helper function to remove duplicate stories
const getuniqueStories = (stories: IStories[]): IStories[] => {
  const seen = new Set<string>();
  return stories.filter((story) => {
    if (seen.has(story.uuid)) return false;
    seen.add(story.uuid);
    return true;
  });
};


/* ─── Inline styles ─── */
const s: Record<string, React.CSSProperties> = {
  navPill: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#9ca3af",
    padding: "8px 14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
  },
  promptCard: {
    background: "rgba(30, 41, 80, 0.45)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "18px",
    padding: "24px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    resize: "none" as const,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#e2e8f0",
    fontSize: "16px",
    lineHeight: "1.7",
    letterSpacing: "0.015em",
    fontStyle: "italic",
  },
  generateBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    padding: "11px 28px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 18px rgba(99,102,241,0.45)",
  },
  kbdStyle: {
    padding: "2px 6px",
    fontSize: "11px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "5px",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  selectStyle: {
    width: "100%",
    padding: "10px 36px 10px 14px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#94a3b8",
    fontSize: "13px",
    outline: "none",
    appearance: "none" as const,
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
  },
  modalCard: {
    background: "linear-gradient(160deg, #0f172a 0%, #0d1526 100%)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "20px",
    boxShadow: "0 0 40px rgba(59,130,246,0.2)",
    maxWidth: "420px",
    width: "100%",
    padding: "32px 28px",
    textAlign: "center" as const,
  },
  lockIcon: {
    width: "60px",
    height: "60px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  loginModalBtn: {
    display: "block",
    width: "100%",
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    padding: "13px",
    cursor: "pointer",
    textDecoration: "none",
    marginBottom: "10px",
    transition: "opacity 0.2s",
  },
  dismissBtn: {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#6b7280",
    fontWeight: 500,
    fontSize: "14px",
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

const MAX_PROMPT_LENGTH = 2000;
const WARN_THRESHOLD = 0.85;

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

const LANGUAGE_STORAGE_KEY = "storySparkLanguage";

const GENRES = [
  { name: "🧙 Fantasy", value: "🧙 Fantasy" },
  { name: "🔮 Mystery", value: "🔮 Mystery" },
  { name: "💖 Romance", value: "💖 Romance" },
  { name: "🚀 Sci-Fi", value: "🚀 Sci-Fi" },
  { name: "👻 Horror", value: "👻 Horror" },
  { name: "⚔️ Adventure", value: "⚔️ Adventure" },
  { name: "🎭 Drama", value: "🎭 Drama" },
  { name: "😂 Comedy", value: "😂 Comedy" },
];

const soundtrackMap: Record<string, string> = {};

const StoriesComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
const storiesPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<Inputs>();

  const draft = useMemo(() => {
    try {
      const saved = localStorage.getItem("story_spark_draft");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const [stories, setStories] = useState<IStories[]>(
    draft?.stories?.length
      ? draft.stories
      : [
          {
            uuid: "test-1",
            title: "The Wizard's Journey",
            content:
              "Merlin walked through the forest toward the castle. The village was far behind him. He crossed the bridge over the river and entered the dungeon beneath the tower. Dragons guarded the mountain beyond the valley. Elena watched from the palace window as Merlin approached the cave near the ocean shore.",
            tag: "Fantasy",
            imageURL: "https://via.placeholder.com/400x300",
          },
        ]
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery] = useState("");
  const [searchFilter] = useState("all");

  const uniqueStories = useMemo(() => getuniqueStories(stories), [stories]);

  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return uniqueStories;
    
    const query = searchQuery.toLowerCase();
    
    return uniqueStories.filter((story) => {
      switch (searchFilter) {
        case "title":
          return story.title?.toLowerCase().includes(query);
        case "content":
          return story.content?.toLowerCase().includes(query);
        case "genre":
          return story.tag?.toLowerCase().includes(query);
        case "all":
        default:
          return (
            story.title?.toLowerCase().includes(query) ||
            story.content?.toLowerCase().includes(query) ||
            story.tag?.toLowerCase().includes(query)
          );
      }
    });
  }, [uniqueStories, searchQuery, searchFilter]);
  const indexOfLastStory = currentPage * storiesPerPage;
const indexOfFirstStory = indexOfLastStory - storiesPerPage;

const currentStories = filteredStories.slice(
  indexOfFirstStory,
  indexOfLastStory
);

const totalPages = Math.ceil(
  filteredStories.length / storiesPerPage
);
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, searchFilter]);

  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(
  draft?.genre
    ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "ðŸ§™ Fantasy")
    : "ðŸ§™ Fantasy",
);
  const [selectedLength] = useState<string>(draft?.length || "medium");
  const [textareaValue, setTextareaValue] = useState<string>(
    location.state?.prompt || draft?.prompt || ""
  );
  const [selectedLanguage ] = useState<string>(
    draft?.language || "English"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSoundtrack = (genre: string) => {
    const soundtrack = soundtrackMap[genre];
    if (!soundtrack) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(soundtrack);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch((err) => console.log("Audio playback failed:", err));
    audioRef.current = audio;
  };

  const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
  const isGenerationInProgressRef = useRef(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);

  // Derived limit flags used for UI feedback
  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Autosave draft
  // ensure selectedTone state exists (previously an invalid anonymous useState)
  const [selectedTone] = useState<string>(draft?.tone || "");
  useEffect(() => {
    const timer = setTimeout(() => {
      // stories intentionally excluded â€” API response, not user input
      // including stories risks hitting localStorage quota (~5MB) silently
      const draftData = {
        prompt: textareaValue,
        genre: selectedGenre,
        length: selectedLength,
        language: selectedLanguage,
        stories,
      };
      try {
        localStorage.setItem("story_spark_draft", JSON.stringify(draftData));
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          toast.error("Couldn't autosave draft â€” storage limit reached.");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone, stories]);

  // Sync language preference
  useEffect(() => {
    const selectedLocale =
      LANGUAGES.find((l) => l.name === selectedLanguage)?.code ?? "en";
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    document.documentElement.lang = selectedLocale;
  }, [selectedLanguage]);

  // Close dropdowns on outside click / Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        /* genre dropdown close — wire to your state if you re-add the dropdown */
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        /* language dropdown close */
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowHelpModal(false);
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
    if (location.state?.prompt) {
      setTextareaValue(location.state.prompt);
      setSelectedGenre(location.state.genre || "");
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate, setSelectedGenre, setTextareaValue]);

  useEffect(() => {
    setValue("prompt", textareaValue);
  }, [textareaValue, setValue]);

  useEffect(() => {
    return () => {
      activeGenerationRef.current?.abort();
    };
  }, []);

  const addPrompt = (prompt: string) => {
    try {
      const existing: string[] = JSON.parse(
        localStorage.getItem("recentPrompts") || "[]"
      );
      const updated = [prompt, ...existing.filter((p) => p !== prompt)].slice(0, 10);
      localStorage.setItem("recentPrompts", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (!login && guestRequestCount >= 3) {
      setShowLimitModal(true);
      return;
    }
    if (!formData.prompt) {
      toast.error("Please enter a prompt to generate a story.");
      return;
    }
    if (getWordCount(formData.prompt) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      return;
    }
    isGenerationInProgressRef.current = true;
    setLoading(true);
    try {
      // 60-second client-side request timeout safeguard
      timeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          toast.error("Story generation timed out. Please try again.");
          setLoading(false);
          isGenerationInProgressRef.current = false;
        }
      }, 60000);

      const payload = {
        prompt: selectedGenre
          ? `[Genre: ${selectedGenre}] ${formData.prompt}`
          : formData.prompt,
        wordLength:
          selectedLength === "short" ? 150 : selectedLength === "long" ? 500 : 250,
        language: selectedLanguage,
        tone: selectedTone || undefined,
      };
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);
      activeGenerationRef.current = generationRequest;
      const res = await generationRequest.unwrap();
      if (res) {
        toast.success(res.message);
        addPrompt(formData.prompt);
        setStories(res.data as IStories[]);
        setTextareaValue("");
        setSelectedPrompt("");
        setValue("prompt", "");
        if (selectedGenre) playSoundtrack(selectedGenre);
        if (!login) {
          const newCount = guestRequestCount + 1;
          setGuestRequestCount(newCount);
          localStorage.setItem("guestRequestCount", String(newCount));
        }
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (message !== "Story generation was cancelled.") toast.error(message);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      activeGenerationRef.current = null;
      isGenerationInProgressRef.current = false;
      setLoading(false);
    }
  };

  const handlePromptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrompt(e.target.value);
    setTextareaValue(e.target.value);
  };

  const handleClearPrompt = () => {
    setTextareaValue("");
    setSelectedPrompt("");
    setValue("prompt", "");
    inputRef.current?.focus();
  };


  const isGenerateDisabled = loading || isOverLimit;

  useKeyboardShortcuts({
    onOpenHelp: () => setShowHelpModal(true),
    onCloseHelp: () => setShowHelpModal(false),
    onGenerate: () => {
      if (isGenerateDisabled) {
        return;
      }
      if (inputRef.current) {
        const form = inputRef.current.closest("form");
        if (form) form.requestSubmit();
      }
    },
    onPublish: () => {
      const publishBtn = document.getElementById("publish-story-btn");
      publishBtn?.click();
    },
    focusPrompt: () => inputRef.current?.focus(),
    hasStory: stories.length > 0,
  });

  // showHelpModal, isOverLimit, isNearLimit, selectedGenre, selectedLength,
  // selectedLanguage are all used above — kept to avoid lint errors on the
  // variables that ARE wired to logic (genre/length/language affect the payload,
  // isOverLimit disables generate, helpModal drives keyboard shortcut).
  void showHelpModal; // consumed by useKeyboardShortcuts setter; referenced to silence lint if not rendered yet
  void isNearLimit;   // used for future char-count warning UI

  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen">
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-150px",
          left: "20%",
          width: "700px",
          height: "350px",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Top nav ── */}
        <div className="py-6 flex flex-row items-start justify-between gap-4">
          <div className="pt-2">
            <Link to="/" style={s.navPill}>
              <i className="fa-solid fa-left-long" /> BACK
            </Link>
          </div>

          {!login && (
            <div className="pt-2">
              <div style={{ ...s.navPill, cursor: "default" }}>
                Free access for 3 requests —{" "}
                <Link
                  to="/login"
                  style={{ color: "#818cf8", fontWeight: 700, textDecoration: "underline" }}
                >
                  Login
                </Link>{" "}
                for more!
              </div>
            </div>
          )}

          <div className="flex flex-col items-end pt-2">
            <div style={s.navPill}>
              <span style={{ color: "#9ca3af", fontSize: "11px" }}>Per Month</span>{" "}
              {getRequestLimit(userRole?.subscriptionType as string)}
              <Link
                to="/pricing"
                style={{
                  borderLeft: "1px solid rgba(255,255,255,0.2)",
                  paddingLeft: "10px",
                  color: "#c4b5fd",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Upgrade
              </Link>
              <i className="fas fa-bolt" style={{ color: "#fbbf24" }} />
            </div>
            <div
              style={{
                marginTop: "8px",
                color: "#4b5563",
                fontSize: "11px",
                textAlign: "right",
              }}
            >
              <div>
                This month: {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}{" "}
                requests
              </div>
              <div>Total posts: {login ? (data?.postsCount ?? 0) : 0}</div>
            </div>
          </div>
        </div>

        {/* ── Hero heading ── */}
        <div className="mt-8 mb-10 text-center">
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              fontWeight: 800,
              color: "#e2e8f0",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            ✨ Turn Your Ideas Into{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #c084fc 0%, #818cf8 50%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Amazing Stories!
            </span>{" "}
            âœ¨
          </h1>
          <p style={{ color: "#4b5563", marginTop: "10px", fontSize: "14px" }}>
            Powered by AI — describe your idea, we&apos;ll craft the story.
          </p>
        </div>

        {/* ── Prompt card ── */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 4px" }}>
          <div style={s.promptCard}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ position: "relative", marginBottom: "12px" }}>
                <textarea
                  {...register("prompt")}
                  ref={inputRef}
                  style={{
                    ...s.textarea,
                    ...(isOverLimit ? { color: "#f87171" } : {}),
                  }}
                  placeholder="Every great story begins with a single idea. What's yours?"
                  value={textareaValue}
                  maxLength={MAX_PROMPT_LENGTH}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
                {textareaValue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearPrompt}
                    style={{
                      position: "absolute",
                      right: "4px",
                      top: "4px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#4b5563",
                      padding: "4px",
                    }}
                    aria-label="Clear prompt"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Character count warning */}
              {isNearLimit && (
                <p
                  style={{
                    color: isOverLimit ? "#f87171" : "#f59e0b",
                    fontSize: "11px",
                    marginBottom: "8px",
                  }}
                >
                  {isOverLimit
                    ? "Character limit reached — generate is disabled"
                    : `${MAX_PROMPT_LENGTH - textareaValue.length} characters remaining`}
                </p>
              )}

              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                  marginBottom: "14px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <p style={{ color: "#4b5563", fontSize: "11px" }}>
                  💡 Press <kbd style={s.kbdStyle}>Tab</kbd> to navigate &{" "}
                  <kbd style={s.kbdStyle}>Enter</kbd> to generate
                </p>
                <button
                  type="submit"
                  disabled={loading || isOverLimit}
                  style={{
                    ...s.generateBtn,
                    opacity: loading || isOverLimit ? 0.5 : 1,
                    cursor: loading || isOverLimit ? "not-allowed" : "pointer",
                  }}
                >
                  <i className="fas fa-wand-magic-sparkles" />
                  {loading ? "Generating…" : "Generate"}
                </button>
              </div>
            </form>
          </div>

          {/* Example prompts */}
          <div style={{ marginTop: "16px" }}>
            <p style={{ color: "#4b5563", fontSize: "12px", marginBottom: "6px" }}>
              Try an example prompt:
            </p>
            <div style={{ position: "relative" }}>
              <select
                style={s.selectStyle}
                value={selectedPrompt}
                onChange={handlePromptSelect}
              >
                <option value="" disabled>
                  Select a prompt…
                </option>
                {prompts.map((item) => (
                  <option
                    key={item.id}
                    value={item.prompt}
                    style={{ background: "#0f172a" }}
                  >
                    {item.prompt}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#6b7280",
                  fontSize: "11px",
                }}
              >
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <StoryGeneratingAnimation />}

      <StoriesViewComponent
        stories={currentStories}
        isLogin={login}
        setStories={setStories}
      />

      {/* Limit modal */}
      {showLimitModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalCard}>
            <div style={s.lockIcon}>
              <i className="fas fa-lock" style={{ fontSize: "22px", color: "#818cf8" }} />
            </div>
            <h3
              style={{
                color: "#e2e8f0",
                fontSize: "22px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              Free Limit Reached
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "24px",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              You&apos;ve used all 3 free story generations. Log in to keep creating.
            </p>
            <Link to="/login" style={s.loginModalBtn}>
              Login to Continue
            </Link>
            <button style={s.dismissBtn} onClick={() => setShowLimitModal(false)}>
              Continue Browsing
            </button>
          </div>
        </div>
      )}
     
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;
