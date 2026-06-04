import React, { useEffect, useState, useRef, useMemo } from "react";
import DOMPurify from "dompurify";
import {
  getShortenedText,
  ITopicData,
  topicsData,
  getWordCount,
  SELECTED_TOPIC_CLASSES,
} from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import toast, { Toaster } from "react-hot-toast";
import {
  useCreatePostMutation,
  useDeletePostMutation,
} from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
import StoryWorldMap from "../story-map/StoryWorldMap";
import StoryRemix from "../remix/StoryRemix";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, {
  type AudioPlayerHandle,
  type NarrationPlaybackState,
} from "../AudioPlayer";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStory } from "../../redux/slices/storySlice";
import ContinueStoryButton from "../story/ContinueStoryButton";
import StoryTradingCard from "../cards/StoryTradingCard";
import CardCollection from "../cards/CardCollection";
import StoryCoverImage from "./StoryCoverImage";
import ImageFallback from "../ImageFallback";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import StoryVisualizer from "../story-visualizer/StoryVisualizer";
import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
import { useNavigate } from "react-router-dom";

// ─── API Error Class ──────────────────────────────────────────────────────────

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

// ─── Genre Themes ─────────────────────────────────────────────────────────────

const GENRE_THEMES: Record<
  string,
  { gradient: string; accent: string; icon: string }
> = {
  fantasy: {
    gradient: "135deg, #667eea 0%, #764ba2 50%, #f093fb 100%",
    accent: "#c084fc",
    icon: "✦",
  },
  romance: {
    gradient: "135deg, #f857a6 0%, #ff5858 50%, #ffb347 100%",
    accent: "#fb7185",
    icon: "♡",
  },
  horror: {
    gradient: "135deg, #0f0c29 0%, #302b63 50%, #24243e 100%",
    accent: "#a855f7",
    icon: "☽",
  },
  thriller: {
    gradient: "135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%",
    accent: "#38bdf8",
    icon: "◈",
  },
  mystery: {
    gradient: "135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%",
    accent: "#60a5fa",
    icon: "◎",
  },
  adventure: {
    gradient: "135deg, #f7971e 0%, #ffd200 50%, #21d4fd 100%",
    accent: "#fbbf24",
    icon: "⊕",
  },
  scifi: {
    gradient: "135deg, #0f2027 0%, #203a43 50%, #2c5364 100%",
    accent: "#22d3ee",
    icon: "◇",
  },
  "sci-fi": {
    gradient: "135deg, #0f2027 0%, #203a43 50%, #2c5364 100%",
    accent: "#22d3ee",
    icon: "◇",
  },
  comedy: {
    gradient: "135deg, #fddb92 0%, #d1fdff 50%, #f5af19 100%",
    accent: "#f59e0b",
    icon: "◉",
  },
  drama: {
    gradient: "135deg, #8e2de2 0%, #4a00e0 50%, #3b82f6 100%",
    accent: "#a78bfa",
    icon: "✧",
  },
  historical: {
    gradient: "135deg, #b79891 0%, #94716b 50%, #6b4226 100%",
    accent: "#d4a574",
    icon: "⬡",
  },
  default: {
    gradient: "135deg, #667eea 0%, #764ba2 50%, #4facfe 100%",
    accent: "#a78bfa",
    icon: "✦",
  },
};

function getGenreTheme(tag?: string) {
  const key = (tag || "default").toLowerCase().trim();
  return GENRE_THEMES[key] ?? GENRE_THEMES.default;
}

function getInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ─── StoryCoverImage Props ────────────────────────────────────────────────────

interface StoryCoverImageProps {
  title?: string;
  tag?: string;
  imageUrl?: string;
  size?: "full" | "thumb";
  className?: string;
  style?: React.CSSProperties;
}

// ─── Inline StoryCoverImage ───────────────────────────────────────────────────

const StoryCoverImageInline: React.FC<StoryCoverImageProps> = ({
  title = "",
  tag = "default",
  imageUrl,
  size = "full",
  className = "",
  style = {},
}) => {
  const theme = getGenreTheme(tag);
  const initials = getInitials(title);
  const defaultPlaceholder =
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80";
  const finalImageSrc =
    imageUrl && imageUrl.trim() !== "" && !imageUrl.includes("placeholder.com")
      ? imageUrl
      : defaultPlaceholder;

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
        backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${finalImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "inherit",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-15%",
          width: "60%",
          height: "120%",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "45%",
          height: "80%",
          background: "rgba(0,0,0,0.12)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "16px",
          fontSize: "3.5rem",
          color: theme.accent,
          opacity: 0.35,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          fontWeight: 300,
        }}
      >
        {theme.icon}
      </div>
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: "999px",
          border: `1px solid ${theme.accent}55`,
          userSelect: "none",
        }}
      >
        {tag}
      </div>
      {!imageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "5rem",
              fontWeight: 900,
              color: "rgba(255,255,255,0.12)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {initials}
          </div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
          padding: "40px 14px 14px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 700,
            lineHeight: 1.3,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
  enhancedPrompt?: string;
  emotions?: string[];
}

interface IPost extends IStories {
  topic: ITopicData[];
  isPublished?: boolean;
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: React.Dispatch<React.SetStateAction<IStories[]>>;
  isLoading?: boolean;
  onPublishSuccess?: () => void;
}

interface IRelatedStoriesComponentProps {
  posts: { _id: string; title: string; [key: string]: unknown }[];
  currentPostId: string;
}

// ─── Sentence Segment Types & Builder ────────────────────────────────────────

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

// ─── Export Helpers ───────────────────────────────────────────────────────────

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
<html>
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

// ─── Modal Type Adapters ──────────────────────────────────────────────────────

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

// ─── Related Stories Component ────────────────────────────────────────────────

export const RelatedStoriesComponent: React.FC<
  IRelatedStoriesComponentProps
> = ({ posts, currentPostId }) => {
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post) => post._id !== currentPostId);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-slate-200 mb-4">
        Related Content
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/stories/${post._id}`)}
              className="p-4 bg-slate-700/40 rounded-xl border border-slate-600/30 cursor-pointer hover:bg-slate-700/60 transition-colors"
            >
              <p className="text-sm font-semibold text-white truncate">
                {post.title}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 col-span-2 py-8">
            No related stories found.
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const StoriesComponent: React.FC<StoriesComponentProps> = ({
  stories,
  setStories,
  isLoading,
  isLogin,
  onPublishSuccess,
}) => {
  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const dispatch = useDispatch();

  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showRemix, setShowRemix] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);

  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{
    [uuid: string]: string;
  }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] =
    useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] =
    useState<string>("Happy Ending");
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] =
    useState<NarrationPlaybackState>("idle");
  const [readingStreak, setReadingStreak] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);

  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, {
    skip: !isLogin,
  });
  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] =
    useGenerateFreeAlternateEndingsMutation();

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    const player = audioPlayerRef.current;
    return () => {
      player?.stop();
    };
  }, [location.pathname]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  // Reading streak tracker
  useEffect(() => {
    if (!selectedStory) return;

    const today = new Date().toDateString();
    const lastReadDate = localStorage.getItem("lastReadDate");
    const streak = Number(localStorage.getItem("readingStreak") || "0");

    if (lastReadDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let newStreak = 1;
      if (lastReadDate === yesterday.toDateString()) {
        newStreak = streak + 1;
      }
      localStorage.setItem("readingStreak", String(newStreak));
      localStorage.setItem("lastReadDate", today);
      setReadingStreak(newStreak);
    } else {
      setReadingStreak(streak);
    }
  }, [selectedStory]);

  // Sync selected story whenever a new batch arrives
  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
      dispatch(
        setStory({
          id: stories[0].uuid,
          title: stories[0].title,
          chapters: [
            {
              id: 1,
              title: "Chapter 1",
              content: stories[0].content,
              createdAt: new Date().toISOString(),
            },
          ],
        })
      );
    } else {
      setSelectedStory(null);
    }
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
  }, [stories, dispatch]);

  // Auto-save draft
  useEffect(() => {
    const autoSaveStory = async () => {
      if (!isLogin || !selectedStory) return;
      if (selectedStory.content === lastSavedContentRef.current) return;
      if (hasSavedSessionRef.current) return;
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      const post: IPost = { ...selectedStory, topic: selectTopics };

      try {
        const result = await createPost(post).unwrap();
        if (result && result.data && result.data._id) {
          savedPostIdRef.current = result.data._id;
        }
        lastSavedContentRef.current = selectedStory.content;
        hasSavedSessionRef.current = true;
        toast.success("Story auto-saved!");
      } catch (err) {
        console.error("Auto-save failed", err);
      } finally {
        isSavingRef.current = false;
      }
    };

    const timer = setTimeout(() => {
      autoSaveStory();
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost]);

  // Stop speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Memos ──────────────────────────────────────────────────────────────────

  const sentenceSegments = useMemo(
    () => buildSentenceSegments(selectedStory?.content ?? ""),
    [selectedStory?.content]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic, topicIndex) =>
        topicIndex === index ? { ...topic, selected: !topic.selected } : topic
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
      (topic) =>
        topic.title.toLowerCase() === normalizedTitle.toLowerCase()
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
    if (!selectedStory?.content) return;
    await navigator.clipboard.writeText(selectedStory.content);
    setIsCopied(true);
    toast.success("Story copied!");
    window.setTimeout(() => setIsCopied(false), 2000);
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
      setEndingsCache((prev) => ({
        ...prev,
        [selectedStory.uuid]: res.data,
      }));
      toast.success("Alternate endings generated successfully!");
    } catch (err: unknown) {
      console.error("[StoriesView Alternate Ending Flow Failure]:", err);
      const errObj = err as Record<string, unknown>;
      const errorStatus =
        (errObj?.status as number | undefined) ||
        ((errObj?.data as Record<string, unknown>)?.status as
          | number
          | undefined);
      setError(
        errorStatus
          ? getErrorMessage(
              new ApiError(
                errorStatus,
                ((errObj?.data as Record<string, unknown>)?.message as string) || ""
              )
            )
          : getErrorMessage(err)
      );
      toast.error("Failed to generate alternate endings.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  const handleApplyEnding = (endingData: {
    style: string;
    ending: string;
    fullStory: string;
  }) => {
    if (!selectedStory) return;
    const updatedStory = { ...selectedStory, content: endingData.fullStory };
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
    const updatedStory = { ...selectedStory, content: originalContent };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success("Reverted to original story ending!");
  };

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
      const englishVoice =
        voices.find(
          (v) => v.lang.startsWith("en-") && v.name.includes("Google")
        ) || voices.find((v) => v.lang.startsWith("en-"));
      if (englishVoice) utterance.voice = englishVoice;

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      toast.success("Playing story audio");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStopAudio = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    toast.success("Stopped audio playback");
  };

  const handleExportPDF = async () => {
    if (!selectedStory) {
      toast.error("No story available to export.");
      return;
    }
    if (!selectedStory.content?.trim()) {
      toast.error("Story content is empty. Cannot export.");
      return;
    }
    const toastId = toast.loading("Preparing your premium PDF...");
    try {
      const loadImageWithTimeout = (
        src: string,
        timeoutMs = 3000
      ): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const timeout = setTimeout(() => {
            img.src = "";
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

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const title = selectedStory.title || "Untitled Story";
      const content = selectedStory.content || "";
      const tag = (selectedStory.tag || "STORY").toUpperCase();
      const leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20;
      const printableWidth = 210 - leftMargin - rightMargin;
      const maxY = 297 - bottomMargin - 10;
      let yCursor = topMargin;

      // Header
      if (logoImg) {
        const logoHeight = 8;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        doc.addImage(logoImg, "PNG", leftMargin, yCursor, logoWidth, logoHeight);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(99, 102, 241);
        doc.text("StorySparkAI", leftMargin, yCursor + 6);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("PREMIUM AI GENERATED STORY", 190, yCursor + 5, { align: "right" });
      yCursor += 10;
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 8;

      // Story banner image
      if (storyImg) {
        const bannerHeight = 55;
        doc.addImage(storyImg, "JPEG", leftMargin, yCursor, printableWidth, bannerHeight);
        yCursor += bannerHeight + 8;
      }

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      const splitTitle = doc.splitTextToSize(title, printableWidth);
      splitTitle.forEach((line: string) => {
        doc.text(line, leftMargin, yCursor);
        yCursor += 9;
      });
      yCursor += 1;

      // Meta row
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const formattedDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated on ${formattedDate}`, leftMargin, yCursor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const tagWidth = doc.getTextWidth(tag);
      const chipWidth = tagWidth + 5, chipHeight = 5;
      const chipX = 190 - chipWidth, chipY = yCursor - 3.8;
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(tag, chipX + 2.5, chipY + 3.5);
      yCursor += 4.5;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 10;

      // Paragraphs
      const paragraphs = content.split(/\n+/);
      const lineHeight = 6.5, paragraphSpacing = 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      paragraphs.forEach((para: string, pIdx: number) => {
        const cleanPara = para.trim();
        if (!cleanPara) return;
        const lines = doc.splitTextToSize(cleanPara, printableWidth);
        lines.forEach((line: string) => {
          if (yCursor > maxY) { doc.addPage(); yCursor = 30; }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59);
          doc.text(line, leftMargin, yCursor);
          yCursor += lineHeight;
        });
        if (pIdx < paragraphs.length - 1) yCursor += paragraphSpacing;
      });

      // Running header/footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.25);
        doc.line(leftMargin, 280, 190, 280);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Generated with StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
        if (i > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(99, 102, 241);
          doc.text("StorySparkAI", leftMargin, 14);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
          doc.text(headerTitle, 190, 14, { align: "right" });
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.2);
          doc.line(leftMargin, 17, 190, 17);
        }
      }

      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`${safeTitle}.pdf`);
      toast.dismiss(toastId);
      toast.success("Premium PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) { toast.error("Story content is empty. Cannot export."); return; }
    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName =
        isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${tag.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], {
        type: "text/markdown;charset=utf-8;",
      });
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Markdown.");
    }
  };

  const handleExportDOCX = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) { toast.error("Story content is empty. Cannot export."); return; }
    try {
      const title = selectedStory.title || "Untitled Story";
      const docxBlob = createDocxBlob({
        title,
        content: selectedStory.content || "",
        tag: selectedStory.tag || "Story",
        author: isLogin && profile?.name ? profile.name : "Anonymous",
      });
      downloadBlob(docxBlob, getSafeFileName(title, "docx"));
      toast.success("DOCX downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export DOCX.");
    }
  };

  const handelPublishStory = async () => {
    if (!isLogin) { toast.error("Please login to publish the story."); return; }
    if (!selectedStory) { toast.error("No story available. Please generate a story first."); return; }
    if (selectTopics.length < 2) { toast.error("Please select at least 2 topics."); return; }

    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
      isPublished: true,
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

  const calculateReadingTime = (content: string): number =>
    Math.max(1, Math.ceil(getWordCount(content) / 200));

  const isNarrationActive = narrationState !== "idle";

  // ── Early Returns ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <StoryGeneratingAnimation />
      </div>
    );
  }

  if (!stories || !stories.length) {
    return (
      <div className="w-full text-center text-slate-400 dark:text-slate-500 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-sm font-medium">
          No stories generated yet. Start by entering a prompt ✨
        </div>
      </div>
    );
  }

  if (!selectedStory) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto pb-10">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex justify-between items-center">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="ml-4 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">

        {/* ── Left Column: Story Content ── */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 w-full">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-white/5 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                {selectedStory.title}
              </h1>
              <div className="flex flex-wrap gap-2 select-none">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🎭 {selectedStory.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🌐 {selectedStory.language || "English"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/5 py-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shadow-sm">
                  📖 {formatReadingStats(selectedStory.content)}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                    😊 {selectedStory.emotions.join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Story selector thumbnails */}
            <div className="flex justify-start sm:justify-end shrink-0 select-none">
              <div className="flex -space-x-4">
                {stories.map((story) => (
                  <button
                    key={story.uuid}
                    type="button"
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 ${
                      selectedStory.uuid === story.uuid
                        ? "border-blue-600 scale-110 z-10 shadow-md"
                        : "border-white dark:border-slate-800"
                    } hover:scale-110 hover:z-10 transition-all duration-150 focus:outline-none overflow-hidden cursor-pointer`}
                    onClick={() => handelStorySelection(story)}
                    title={story.title}
                  >
                    <StoryCoverImageInline
                      title={story.title}
                      tag={story.tag}
                      imageUrl={story.imageURL}
                      size="thumb"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story content card */}
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm w-full text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5 select-none">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Generated Story
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={handleCopyStory} disabled={!selectedStory}>
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={handleExportPDF} disabled={!selectedStory}>
                  📄 PDF
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={handleExportMarkdown} disabled={!selectedStory}>
                  ⬇️ Markdown
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={handleExportDOCX} disabled={!selectedStory}>
                  📝 Word
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowWorldMap(true)} disabled={!selectedStory}>
                  🗺️ Map
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowRemix(true)} disabled={!selectedStory}>
                  🔀 Remix
                </button>
                <button type="button" className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer" onClick={() => setShowTranslator(true)} disabled={!selectedStory}>
                  🌍 Translate
                </button>
                <button
                  type="button"
                  id="publish-story-btn"
                  className={`rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 ${loading ? "" : "hover:shadow-lg"}`}
                  onClick={handelPublishStory}
                  disabled={loading || !selectedStory}
                >
                  {loading ? "Publishing..." : "🚀 Publish"}
                </button>
              </div>
            </div>

            {/* Enhanced prompt */}
            {selectedStory.enhancedPrompt && (
              <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-2 select-none">
                  <i className="fas fa-wand-magic-sparkles" /> AI Enhanced Prompt
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm italic break-words whitespace-pre-wrap m-0 leading-relaxed font-medium">
                  {selectedStory.enhancedPrompt}
                </p>
              </div>
            )}

            {/* Story body with word-level narration highlighting */}
            <div
              id="story-content"
              className="w-full text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed tracking-wide font-medium"
            >
              <p className="break-words whitespace-pre-wrap m-0">
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
                        className={
                          isActiveSentence
                            ? "rounded-lg bg-blue-500/10 dark:bg-blue-500/20 px-1 py-0.5 text-slate-900 dark:text-white font-semibold transition-all"
                            : undefined
                        }
                      >
                        {rawParts.map((part, partIdx) => {
                          if (part === "") return null;
                          if (/^\s+$/.test(part)) return part;
                          const absoluteWordIndex =
                            segment.startWordIndex + wordOffset;
                          wordOffset++;
                          const isActiveWord =
                            isNarrationActive &&
                            narrationWordIndex === absoluteWordIndex;
                          if (isActiveWord) {
                            return (
                              <span
                                key={partIdx}
                                className="bg-indigo-500/20 text-indigo-300 rounded px-0.5 transition-all duration-150"
                              >
                                {part}
                              </span>
                            );
                          }
                          return <span key={partIdx}>{part}</span>;
                        })}
                      </span>
                    );
                  })
                ) : (
                  DOMPurify.sanitize(selectedStory.content)
                )}
              </p>
            </div>

            {/* Audio player */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              <AudioPlayer
                ref={audioPlayerRef}
                text={selectedStory.content}
                title={selectedStory.title}
                onWordIndexChange={setNarrationWordIndex}
                onPlaybackStateChange={setNarrationState}
              />
            </div>

            {/* Continue story */}
            <div className="mt-4">
              <ContinueStoryButton />
            </div>
          </div>

          {/* Topics section */}
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm w-full text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 select-none">
              Select Topics
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-5 select-none">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="Add related topic"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950/60 px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500/40 focus:outline-none transition-colors"
              />
              <button
                type="button"
                className="rounded-xl px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors active:scale-[0.98] cursor-pointer"
                onClick={handleAddTopic}
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedStory ? (
                topics.map((topic, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 ${topic.className} rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border border-slate-100 dark:border-transparent select-none`}
                  >
                    <button
                      type="button"
                      className="cursor-pointer font-bold uppercase flex items-center gap-1.5"
                      onClick={() => handleTopicClick(index)}
                    >
                      {topic.selected ? (
                        <i className="fa-solid fa-check" />
                      ) : (
                        <i className="fa-solid fa-plus" />
                      )}
                      {topic.title}
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer border-l border-current/20 pl-2 opacity-50 hover:opacity-100 disabled:cursor-not-allowed"
                      onClick={() => handleRemoveTopic(index)}
                      disabled={topics.length <= 2}
                      aria-label={`Remove ${topic.title}`}
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 m-0">
                  No topics available. Please generate a story first.
                </p>
              )}
            </div>
          </div>

          {/* Alternate endings section */}
          {selectedStory && (
            <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm w-full text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 select-none">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Alternate Endings
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
                    Explore alternate narrative styles for your story context.
                  </p>
                </div>
                {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                  <button
                    type="button"
                    onClick={handleResetEnding}
                    className="w-full sm:w-auto rounded-xl px-3.5 py-2 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-rotate-left" /> Revert to Original
                  </button>
                )}
              </div>

              {isGeneratingEndings ? (
                <div className="flex flex-col items-center justify-center py-12 select-none">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-blue-600 dark:border-white/10 dark:border-t-white mb-4" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
                    Generating alternate endings...
                  </p>
                </div>
              ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
                <div>
                  <div className="flex border-b border-slate-100 dark:border-white/5 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
                    {["Happy Ending", "Dark Ending", "Plot Twist Ending", "Open Ending", "Cliffhanger Ending"].map(
                      (name) => {
                        const endingData = (endingsCache[selectedStory.uuid] || []).find(
                          (e) => e.style === name
                        );
                        const isApplied =
                          endingData &&
                          selectedStory.content === endingData.fullStory;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => setActiveEndingTab(name)}
                            className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                              activeEndingTab === name
                                ? "border-blue-600 text-blue-600 dark:border-white dark:text-white bg-slate-50 dark:bg-white/5 rounded-t-xl"
                                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                          >
                            <span>{name}</span>
                            {isApplied && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                  {(() => {
                    const currentEndingData = (
                      endingsCache[selectedStory.uuid] || []
                    ).find((e) => e.style === activeEndingTab);
                    if (!currentEndingData) return null;
                    const isCurrentlyApplied =
                      selectedStory.content === currentEndingData.fullStory;
                    return (
                      <div className="bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-5 border border-slate-200/60 dark:border-white/5">
                        <div className="flex justify-between items-center mb-4 select-none">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {activeEndingTab} Excerpt
                          </h4>
                          {isCurrentlyApplied ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                              <i className="fa-solid fa-circle-check" /> Applied
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyEnding(currentEndingData)}
                              className="rounded-xl px-3.5 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                            >
                              Apply Branch
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-[#111827]/40 p-4 rounded-xl border border-slate-200/80 dark:border-white/5 leading-relaxed text-slate-600 dark:text-slate-300 text-xs sm:text-sm italic shadow-inner whitespace-pre-wrap text-left font-medium">
                            <p className="m-0">"{currentEndingData.ending}"</p>
                          </div>
                          <details className="group border border-slate-200/80 dark:border-white/5 rounded-xl overflow-hidden bg-white dark:bg-transparent">
                            <summary className="list-none flex items-center justify-between p-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer select-none">
                              <span>Preview Full Story With This Ending</span>
                              <span className="transition-transform duration-150 group-open:rotate-180 text-[8px]">▼</span>
                            </summary>
                            <div className="p-4 border-t border-slate-200/60 dark:border-white/5 text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap text-left font-medium bg-slate-50/30 dark:bg-transparent">
                              {currentEndingData.fullStory}
                            </div>
                          </details>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/5 rounded-xl select-none">
                  <button
                    type="button"
                    onClick={handleGenerateAlternateEndings}
                    className="rounded-xl px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 transition-all duration-150 hover:scale-105 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-shuffle text-xs" /> Generate Alternate Endings
                  </button>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-3.5 text-center max-w-sm px-4">
                    Uses the story context to produce 5 unique ending variations (Happy, Dark,
                    Plot Twist, Open, Cliffhanger) for comparison.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Column: Preview Panel ── */}
        <div className="col-span-1 lg:col-span-4 w-full lg:sticky lg:top-6">
          <div className="mb-4 text-left select-none px-0.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Preview
            </h2>
          </div>
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden group w-full text-left">
            <div className="flex flex-col">
              <div className="relative p-3 overflow-hidden text-white" style={{ height: "192px" }}>
                <StoryCoverImageInline
                  title={selectedStory.title}
                  tag={selectedStory.tag}
                  imageUrl={selectedStory.imageURL}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-center mb-4 select-none">
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
                <h3 className="mb-2 text-slate-900 dark:text-slate-200 text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                  {selectedStory.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium break-words text-xs sm:text-sm leading-relaxed m-0">
                  {getShortenedText(selectedStory.content)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showWorldMap && selectedStory && (
        <StoryWorldMapModal
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
            setStories(
              stories.map((s) =>
                s.uuid === selectedStory.uuid ? updatedStory : s
              )
            );
            setShowRemix(false);
          }}
        />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesComponent;