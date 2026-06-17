import React, { useEffect, useState, useRef, useMemo } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import toast, { Toaster } from "react-hot-toast";
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
import StoryTrailer from "../trailer/StoryTrailer";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStory } from "../../redux/slices/storySlice";
import ContinueStoryButton from "../story/ContinueStoryButton";
import { useApiError } from "../../hooks/useApiError";
import { useLocation } from "react-router-dom";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import ImageFallback from "../ImageFallback";
import StoryVisualizer from "../story-visualizer/StoryVisualizer";
import ContinueStoryModal from "./ContinueStoryModal";

const StoryWorldMap = React.lazy(() => import("../story-map/StoryWorldMap"));
const StoryRemix = React.lazy(() => import("../remix/StoryRemix"));

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

// Dummy themes helper
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

import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  emotions?: string[];
  enhancedPrompt?: string;
  imageURL: string;
  language?: string;
  genre?: string;
}

interface IPost extends IStories {
  topic: ITopicData[];
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
}

type StorySentenceSegment = {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
};

const buildSentenceSegments = (content: string): StorySentenceSegment[] => {
  if (!content.trim()) {
    return [];
  }

  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments: StorySentenceSegment[] = [];
  let wordCursor = 0;

  sentenceMatches.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) {
      return;
    }

    const wordsInSentence = sentence.match(/\S+/g)?.length ?? 0;
    const startWordIndex = wordCursor;
    const endWordIndex =
      wordsInSentence > 0 ? wordCursor + wordsInSentence - 1 : wordCursor;

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

const getSafeFileName = (title: string, extension: "md" | "docx" | "pdf"): string => {
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

    wordCursor += wordsInSentence;
  });

export const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({ posts, currentPostId }) => {
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post) => post._id !== currentPostId);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-slate-200 mb-4">Related Content</h4>
      {filteredPosts.length > 0 ? (
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
      ) : (
        <p className="text-center text-slate-500 py-4 border border-dashed border-slate-700 rounded-xl">No related stories found.</p>
      )}
    </div>
  );
  return segments;
};

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
  isLoading: isGlobalLoading,
  onPublishSuccess,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storyScrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    isPlaying: isAntiGravityPlaying,
    setIsPlaying: setIsAntiGravityPlaying,
    targetSpeed: antiGravitySpeed,
    setTargetSpeed: setAntiGravitySpeed,
  } = useAntiGravityScroll(storyScrollContainerRef);

  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Export states
  const [exportState, setExportState] = useState<"idle" | "processing" | "compiling" | "success" | "error">("idle");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Standard functional states
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // Start with a clean state that adapts dynamically
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // Modals
  const [showContinueModal, setShowContinueModal] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showRemix, setShowRemix] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [showStoryVisualizer, setShowStoryVisualizer] = useState<boolean>(false);
  
  // StoryVisualizer states
  const [storyboardScenes, setStoryboardScenes] = useState<StoryboardScene[]>([]);
  const [storyboardStyleGuide, setStoryboardStyleGuide] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
const [, setShowRemix] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);
  // Alternate ending state & hooks
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{
    [uuid: string]: string;
  }>({});

  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();
  const [generateStoryVisuals, { isLoading: isGeneratingVisuals }] = useGenerateStoryVisualsMutation();
  const { setError, clearError } = useApiError();

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  useEffect(() => {
    if (narrationState === "playing") {
      const activeWordElement = document.querySelector('[data-active-word="true"]');
      if (activeWordElement) {
        activeWordElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    }
  }, [narrationWordIndex, narrationState]);

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;
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
      if (res && res.data) {
        setEndingsCache((prev) => ({
          ...prev,
          [selectedStory.uuid]: res.data,
        }));
        toast.success("Alternate endings generated successfully!");
      } else {
        toast.error("Failed to generate alternate endings.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate alternate endings. Please try again.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  const handleApplyEnding = (endingData: { style: string; ending: string; fullStory: string }) => {
    if (!selectedStory) return;
    const updatedStory = {
      ...selectedStory,
      content: endingData.fullStory,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success(`${endingData.style} applied to story!`);
  };

  const handleResetEnding = () => {
    if (!selectedStory) return;
    const originalContent = originalStoryContent[selectedStory.uuid];
    if (!originalContent) return;
    const updatedStory = {
      ...selectedStory,
      content: originalContent,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success("Reverted to original story ending!");
  };

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTextToSpeech = () => {
    if (!selectedStory?.content) return;

    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
        toast.success("Resumed reading story");
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
        toast.success("Paused reading story");
      }
    } else {
      window.speechSynthesis.cancel();
      const cleanContent = selectedStory.content.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en-") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.startsWith("en-"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      toast.success("Playing story audio");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    toast.success("Stopped audio playback");
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
    setErrorMessage(null);
  }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  // Sync state instantly whenever a new template is submitted or selected
  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    } else {
      setSelectedStory(null);
    }
    // Reset auto-save status for new story session
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
  }, [stories]);

  useEffect(() => {
    const autoSaveStory = async () => {
      // 1. Prevent guest auto-save requests
      if (!isLogin || !selectedStory) return;

      // 2. Prevent duplicate auto-save requests for unchanged story content
      if (selectedStory.content === lastSavedContentRef.current) {
        return;
      }

      // 3. Only one draft/post is created per story session (prevent variation/topic duplicates)
      if (hasSavedSessionRef.current) {
        return;
      }

      // 4. Prevent duplicate network calls while a save is already running
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      const post: IPost = {
        ...selectedStory,
        topic: selectTopics,
      };

      try {
        const result = await createPost(post).unwrap();
        if (result && result.data && result.data._id) {
          savedPostIdRef.current = result.data._id;
        }
        lastSavedContentRef.current = selectedStory.content;
        hasSavedSessionRef.current = true;
        toast.success("Story auto-saved!");
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        isSavingRef.current = false;
      }
    };

    // Debounce to prevent multiple immediate renders/rerenders from triggering save
    const timer = setTimeout(() => {
      autoSaveStory();
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic, topicIndex) =>
        topicIndex === index
          ? { ...topic, selected: !topic.selected }
          : topic
      )
    );
  };
  const handleAddTopic = () => {
    const title = newTopicTitle.trim();

    if (!title) {
      toast.error("Please enter a topic.");
      return;
    }

    const normalizedTitle = title.startsWith("#") ? title : `#${title}`;
    const topicExists = topics.some(
      (topic) => topic.title.toLowerCase() === normalizedTitle.toLowerCase()
    );

    if (topicExists) {
      toast.error("This topic already exists.");
      return;
    }

    setTopics((currentTopics) => [
      ...currentTopics,
      {
        title: normalizedTitle,
        className: SELECTED_TOPIC_CLASSES,
        color: SELECTED_TOPIC_CLASSES,
        selected: true,
      },
    ]);
    setNewTopicTitle("");
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 2) {
      toast.error("At least 2 topics are required.");
      return;
    }

    setTopics((currentTopics) =>
      currentTopics.filter((_, topicIndex) => topicIndex !== index)
    );
  };
  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      await navigator.clipboard.writeText(selectedStory.content);
      setIsCopied(true);
      toast.success("Story copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

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
        return "📥 Export";
    }
  };

  const handleExportPDF = async () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) {toast.error("Story content is empty. Cannot export.");return;}
    const toastId = toast.loading("Preparing your premium PDF...");

    try {
      // Helper to load image assets asynchronously with a safe timeout
      const loadImageWithTimeout = (src: string, timeoutMs: number = 3000): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const timeout = setTimeout(() => {
            img.src = ""; // stop loading
            reject(new Error(`Timeout loading image: ${src}`));
          }, timeoutMs);

          img.onload = () => {
            clearTimeout(timeout);
            resolve(img);
          };
          img.onerror = (e) => {
            clearTimeout(timeout);
            reject(e);
          };
          img.src = src;
        });
      };

      let logoImg: HTMLImageElement | null = null;
      let storyImg: HTMLImageElement | null = null;

      try {
        logoImg = await loadImageWithTimeout(logo);
      } catch (err) {
        console.warn("Failed to load StorySparkAI logo for PDF", err);
      }

      if (selectedStory.imageURL) {
        try {
          storyImg = await loadImageWithTimeout(selectedStory.imageURL);
        } catch (err) {
          console.warn("Failed to load story banner image for PDF", err);
        }
      }

      // Initialize A4 PDF document (210mm x 297mm)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const title = selectedStory.title || "Untitled Story";
      const content = selectedStory.content || "";
      const tag = (selectedStory.tag || "STORY").toUpperCase();

      const leftMargin = 20;
      const rightMargin = 20;
      const topMargin = 20;
      const bottomMargin = 20;
      const printableWidth = 210 - leftMargin - rightMargin; // 170 mm
      const maxY = 297 - bottomMargin - 10; // Bottom boundary (267mm) leaving room for footer

      let yCursor = topMargin;

      // 1. Header (Logo & Sub-header)
      if (logoImg) {
        const logoHeight = 8;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        doc.addImage(logoImg, "PNG", leftMargin, yCursor, logoWidth, logoHeight);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(99, 102, 241); // Brand Indigo
        doc.text("StorySparkAI", leftMargin, yCursor + 6);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text("PREMIUM AI GENERATED STORY", 190, yCursor + 5, { align: "right" });

      yCursor += 10;

      // Header Divider Line
      doc.setDrawColor(99, 102, 241); // Brand Indigo
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 8;

      // 2. Story Banner Image (only on Page 1)
      if (storyImg) {
        const bannerHeight = 55;
        doc.addImage(storyImg, "JPEG", leftMargin, yCursor, printableWidth, bannerHeight);
        yCursor += bannerHeight + 8;
      }

      // 3. Story Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // Slate 800
      const splitTitle = doc.splitTextToSize(title, printableWidth);
      splitTitle.forEach((line: string) => {
        doc.text(line, leftMargin, yCursor);
        yCursor += 9;
      });

      yCursor += 1;

      // 4. Meta Row (Generated Date & Genre Pill Badge)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate 500
      const formattedDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated on ${formattedDate}`, leftMargin, yCursor);

      // Genre pill badge on the right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const tagWidth = doc.getTextWidth(tag);
      const chipWidth = tagWidth + 5;
      const chipHeight = 5;
      const chipX = 190 - chipWidth;
      const chipY = yCursor - 3.8;

      doc.setFillColor(99, 102, 241); // Brand Indigo background
      doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 1, 1, "F");

      doc.setTextColor(255, 255, 255); // White text inside pill
      doc.text(tag, chipX + 2.5, chipY + 3.5);

      yCursor += 4.5;

      // Meta row bottom line
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.2);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 10;

      // 5. Story Paragraphs Flowing
      const paragraphs = content.split(/\n+/);
      const lineHeight = 6.5;
      const paragraphSpacing = 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // Slate 800

      paragraphs.forEach((para: string, pIdx: number) => {
        const cleanPara = para.trim();
        if (!cleanPara) return;

        const lines = doc.splitTextToSize(cleanPara, printableWidth);
        lines.forEach((line: string) => {
          if (yCursor > maxY) {
            doc.addPage();
            yCursor = 30; // Top padding for subsequent pages
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59); // Slate 800
          doc.text(line, leftMargin, yCursor);
          yCursor += lineHeight;
        });

        if (pIdx < paragraphs.length - 1) {
          yCursor += paragraphSpacing;
        }
      });

      // 6. Running Header and Footer generation
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.25);
        doc.line(leftMargin, 280, 190, 280);

        // Footer Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text("Generated with StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });

        // Header on pages 2+
        if (i > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(99, 102, 241); // Brand Indigo
          doc.text("StorySparkAI", leftMargin, 14);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184); // Slate 400
          const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
          doc.text(headerTitle, 190, 14, { align: "right" });

          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.2);
          doc.line(leftMargin, 17, 190, 17);
        }
      }

      const safeTitle = getSafeFileName(title, "pdf");
      doc.save(safeTitle);
      // Save PDF with sanitized name
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`${safeTitle}.pdf`);
      toast.dismiss(toastId);
      toast.success("Premium PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const getSafeFileName = (title: string, ext: string) => {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${cleanTitle || "story"}.${ext}`;
};

const handleExportMarkdown = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) {toast.error("Story content is empty. Cannot export.");return;}
    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${tag.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName = getSafeFileName(title, "md");
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Markdown downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Markdown.");
    }
  };

  const handleExportDOCX = async () => {
    if (!selectedStory) {
      toast.error("No story available to export.");
      return;
    }
    const toastId = toast.loading("Preparing your DOCX file...");
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
            new Paragraph({ children: [new TextRun({ text: `Author: ${authorName}`, size: 24 })] }),
            new Paragraph({ children: [new TextRun({ text: `Date: ${isoDate}`, size: 24 })] }),
            new Paragraph({ text: "" }),
            ...content.split(/\n+/).filter(para => para.trim() !== "").map(para => new Paragraph({
              children: [new TextRun({ text: para.trim(), size: 24 })],
              spacing: { after: 200 }
            }))
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", getSafeFileName(title, "docx"));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("DOCX downloaded!");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to export DOCX.");
    }
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) { console.error(error); toast.error("Failed to export Markdown."); }
  };

  const handelPublishStory = async () => {
    if (!isLogin) {
      toast.error("Please login to publish the story.");
      return;
    }
    if (!selectedStory) {
      toast.error("No story available. Please generate a story first.");
      return;
    }
    if (selectTopics.length < 2) {
      toast.error("Please select at least 2 topics.");
      return;
    }
    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
    };
    setLoading(true);
    try {
      if (savedPostIdRef.current) {
        try {
          await deletePost(savedPostIdRef.current).unwrap();
        } catch (deleteError) {
          console.warn("Failed to delete auto-saved draft before publishing:", deleteError);
        }
      }
      const result = await createPost(post).unwrap();
      if (result) {
        toast.success("Story published successfully!");
        setStories([]);
        setSelectedStory(null);
        onPublishSuccess?.();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStoryVisuals = async () => {
    if (!selectedStory) {
      toast.error("No story available. Please generate a story first.");
      return;
    }

    const toastId = toast.loading("Generating visuals...");
    try {
      const res = await generateStoryVisuals({
        title: selectedStory.title,
        content: selectedStory.content,
        genre: selectedStory.genre,
        language: selectedStory.language,
      }).unwrap();

      if (res?.data?.scenes?.length) {
        setStoryboardScenes(res.data.scenes);
        setStoryboardStyleGuide(res.data.styleGuide);
        setShowStoryVisualizer(true);
        toast.success("Storyboard visuals generated successfully!");
      } else {
        toast.error("No storyboard scenes were returned.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate visuals. Please try again.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;
    clearError();
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

      if (!res || !Array.isArray(res.data)) {
        throw new Error("Unexpected response format from the AI service.");
      }

      setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
      toast.success("Alternate endings generated successfully!");
    } catch (err: any) {
      console.error("[StoriesView Alternate Ending Flow Failure]:", err);
      const errObj = err as Record<string, any>;
      const errorStatus = errObj?.status || errObj?.data?.status;
      setError(
        errorStatus
          ? getErrorMessage(new ApiError(errorStatus, errObj?.data?.message || ""))
          : getErrorMessage(err)
      );
      toast.error("Failed to generate alternate endings.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  const handleApplyEnding = (endingData: { style: string; ending: string; fullStory: string }) => {
    if (!selectedStory) return;
    const updatedStory = {
      ...selectedStory,
      content: endingData.fullStory,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success(`${endingData.style} applied to story!`);
  };

  const handleResetEnding = () => {
    if (!selectedStory) return;
    const originalContent = originalStoryContent[selectedStory.uuid];
    if (!originalContent) return;
    const updatedStory = {
      ...selectedStory,
      content: originalContent,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success("Reverted to original story ending!");
  };

  const calculateReadingTime = (content: string): number => {
    const words = getWordCount(content);
    return Math.max(1, Math.ceil(words / 200));
  };

  const isNarrationActive = narrationState !== "idle";

  const formatReadingStats = (content: string): string => {
    const readingTime = calculateReadingTime(content);
    return `${readingTime} Min Read`;
  };

  if (isGlobalLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <StoryGeneratingAnimation />
      </div>
    );
  }

  if (!stories || !stories.length || !selectedStory) {
    return (
      <div className="w-full text-center text-slate-400 dark:text-slate-500 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-sm font-medium">
          No stories generated yet. Start by entering a prompt ✨
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16 relative overflow-hidden box-border">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Error Banner */}
      {errorMessage && (
        <div className="error-banner mb-6 p-4 bg-amber-500/20 border border-amber-500 rounded-xl text-amber-200 flex justify-between items-center animate-fadeIn relative z-20">
          <div className="flex items-center gap-3">
            <span>⚠️</span>
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs uppercase font-bold tracking-wider hover:text-white px-2 py-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10 w-full box-border">
        
        {/* ── Left Column ── */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 w-full box-border animate-fade-in-up">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 w-full box-border border-b border-slate-200/60 dark:border-white/5 pb-6">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                {selectedStory.title}
              </h1>
              <div className="flex flex-wrap gap-2 select-none">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🎭 {selectedStory.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🌐 {selectedStory.language || "English"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/5 text-slate-600 dark:text-slate-400 border border-slate-700/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  📖 {formatReadingStats(selectedStory.content)}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                    😊 {selectedStory.emotions.join(", ")}

if (isLoading) {
  return (
    <div className="flex items-center justify-center py-20">
      <StoryGeneratingAnimation />
    </div>
  );
}
  if (!selectedStory) {
    return null;
  }

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto pb-10">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
        <div className="col-span-1 lg:col-span-8 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400 mb-2">
                {selectedStory?.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 py-1 px-3 text-xs font-semibold">
                  Γëí╞Æ├ä┬í {selectedStory.tag}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                  Γëí╞Æ├«├ë {selectedStory.language || "English"}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 py-1 px-3 text-xs font-semibold">
                    Γëí╞Æ├┐├¿ {selectedStory.emotions.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Story selector thumbnails */}
            <div className="flex justify-start sm:justify-end shrink-0 select-none mt-4 sm:mt-0">
              <div className="flex -space-x-4">
                {stories.map((story) => (
                  <button
                    key={story.uuid}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 ${
                      selectedStory?.uuid === story.uuid ? "border-blue-500 scale-110 z-10 shadow-md" : "border-white dark:border-slate-800"
                    } hover:scale-110 hover:z-10 transition-all duration-150 focus:outline-none overflow-hidden cursor-pointer`}
                    onClick={() => handelStorySelection(story)}
                    title={story.title}
                  >
                    {story.imageURL ? (
                      <ImageFallback src={story.imageURL} alt={story.title} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <StoryCoverImage title={story.title} tag={story.tag} size="thumb" />
                    )}
                  </button>
                ))}
            <div className="flex justify-start sm:justify-end">
              <div className="flex -space-x-5">
                {stories && stories.length > 0 && (
                  stories.map((story) => (
                    <button
                      key={story.uuid}
                      className={`relative w-16 h-16 rounded-full border-2 ${
                        selectedStory?.uuid === story.uuid
                          ? "border-blue-500 scale-110"
                          : "border-white"
                      } hover:scale-110 transition-transform duration-200 focus:outline-none`}
                      onClick={() => handelStorySelection(story)}
                    >
                      <img
                        src={story.imageURL}
                        alt={story.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Story content card */}
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm w-full box-border text-left relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5 select-none relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Workspace Blueprint</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={handleCopyStory}>
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>
                
                {/* Export Story Dropdown Menu */}
                <div className="relative inline-block text-left" ref={dropdownMenuRef}>
                  <button
                    type="button"
                    disabled={exportState !== "idle"}
                    onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                    className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center gap-2"
                  >
                    {getExportButtonText()} <i className="fa-solid fa-chevron-down text-[10px]" />
                  </button>
                  {isExportDropdownOpen && (
                    <div className="absolute left-0 sm:right-0 mt-2 z-50 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-1 animate-fadeIn">
                      <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 cursor-pointer">
                        <span>📄</span> Premium PDF
                      </button>
                      <button onClick={() => handleExport("epub")} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 cursor-pointer">
                        <span>📘</span> Kindle EPUB
                      </button>
                      <button onClick={handleExportMarkdown} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 cursor-pointer">
                        <span>⬇️</span> Markdown
                      </button>
                      <button onClick={handleExportDOCX} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 cursor-pointer">
                        <span>📝</span> DOCX
                      </button>
                    </div>
                  )}
                </div>

                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowWorldMap(true)}>
                  🗺️ Map
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowRemix(true)}>
                  🔀 Remix
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowTranslator(true)}>
                  🌍 Translate
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white border border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowTrailer(true)}>
                  🎬 Trailer
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white border border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm" onClick={() => setShowContinueModal(true)}>
                  ✦ Continue →
                </button>
                <button type="button" className={`rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 ${loading ? 'opacity-70' : ''}`} onClick={handelPublishStory} disabled={loading}>
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-slate-200 relative z-10">
                Generated Story
              </h3>
              <div className="flex flex-wrap items-center gap-2 relative z-10">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-slate-700 text-slate-200 font-semibold cursor-pointer hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCopyStory}
                  disabled={!selectedStory}
                >
                  {isCopied ? "Γ£ô Copied" : "≡ƒôï Copy"}
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-purple-700 text-slate-200 font-semibold cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportPDF}
                  disabled={!selectedStory}
                >
                  ≡ƒôä Export PDF
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-indigo-700 text-slate-200 font-semibold cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportMarkdown}
                  disabled={!selectedStory}
                >
                  Γ¼ç∩╕Å Export as Markdown
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-violet-700 text-slate-200 font-semibold cursor-pointer hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowWorldMap(true)}
                  disabled={!selectedStory}
                >
                  Γëí╞Æ├╣ΓòæΓê⌐Γòò├à World Map
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-fuchsia-700 text-slate-200 font-semibold cursor-pointer hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowRemix(true)}
                  disabled={!selectedStory}
                >
                  Γëí╞Æ├╢├ç Remix
                </button>
                <button
                  type="button"
                  id="publish-story-btn"
                  className={`rounded-lg px-5 py-2 font-semibold flex items-center space-x-2 cursor-pointer bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading ? "" : "hover:bg-blue-500 hover:shadow-lg active:scale-95"
                  }`}
                  onClick={handelPublishStory}
                  disabled={loading || !selectedStory}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>

            {selectedStory.enhancedPrompt && (
              <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl relative z-10">
                <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                  <i className="fas fa-wand-magic-sparkles"></i> AI Enhanced Prompt
                </h4>
                <p className="text-slate-300 text-sm italic break-words whitespace-pre-wrap">
                  {selectedStory.enhancedPrompt}
                </p>
              </div>
            )}

            <div id="story-content" className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed tracking-wide relative z-10">
              <p className="break-words whitespace-pre-wrap">
                {sentenceSegments.length > 0 ? (
                  sentenceSegments.map((segment: StorySentenceSegment) => {
                    const isActiveSentence = isNarrationActive && narrationWordIndex >= segment.startWordIndex && narrationWordIndex <= segment.endWordIndex;
                    return (
                      <span
                        key={segment.id}
                        className={isActiveSentence ? "rounded-md bg-indigo-500/20 px-0.5 py-0.5 text-indigo-800 dark:text-indigo-100 ring-1 ring-indigo-400/30 transition-all duration-200" : undefined}
                      >
                        {DOMPurify.sanitize(segment.text)}
            <div id="story-content" className="prose prose-invert max-w-none text-slate-300 leading-relaxed tracking-wide relative z-10">
              <p className="break-words whitespace-pre-wrap">
                {sentenceSegments.length > 0 ? (
                  sentenceSegments.map((segment: StorySentenceSegment) => {
                    const isActiveSentence =
                      isNarrationActive &&
                      narrationWordIndex >= segment.startWordIndex &&
                      narrationWordIndex <= segment.endWordIndex;

                    const rawParts = segment.text.split(/(\s+)/);
                    let wordOffset = 0;

                    return (
                      <span
                        key={segment.id}
                        className={isActiveSentence ? "text-slate-100 font-medium transition-colors duration-300" : undefined}
                      >
                        {rawParts.map((part, partIdx) => {
                          if (part === "") return null;
                          if (/^\s+$/.test(part)) {
                            return part;
                          }

                          const absoluteWordIndex = segment.startWordIndex + wordOffset;
                          wordOffset++;

                          const isActiveWord = isNarrationActive && narrationWordIndex === absoluteWordIndex;

                          if (isActiveWord) {
                            return (
                              <span
                                key={partIdx}
                                className="bg-indigo-500/30 text-indigo-300 rounded px-1 transition-all duration-150 active-narrated-word"
                                data-active-word="true"
                              >
                                {part}
                              </span>
                            );
                          }

                          return (
                            <span key={partIdx}>
                              {part}
                            </span>
                          );
                        })}
                      </span>
                    );
                  })
                ) : (
                  DOMPurify.sanitize(selectedStory.content)
                  (() => {
                    const rawParts = selectedStory.content.split(/(\s+)/);
                    let wordOffset = 0;
                    return rawParts.map((part, partIdx) => {
                      if (part === "") return null;
                      if (/^\s+$/.test(part)) {
                        return part;
                      }

                      const absoluteWordIndex = wordOffset;
                      wordOffset++;

                      const isActiveWord = isNarrationActive && narrationWordIndex === absoluteWordIndex;

                      if (isActiveWord) {
                        return (
                          <span
                            key={partIdx}
                            className="bg-indigo-500/30 text-indigo-300 rounded px-1 transition-all duration-150 active-narrated-word"
                            data-active-word="true"
                          >
                            {part}
                          </span>
                        );
                      }

                      return (
                        <span key={partIdx}>
                          {part}
                        </span>
                      );
                    });
                  })()
                )}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 w-full box-border relative z-10">
              <AudioPlayer 
                ref={audioPlayerRef} 
                text={selectedStory.content} 
                title={selectedStory.title} 
                onWordIndexChange={setNarrationWordIndex} 
                onPlaybackStateChange={setNarrationState} 
              />
            </div>
          </div>

          {/* Alternate Endings Section */}
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl sm:rounded-3xl shadow-xl p-6 mt-2 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  Alternate Endings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Explore alternate narrative styles for your story context.
                </p>
              </div>
              {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                <button
                  type="button"
                  onClick={handleResetEnding}
                  className="rounded-lg px-4 py-2 bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700/50 font-semibold text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset to Original
                </button>
              )}
            </div>

            {isGeneratingEndings ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium animate-pulse">
                  Generating alternate endings...
                </p>
              </div>
            ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
              <div>
                <div className="flex border-b border-slate-200 dark:border-slate-700/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
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
                            ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/5"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
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

                {(() => {
                  const currentEndings = endingsCache[selectedStory.uuid] || [];
                  const currentEndingData = currentEndings.find((e) => e.style === activeEndingTab);
                  if (!currentEndingData) return null;
                  
                  const isCurrentlyApplied = selectedStory.content === currentEndingData.fullStory;
                  
                  return (
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {activeEndingTab} Excerpt
                        </h4>
                        <div>
                          {isCurrentlyApplied ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/30 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                              ✓ Active Ending
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyEnding(currentEndingData)}
                              className="rounded-lg px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                            >
                              Apply Ending
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed text-slate-600 dark:text-slate-300 text-sm italic whitespace-pre-wrap">
                          "{currentEndingData.ending}"
                        </div>
                        <details className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-transparent">
                          <summary className="list-none flex items-center justify-between p-4 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer select-none">
                            <span>Preview Full Reconfigured Story</span>
                            <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
                          </summary>
                          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap bg-slate-50/50 dark:bg-transparent">
                            {currentEndingData.fullStory}
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl">
                <button
                  type="button"
                  onClick={handleGenerateAlternateEndings}
                  className="rounded-lg px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  🔮 Generate Alternate Endings
                </button>
                <p className="text-slate-400 text-xs mt-3 text-center max-w-sm px-4">
                  Analyzes the current narrative to synthesize 5 distinct alternate resolutions (Happy, Dark, Plot Twist, Open, and Cliffhanger).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Preview Panel ── */}
        <div className="col-span-1 lg:col-span-4 w-full box-border lg:sticky lg:top-6">
          <div className="mb-4 text-left select-none px-0.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Compilation Preview</h2>
          </div>
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden group w-full box-border text-left">
            <div className="flex flex-col w-full box-border">
              <div className="relative p-3 overflow-hidden text-white w-full box-border" style={{ height: "192px" }}>
                <StoryCoverImage
                  title={selectedStory.title}
                  tag={selectedStory.tag}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
                />
              </div>

              <div className="p-5 sm:p-6 w-full box-border">
                <div className="flex justify-between items-center mb-4 w-full box-border select-none">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="inline-flex items-center rounded-lg bg-purple-500/10 border border-purple-500/10 py-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {selectedStory.tag}
                    </div>
                    <div className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/10 py-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {selectedStory.language || "English"}
                    </div>
                    <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-white/5 py-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 gap-1">
                      ⏱️ {calculateReadingTime(selectedStory.content)} Min Read
                    </div>
                  </div>
                  <div className="shrink-0">
                    <BookmarkButton storyId={selectedStory.uuid} />
                  </div>
                </div>
                <h3 className="mb-2 text-slate-900 dark:text-slate-200 text-lg sm:text-xl font-extrabold tracking-tight leading-snug">{selectedStory.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium break-words text-xs sm:text-sm leading-relaxed m-0">{getShortenedText(selectedStory.content)}</p>
            <div className="relative z-10 mt-6">
              <AudioPlayer
                ref={audioPlayerRef}
                text={selectedStory.content}
                title={selectedStory.title}
                onWordIndexChange={setNarrationWordIndex}
                onPlaybackStateChange={setNarrationState}
              />
            </div>
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
                            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 leading-relaxed text-slate-300 text-sm md:text-base italic shadow-inner whitespace-pre-wrap">
                              <p>{currentEndingData.ending}</p>
                            </div>
                            
                            <div>
                              <details className="group border border-slate-800 rounded-lg overflow-hidden bg-slate-950/20">
                                <summary className="list-none flex items-center justify-between p-3 text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                                  <span>PREVIEW FULL STORY WITH THIS ENDING</span>
                                  <span className="transition-transform duration-200 group-open:rotate-180">Γû╝</span>
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
        </div>

        <div className="col-span-1 lg:col-span-4">
          <GeneratedStoryTimeline
            content={selectedStory.content}
            title={selectedStory.title}
            narrationState={narrationState}
            narrationWordIndex={narrationWordIndex}
          />

          <div className="mb-5">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Preview
            </h1>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden group">
            <div className="relative flex flex-col rounded-lg">
              <div className="relative m-3 overflow-hidden text-white rounded-xl">
                <ImageFallback
                  src={selectedStory.imageURL}
                  alt="card-image"
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-1">
                <div className="flex justify-between items-center mb-2 w-full">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      {selectedStory.tag.toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-indigo-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      Γëí╞Æ├«├ë {(selectedStory.language || "English").toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-700 py-1 px-2.5 text-xs font-medium text-slate-300 shadow-sm gap-1">
                      ╬ô├àΓûÆΓê⌐Γòò├à {calculateReadingTime(selectedStory.content)} min read
                    </div>
                  </div>
                  <div>
                    <BookmarkButton storyId={selectedStory.uuid} />
                  </div>
                </div>
                <h6 className="mb-1 text-gray-300 text-xl font-semibold">
                  {selectedStory.title}
                </h6>
                <p className="text-gray-400 font-light breakwords text-sm sm:text-base">
                  {getShortenedText(selectedStory.content)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWorldMap && selectedStory && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-white font-semibold">Loading Map...</div>}>
          <StoryWorldMap
            story={selectedStory.content}
            title={selectedStory.title}
            onClose={() => setShowWorldMap(false)}
          />
        </Suspense>
      )}

      {showRemix && selectedStory && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-white font-semibold">Loading Remix...</div>}>
          <StoryRemix
            story={selectedStory}
            isLogin={isLogin}
            onRemixComplete={(remixedStory) => {
              setStories([remixedStory, ...stories]);
              setSelectedStory(remixedStory);
              setShowRemix(false);
            }}
            onClose={() => setShowRemix(false)}
          />
        </Suspense>
      )}

      {showStoryVisualizer && storyboardScenes.length > 0 && (
        <StoryVisualizer
          title={selectedStory?.title ?? ""}
          scenes={storyboardScenes}
          styleGuide={storyboardStyleGuide}
          onClose={() => setShowStoryVisualizer(false)}
        />
      )}

      {showTrailer && selectedStory && (
        <StoryTrailer
          title={selectedStory.title}
          content={selectedStory.content}
          tag={selectedStory.tag}
          isLogin={isLogin}
          onClose={() => setShowTrailer(false)}
        />
      )}
      {showContinueModal && selectedStory && (
        <ContinueStoryModal
          story={{
            title: selectedStory.title,
            content: selectedStory.content,
            language: selectedStory.language ?? "English",
          }}
          onClose={() => setShowContinueModal(false)}
        />
      )}
        <StoryWorldMap
          story={selectedStory.content}
          title={selectedStory.title}
          onClose={() => setShowWorldMap(false)}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesViewComponent;