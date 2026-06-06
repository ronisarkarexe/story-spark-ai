import React, { useEffect, useState, useRef, useMemo } from "react";
import DOMPurify from "dompurify";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import toast, { Toaster } from "react-hot-toast";
import { useAntiGravityScroll } from "../../hooks/useAntiGravityScroll";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
import {
  fetchImageAsBlob,
  blobToBase64,
  exportStoryToPDF,
  exportStoryToEPUB
} from "../../services/export.service";
import StoryWorldMap from "../story-map/StoryWorldMap";
import StoryRemix from "../remix/StoryRemix";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import ImageFallback from "../ImageFallback";
import GeneratedStoryTimeline from "./GeneratedStoryTimeline";

// --- Custom Error Classes & Helper Types ---
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "The AI service is currently busy. Please wait a moment and try again.";
    }
    if ([502, 503, 504].includes(error.status)) {
      return "The server took too long to respond. Please try again shortly.";
    }
    if (error.status >= 500) {
      return "A server error occurred. Please try again later.";
    }
  }
  if (error instanceof TypeError) {
    return "Could not reach the server. Please check your connection and try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

// Dummy themes helper (Ensure it works or adjust imports)
const getGenreTheme = (tag: string) => {
  return { gradient: "45deg, #1e1b4b, #311042", accent: "#a855f7", icon: "✨" };
};
const getInitials = (title: string) => title.slice(0, 2).toUpperCase();

interface StoryCoverImageProps {
  title?: string;
  tag?: string;
  size?: "thumb" | "full";
  className?: string;
  style?: React.CSSProperties;
}

const StoryCoverImage: React.FC<StoryCoverImageProps> = ({
  title = "",
  tag = "default",
  size = "full",
  className = "",
  style = {},
}) => {
  const theme = getGenreTheme(tag);
  const initials = getInitials(title);

  if (size === "thumb") {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `linear-gradient(${theme.gradient})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.05em",
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          userSelect: "none",
          ...style,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "192px",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(${theme.gradient})`,
        borderRadius: "inherit",
        ...style,
      }}
    >
      <div style={{ position: "absolute", top: "-30%", right: "-15%", width: "60%", height: "120%", background: "rgba(255,255,255,0.08)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "45%", height: "80%", background: "rgba(0,0,0,0.12)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "12px", right: "16px", fontSize: "3.5rem", color: theme.accent, opacity: 0.35, lineHeight: 1, userSelect: "none", pointerEvents: "none", fontWeight: 300 }}>{theme.icon}</div>
      <div style={{ position: "absolute", top: "14px", left: "14px", background: "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", border: `1px solid ${theme.accent}55`, userSelect: "none" }}>{tag}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "5rem", fontWeight: 900, color: "rgba(255,255,255,0.12)", letterSpacing: "-0.04em", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{initials}</div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)", padding: "32px 14px 12px" }}>
        <p style={{ margin: 0, color: "#fff", fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.3, textShadow: "0 1px 6px rgba(0,0,0,0.5)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{title}</p>
      </div>
    </div>
  );
};

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
}

interface IPost extends IStories {
  topic: ITopicData[];
  isPublished?: boolean;
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
}

interface IRelatedStoriesComponentProps {
  posts: { _id: string; title: string; [key: string]: unknown }[];
  currentPostId: string;
}

type StorySentenceSegment = {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
};

const buildSentenceSegments = (content: string): StorySentenceSegment[] => {
  if (!content.trim()) return [];
  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments: StorySentenceSegment[] = [];
  let wordCursor = 0;

  sentenceMatches.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) return;
    const wordsInSentence = sentence.match(/\S+/g)?.length ?? 0;
    const startWordIndex = wordCursor;
    const endWordIndex = wordsInSentence > 0 ? wordCursor + wordsInSentence - 1 : wordCursor;

    segments.push({
      id: `${index}-${startWordIndex}-${endWordIndex}`,
      text: sentence,
      startWordIndex,
      endWordIndex,
    });
    wordCursor += wordsInSentence;
  });
  return segments;
};

const getSafeFileName = (title: string, extension: "md" | "docx"): string => {
  const safeTitle = (title || "story")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeTitle || "story"}.${extension}`;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const createDocxBlob = ({
  title,
  content,
  tag,
  author,
}: {
  title: string;
  content: string;
  tag: string;
  author: string;
}): Blob => {
  const paragraphs = content
    .split(/\n+/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
    h1 { color: #312e81; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Tag: ${escapeHtml(tag)} | Author: ${escapeHtml(author)}</div>
  ${paragraphs}
</body>
</html>`;

  return new Blob([html], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
  });
};

const StoryRemixModal = StoryRemix as unknown as React.ComponentType<{
  story?: string;
  title?: string;
  selectedStory?: IStories;
  onClose?: () => void;
  onApplyRemix?: (content: string) => void;
}>;

const StoryWorldMapModal = StoryWorldMap as React.ComponentType<{
  story?: string;
  storyContent?: string;
  title?: string;
  onClose: () => void;
}>;

export const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({ posts, currentPostId }) => {
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post) => post._id !== currentPostId);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-slate-200 mb-4">Related Content</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/stories/${post._id}`)}
            className="p-4 bg-slate-700/40 rounded-xl border border-slate-600/30 cursor-pointer hover:bg-slate-700/60 transition-colors"
          >
            <p className="text-sm font-semibold text-white truncate">{post.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const storyScrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    isPlaying: isAntiGravityPlaying,
    setIsPlaying: setIsAntiGravityPlaying,
    targetSpeed: antiGravitySpeed,
    setTargetSpeed: setAntiGravitySpeed,
  } = useAntiGravityScroll(storyScrollContainerRef);

  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // Error handling states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Export states
  const [exportState, setExportState] = useState<"idle" | "processing" | "compiling" | "success" | "error">("idle");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Standard functional states
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  
  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);

  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{ [uuid: string]: string }>({});

  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = async (format: "pdf" | "epub") => {
    if (!selectedStory) return;
    
    setIsExportDropdownOpen(false);
    setExportState("processing");
    const toastId = toast.loading(`Preparing story for ${format.toUpperCase()} export...`);

    try {
      let imageBlob: Blob | null = null;
      let base64Image: string | null = null;

      if (selectedStory.imageURL) {
        try {
          imageBlob = await fetchImageAsBlob(selectedStory.imageURL);
          base64Image = await blobToBase64(imageBlob);
        } catch (err) {
          console.error("Could not fetch story illustration for export:", err);
          toast.error("Story illustration could not be loaded. Exporting text only.");
        }
      }

      setExportState("compiling");
      toast.loading(`Compiling ${format.toUpperCase()} file...`, { id: toastId });

      if (format === "pdf") {
        await exportStoryToPDF(selectedStory, base64Image);
      } else {
        await exportStoryToEPUB(selectedStory, imageBlob);
      }

      setExportState("success");
      toast.success(`${format.toUpperCase()} downloaded successfully!`, { id: toastId });
      setTimeout(() => setExportState("idle"), 2000);
    } catch (err) {
      console.error(`Failed to export to ${format}:`, err);
      setExportState("error");
      toast.error(`Failed to generate ${format.toUpperCase()}.`, { id: toastId });
      setTimeout(() => setExportState("idle"), 2000);
    }
  };

  const getExportButtonText = () => {
    switch (exportState) {
      case "processing":
        return "Processing Images...";
      case "compiling":
        return "Compiling Book...";
      case "success":
        return "Success!";
      case "error":
        return "Failed";
      default:
        return "📥 Export Story";
    }
  };

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
    setErrorMessage(null); // Clear errors when switching stories
  }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    } else {
      setSelectedStory(null);
    }
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
  }, [stories]);

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;

    setErrorMessage(null);
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Generating alternate endings...");

    try {
      const payload = {
        title: selectedStory.title,
        content: originalStoryContent[selectedStory.uuid] || selectedStory.content,
        tag: selectedStory.tag,
        language: selectedStory.language || "English",
      };

      const generationRequest = isLogin
        ? generateAlternateEndings(payload)
        : generateFreeAlternateEndings(payload);

      const res = await generationRequest.unwrap();

      // Guard check validation
      if (!res || !Array.isArray(res.data)) {
        throw new Error("Invalid response from server");
      }

      setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
      toast.success("Alternate endings generated successfully!");
    } catch (err: any) {
      console.error("[StoriesView Alternate Ending Flow Failure]:", err);
      const errorStatus = err?.status || err?.data?.status;
      const parsedMessage = errorStatus
        ? getErrorMessage(new ApiError(errorStatus, err?.data?.message || ""))
        : err?.message || "An unexpected failure occurred.";
      
      setErrorMessage(parsedMessage);
      toast.error("Failed to generate alternate endings.");
    } {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false); // Fixes infinite spinner
    }
  };

  const handleApplyEnding = (endingData: { style: string; ending: string; fullStory: string }) => {
    if (!selectedStory) return;
    const updatedStory = { ...selectedStory, content: endingData.fullStory };
    setSelectedStory(updatedStory);
    setStories(stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s)));
    toast.success(`${endingData.style} applied to story!`);
  };

  const handleResetEnding = () => {
    if (!selectedStory) return;
    const originalContent = originalStoryContent[selectedStory.uuid];
    if (!originalContent) return;
    const updatedStory = { ...selectedStory, content: originalContent };
    setSelectedStory(updatedStory);
    setStories(stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s)));
    toast.success("Reverted to original story ending!");
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <Toaster />
      
      {/* Step 16: Error Banner Component UI Layout Rendering */}
      {errorMessage && (
        <div className="error-banner mb-6 p-4 bg-amber-500/20 border border-amber-500 rounded-xl text-amber-200 flex justify-between items-center animate-fadeIn">
          <div className="flex items-center gap-3">
            <span>⚠️</span>
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs uppercase font-bold tracking-wider hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {selectedStory ? (
          <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-black mb-4">{selectedStory.title}</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {selectedStory.imageURL && (
                <div className="w-full md:w-1/3 shrink-0">
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-md">
                    <img
                      src={selectedStory.imageURL}
                      alt={selectedStory.title}
                      className="w-full h-auto object-cover max-h-[300px] md:max-h-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 prose prose-invert max-w-none text-slate-300 leading-relaxed">
                {selectedStory.content}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Step 17: Generate Button disables during loading phase */}
              <button
                onClick={handleGenerateAlternateEndings}
                disabled={isGeneratingEndings}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all text-white ${
                  isGeneratingEndings 
                    ? "bg-slate-700 cursor-not-allowed opacity-50" 
                    : "bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/20"
                }`}
              >
                {isGeneratingEndings ? "Generating Endings..." : "Generate Alternate Endings"}
              </button>

              {/* Export Story Dropdown Menu */}
              <div className="relative inline-block text-left" ref={dropdownMenuRef}>
                <button
                  type="button"
                  disabled={exportState !== "idle"}
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all text-white flex items-center gap-2 ${
                    exportState !== "idle"
                      ? "bg-slate-700 cursor-not-allowed opacity-50"
                      : "bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-600/20 cursor-pointer"
                  }`}
                >
                  {getExportButtonText()}
                </button>

                {isExportDropdownOpen && (
                  <div className="absolute left-0 mt-2 z-50 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-xl p-1 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => handleExport("pdf")}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>📄</span> Download Printable PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport("epub")}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>📘</span> Download Kindle EPUB
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">No stories available.</div>
        )}
      </div>

      <div className="mt-7">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-200 mb-4">
            Select Topics
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={newTopicTitle}
              onChange={(event) => setNewTopicTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddTopic();
                }
              }}
              placeholder="Add related topic"
              className="flex-1 rounded-lg border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="button"
              className="rounded-lg px-4 py-2 bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-500 transition-colors"
              onClick={handleAddTopic}
            >
              Add Topic
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStory ? (
              <>
                {topics.map((topic, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 ${topic.className} rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-sm`}
                  >
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => handleTopicClick(index)}
                    >
                      {topic.selected ? (
                        <i className="fa-solid fa-check"></i>
                      ) : (
                        <i className="fa-solid fa-plus"></i>
                      )}{" "}
                      {topic.title}
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer border-l border-current/30 pl-2 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => handleRemoveTopic(index)}
                      disabled={topics.length <= 2}
                      aria-label={`Remove ${topic.title}`}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
              </>
            ) : (
              <p className="text-gray-400">
                No topics available. Please generate a story first.
              </p>
            )}
          </div>
        </div>

        {/* Alternate Endings Section */}
        {selectedStory && (
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mt-8 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  Alternate Endings
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Explore alternate narrative styles for your story context.
                </p>
              </div>
              {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                <button
                  type="button"
                  onClick={handleResetEnding}
                  className="rounded-lg px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-700/50 font-semibold text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset to Original
                </button>
              )}
            </div>

            {isGeneratingEndings ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-slate-300 text-sm font-medium animate-pulse">
                  Generating alternate endings...
                </p>
              </div>
            ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
              <div>
                {/* Tabs */}
                <div className="flex border-b border-slate-700/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {[
                    { name: "Happy Ending" },
                    { name: "Dark Ending" },
                    { name: "Plot Twist Ending" },
                    { name: "Open Ending" },
                    { name: "Cliffhanger Ending" }
                  ].map((s) => {
                    const hasEndings = endingsCache[selectedStory.uuid] || [];
                    const endingData = hasEndings.find((e) => e.style === s.name);
                    const isApplied = endingData && selectedStory.content === endingData.fullStory;
                    
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setActiveEndingTab(s.name)}
                        className={`px-5 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                          activeEndingTab === s.name
                            ? "border-purple-500 text-purple-400 bg-purple-500/5"
                            : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{s.name}</span>
                        {isApplied && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content */}
                {(() => {
                  const currentEndings = endingsCache[selectedStory.uuid] || [];
                  const currentEndingData = currentEndings.find((e) => e.style === activeEndingTab);
                  if (!currentEndingData) return null;
                  
                  const isCurrentlyApplied = selectedStory.content === currentEndingData.fullStory;
                  
                  return (
                    <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/30">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-slate-200">
                          {activeEndingTab} Suggestion
                        </h4>
                        <div>
                          {isCurrentlyApplied ? (
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                              <i className="fa-solid fa-check"></i> Applied to Story
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyEnding(currentEndingData)}
                              className="rounded-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md hover:shadow-purple-500/20"
                            >
                              Apply to Story
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Glassmorphic Anti-Gravity Scroll Control Panel Dock */}
                        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xl select-none">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                              Anti-Gravity Engine
                            </span>
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase">
                              {isAntiGravityPlaying ? "Active" : "Idle"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Speed: {antiGravitySpeed.toFixed(1)}x
                              </span>
                              <input
                                type="range"
                                min="0.5"
                                max="5.0"
                                step="0.1"
                                value={antiGravitySpeed}
                                onChange={(e) => setAntiGravitySpeed(parseFloat(e.target.value))}
                                disabled={!isAntiGravityPlaying}
                                className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAntiGravityPlaying(!isAntiGravityPlaying)}
                              className={`px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                isAntiGravityPlaying
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-95"
                                  : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-500/30 active:scale-95"
                              }`}
                            >
                              {isAntiGravityPlaying ? (
                                <>
                                  <i className="fa-solid fa-pause text-[9px] animate-pulse" />
                                  <span>Pause Engine</span>
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-play text-[9px]" />
                                  <span>Engage Scroll</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div ref={storyScrollContainerRef} className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 leading-relaxed text-slate-300 text-sm md:text-base italic shadow-inner whitespace-pre-wrap max-h-[520px] overflow-y-auto">
                          <p>{currentEndingData.ending}</p>
                        </div>
                        
                        <div>
                          <details className="group border border-slate-800 rounded-lg overflow-hidden bg-slate-950/20">
                            <summary className="list-none flex items-center justify-between p-3 text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                              <span>PREVIEW FULL STORY WITH THIS ENDING</span>
                              <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
                            </summary>
                            <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                              {currentEndingData.fullStory}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-900/20 border border-dashed border-slate-700/40 rounded-xl">
                <button
                  type="button"
                  onClick={handleGenerateAlternateEndings}
                  className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 cursor-pointer"
                >
                  Generate Alternate Endings
                </button>
                <p className="text-xs text-slate-400 mt-3 text-center max-w-sm px-4 leading-relaxed">
                  Uses the story context to produce 5 unique ending variations (Happy, Dark, Plot Twist, Open, Cliffhanger) for comparison.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-1 lg:col-span-4">
        <div className="mb-5">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
            Preview
          </h1>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden group">
          <div className="relative flex flex-col rounded-lg">
            <div className="relative m-3 overflow-hidden text-white rounded-xl">
              <ImageFallback
                src={selectedStory?.imageURL ?? ""}
                alt="card-image"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="px-3 py-1">
              <div className="flex justify-between items-center mb-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                    {selectedStory?.tag.toUpperCase() ?? ""}
                  </div>
                  <div className="inline-flex items-center rounded-full bg-indigo-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                    {(selectedStory?.language || "English").toUpperCase()}
                  </div>
                </div>
                <div>
                  {selectedStory && <BookmarkButton storyId={selectedStory.uuid} />}
                </div>
              </div>
              <h6 className="mb-1 text-gray-300 text-xl font-semibold">
                {selectedStory?.title ?? ""}
              </h6>
              <p className="text-gray-400 font-light breakwords text-sm sm:text-base">
                {selectedStory ? getShortenedText(selectedStory.content) : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showWorldMap && selectedStory && (
        <StoryWorldMap
          story={selectedStory.content}
          title={selectedStory.title}
          onClose={() => setShowWorldMap(false)}
        />
      )}

      {showRemix && selectedStory && (
        <StoryRemixModal
          story={selectedStory.content}
          title={selectedStory.title}
          selectedStory={selectedStory}
          onClose={() => setShowRemix(false)}
          onApplyRemix={(content: string) => {
            const updatedStory = { ...selectedStory, content };
            setSelectedStory(updatedStory);
            setStories(stories.map((story) => (story.uuid === selectedStory.uuid ? updatedStory : story)));
            setShowRemix(false);
          }}
        />
      )}

      {showStoryVisualizer && storyboardScenes.length > 0 && (
        <StoryVisualizer
          title={selectedStory?.title ?? ""}
          scenes={storyboardScenes}
          styleGuide={storyboardStyleGuide}
          onClose={() => setShowStoryVisualizer(false)}
        />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesViewComponent;