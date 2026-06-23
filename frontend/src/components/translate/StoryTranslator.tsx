import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useTranslateStoryMutation, useTranslateFreeStoryMutation } from "../../redux/apis/ai.model.api";
import { IStories } from "../stories/stories.view.component";

interface Props {
  story: IStories;
  isLogin: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: "Hindi", flag: "🇮🇳" },
  { code: "Spanish", flag: "🇪🇸" },
  { code: "French", flag: "🇫🇷" },
  { code: "German", flag: "🇩🇪" },
  { code: "Japanese", flag: "🇯🇵" },
  { code: "Chinese", flag: "🇨🇳" },
  { code: "Arabic", flag: "🇸🇦" },
  { code: "Portuguese", flag: "🇧🇷" },
  { code: "Russian", flag: "🇷🇺" },
  { code: "Korean", flag: "🇰🇷" },
  { code: "Italian", flag: "🇮🇹" },
  { code: "Bengali", flag: "🇧🇩" },
];

const SUPPORTED_LANGUAGE_CODES = new Set(LANGUAGES.map((l) => l.code));

/**
 * Extract a human-readable error message from an RTK Query mutation error.
 */
function extractErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // RTK Query wraps axios errors as { status, data }
    if (err.data) {
      const data = err.data as Record<string, unknown>;

      // Backend sends { errorMessages: [{ path, message }] } or { message }
      if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
        const first = data.errorMessages[0] as Record<string, unknown>;
        if (typeof first.message === "string") return first.message;
      }
      if (typeof data.message === "string") return data.message;
    }

    // Timeout
    if (err.status === 504 || err.status === "FETCH_ERROR") {
      return "Translation timed out. The AI service may be busy — please try again in a moment.";
    }

    if (typeof err.message === "string") return err.message;
  }

  return "Translation failed. Please try again.";
}

export default function StoryTranslator({ story, isLogin, onClose }: Props) {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [translatedTitle, setTranslatedTitle] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Guard against concurrent translation requests
  const isRequestInFlight = useRef(false);

  const [translateStory] = useTranslateStoryMutation();
  const [translateFreeStory] = useTranslateFreeStoryMutation();

  const handleTranslate = async () => {
    // ── Input validation ──────────────────────────────────────────────
    if (!selectedLanguage) {
      setError("Please select a language first.");
      return;
    }

    if (!SUPPORTED_LANGUAGE_CODES.has(selectedLanguage)) {
      setError(`"${selectedLanguage}" is not a supported language.`);
      return;
    }

    if (!story.content || story.content.trim().length < 10) {
      setError("Story content is too short to translate.");
      return;
    }

    if (!story.title || story.title.trim().length === 0) {
      setError("Story title is missing.");
      return;
    }

    // ── Duplicate request guard ───────────────────────────────────────
    if (isRequestInFlight.current) return;
    isRequestInFlight.current = true;

    setIsTranslating(true);
    setError("");
    setIsDone(false);

    try {
      const payload = {
        title: story.title,
        content: story.content,
        targetLanguage: selectedLanguage,
      };

      const result = isLogin
        ? await translateStory(payload).unwrap()
        : await translateFreeStory(payload).unwrap();

      if (result?.data) {
        const { title: tTitle, content: tContent } = result.data;

        // Handle empty translation response
        if (!tTitle && !tContent) {
          setError("The AI returned an empty translation. Please try again or choose a different language.");
          return;
        }

        setTranslatedTitle(tTitle || story.title);
        setTranslatedContent(tContent || "");
        setIsDone(true);
      } else {
        setError("No translation data received from the server.");
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsTranslating(false);
      isRequestInFlight.current = false;
    }
  };

  // ── Action 1: Copy to clipboard ──────────────────────────────────────────
  const handleCopy = async () => {
    const text = `${translatedTitle}\n\n${translatedContent}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Translation copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      toast.error("Failed to copy. Please try again.");
    }
  };

  // ── Action 2: Download as .txt ───────────────────────────────────────────
  const handleDownload = () => {
    const text = `${translatedTitle}\n\n${translatedContent}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${translatedTitle || "translated-story"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Story downloaded!");
  };

  // ── Action 3: Save as Draft ──────────────────────────────────────────────
  const handleSaveAsDraft = () => {
    const draftData = {
      prompt: translatedContent,
      genre: story.tag || "",
      length: "medium",
      language: selectedLanguage,
    };
    try {
      localStorage.setItem("story_spark_draft", JSON.stringify(draftData));
      toast.success("Saved as draft! Redirecting to story generator...");
      setTimeout(() => {
        onClose();
        navigate("/stories", {
          state: { prompt: translatedContent },
        });
      }, 1200);
    } catch {
      toast.error("Could not save draft. Storage limit may be full.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl bg-[#0f1117] rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">🌍 Story Translator</h2>
            <p className="text-xs text-white/40 mt-0.5 truncate max-w-xs">{story.title}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition text-xl">✕</button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Language selector */}
          <p className="text-sm text-white/60 mb-3 font-medium">Select target language:</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLanguage(lang.code); setIsDone(false); setError(""); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  selectedLanguage === lang.code
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/3 hover:border-white/20 text-white/70"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.code}</span>
              </button>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Translate button */}
          {!isDone && (
            <button
              onClick={handleTranslate}
              disabled={!selectedLanguage || isTranslating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg transition-all mb-6"
            >
              {isTranslating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Translating to {selectedLanguage}...
                </span>
              ) : (
                `🌍 Translate to ${selectedLanguage || "..."}`
              )}
            </button>
          )}

          {/* Side by side view */}
          {isDone && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-400">✅ Translated to {selectedLanguage}!</p>
                <button
                  onClick={() => { setIsDone(false); setSelectedLanguage(""); setError(""); }}
                  className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1 rounded-lg transition"
                >
                  Translate Again
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">🇬🇧 Original (English)</p>
                  <p className="text-sm font-semibold text-white mb-2">{story.title}</p>
                  <p className="text-xs text-white/60 leading-relaxed max-h-48 overflow-y-auto">{story.content}</p>
                </div>
                {/* Translated */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest mb-2">
                    {LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {selectedLanguage}
                  </p>
                  <p className="text-sm font-semibold text-white mb-2">{translatedTitle}</p>
                  <p className="text-xs text-white/60 leading-relaxed max-h-48 overflow-y-auto">{translatedContent}</p>
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">

                {/* Copy to Clipboard */}
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-all"
                >
                  {isCopied ? (
                    <>
                      <span>✅</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>Copy Translation</span>
                    </>
                  )}
                </button>

                {/* Download as .txt */}
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-all"
                >
                  <span>⬇️</span>
                  <span>Download .txt</span>
                </button>

                {/* Save as Draft */}
                <button
                  onClick={handleSaveAsDraft}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-sm font-medium transition-all"
                >
                  <span>✍️</span>
                  <span>Save as Draft</span>
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}