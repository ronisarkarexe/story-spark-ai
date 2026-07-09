import React, { useEffect, useState, useRef, useMemo, Suspense } from "react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  getShortenedText,
  ITopicData,
  topicsData,
  getWordCount,
  SELECTED_TOPIC_CLASSES,
} from "./stories.utils";
import { calculateReadingTime } from "../../utils/reading-time";
import { formatReadingStats } from "../../utils/story-utils";
import CharacterProfileCard from "./CharacterProfileCard";
import StoryGenreTransformation from "./StoryGenreTransformation";
import StoryVersionHistory from "./StoryVersionHistory";
import { CharacterProfile, getShortenedText, ITopicData, topicsData, getWordCount } from "./stories.utils";
import { CharacterProfile, getShortenedText, ITopicData, topicsData } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
/*
import {
  fetchImageAsBlob,
  blobToBase64,
  exportStoryToPDF,
  exportStoryToEPUB
} from "../../services/export.service";
*/
import StoryTrailer from "../trailer/StoryTrailer";
import BookmarkButton from "../BookmarkButton";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useNavigate } from "react-router-dom";
import { useApiError } from "../../hooks/useApiError";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";

// import StoryVisualizer from "../story-visualizer/StoryVisualizer";
import ContinueStoryModal from "./ContinueStoryModal";
// import { useGenerateStoryVisualsMutation } from "../../redux/apis/story.visualizer.api";

import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
import EmptyStoriesState from "./EmptyStoriesState";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

import StoryTranslator from "./translate/StoryTranslator";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation } from "../../redux/apis/post.api";
import jsPDF from "jspdf";
import StoryTranslator from "../translate/StoryTranslator";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation } from "react-router-dom";

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
  genre?: string;
  scientificWarnings?: {
    detectedIssue: string;
    explanation: string;
    suggestedCorrection: string;
  }[];
  enhancedPrompt?: string;

  genre?: string;
  language?: string;
}

export type StorySentenceSegment = {
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

interface IPost extends IStories {
  topic: ITopicData[];
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
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

/*
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
};
*/

export interface IRelatedStoriesComponentProps {
  posts: {
    _id: string;
    title: string;
  }[];
  currentPostId: string;
}

export const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({ posts, currentPostId }) => {
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post: { _id: string; title: string }) => post._id !== currentPostId);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-slate-200 mb-4">Related Content</h4>
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post: { _id: string; title: string }) => (
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
};



const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
}) => {
  // const location = useLocation();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const storyScrollContainerRef = useRef<HTMLDivElement>(null);
  /*
  const {
    isPlaying: isAntiGravityPlaying,
    setIsPlaying: setIsAntiGravityPlaying,
    targetSpeed: antiGravitySpeed,
    setTargetSpeed: setAntiGravitySpeed,
  } = useAntiGravityScroll(storyScrollContainerRef);
  */

  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // States
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Export states
  // const [exportState, setExportState] = useState<"idle" | "processing" | "compiling" | "success" | "error">("idle");
  // const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);
  // const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const [selectedStory, setSelectedStory] = useState<IStories | null>(
    stories && stories[0]
  );
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // Modals
  const [showContinueModal, setShowContinueModal] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showRemix, setShowRemix] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  // const [showStoryVisualizer, setShowStoryVisualizer] = useState<boolean>(false);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [showGenreTransformation, setShowGenreTransformation] = useState<boolean>(false);
  
  // StoryVisualizer states
  // const [storyboardScenes, setStoryboardScenes] = useState<StoryboardScene[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  // const [storyboardStyleGuide, setStoryboardStyleGuide] = useState<string>(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const [characterProfiles, setCharacterProfiles] = useState<CharacterProfile[]>([]);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const [createPost] = useCreatePostMutation();
  useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const lastSavedContentRef = useRef<string>("");
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
  // const [generateStoryVisuals, { isLoading: isGeneratingVisuals }] = useGenerateStoryVisualsMutation();
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
    } catch (err: unknown) {
      console.error("[StoriesView Alternate Ending Flow Failure]:", err);
      const errObj = err as Record<string, unknown>;
      const errorStatus = (errObj?.status || (errObj?.data as Record<string, unknown>)?.status) as number | undefined;
      setError(
        errorStatus
          ? getErrorMessage(new ApiError(errorStatus, ((errObj?.data as Record<string, unknown>)?.message as string) || ""))
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



  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  const isNarrationActive = narrationState !== "idle";

  useEffect(() => {
    return () => {
      audioPlayerRef.current?.stop();
    };
  }, [location.pathname]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  // Sync state instantly whenever a new template is submitted or selected
  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    }
    // Reset auto-save status for new story session
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
    setTopics(topicsData);
  }, [stories]);

useEffect(() => {
  const autoSaveStory = async () => {
    if (!selectedStory || !isLogin) return;

    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
    };

    try {
      await createPost(post).unwrap();
      toast.success("Story auto-saved!");
    } catch (error) {
      console.error("Auto-save failed", error);
    }
  };

  autoSaveStory();
}, [selectedStory, isLogin, selectTopics, createPost]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleRestoreVersion = (restoredContent: string) => {
    if (!selectedStory) return;

    const updatedStory = {
      ...selectedStory,
      content: restoredContent,
    };

    setSelectedStory(updatedStory);

    setStories(
      stories.map((story) =>
        story.uuid === selectedStory.uuid
          ? updatedStory
          : story
      )
    );

    toast.success("Story version restored successfully!");
  };



  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      await navigator.clipboard.writeText(selectedStory.content);
      setIsCopied(true);
      toast.success("Story copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleTopicClick = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics[index].selected = !updatedTopics[index].selected;
    setTopics(updatedTopics);
  };

const handleExportPDF = () => {
  if (!selectedStory) {
    toast.error("No story available to export.");
    return;
  }

  try {
    const doc = new jsPDF();

    const title = selectedStory.title || "Story";
    const content = selectedStory.content || "";

    doc.setFontSize(18);
    doc.text(title, 15, 20);

    doc.setFontSize(12);

    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 15, 35);

    doc.save(`${title}.pdf`);

    toast.success("PDF downloaded!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to export PDF.");
  }
};

const handleGenerateCharacterProfile = async () => {
  if (!selectedStory) {
    toast.error("No story selected!");
    return;
  }

  setProfileLoading(true);

  try {
    // Replace with your backend API endpoint
    const response = await fetch(
      "/api/generate-character-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story: selectedStory.content,
        }),
      }
    );

    const data = await response.json();

    setCharacterProfiles(data.data);

    toast.success("Character profiles generated!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to generate profiles.");
  } finally {
    setProfileLoading(false);
  }
};

  /*
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  */





  const handelPublishStory = async () => {
    if (!isLogin) {
      toast.error("Please login to publish the story.");
      return;
    }
    if (!selectedStory) {
      toast.error("No story available. Please generate a story first.");
      return;
    }
    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
    };
    setLoading(true);
    try {
      const result = await createPost(post).unwrap();
      if (result) {
        toast.success("Story published successfully!");
        setStories([]);
        setSelectedStory(null);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
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
  */

  const calculateReadingTime = (content: string): number => {
    const words = getWordCount(content);
    return Math.max(1, Math.ceil(words / 200));
  };

  const isNarrationActive = narrationState !== "idle";

  /*
  const formatReadingStats = (content: string): string => {
    const readingTime = calculateReadingTime(content);
    return `${readingTime} Min Read`;
  };
  */

  if (!stories || stories.length === 0) {
    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8 pb-16 flex justify-center">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-8 sm:p-12 text-center text-slate-400 max-w-2xl w-full shadow-lg transition-all duration-500 ease-in-out mx-auto">
          <div className="text-5xl mb-6 animate-pulse">✨</div>
          <h3 className="text-2xl font-bold text-slate-200 tracking-wide">
            Your AI-generated story will appear here
          </h3>
          <p className="mt-3 text-base text-slate-400">
            Enter a creative prompt above and let StorySparkAI craft something magical.
          </p>
        </div>
const isNarrationActive = narrationState !== "idle";

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

if (!stories || stories.length === 0) {
  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8 pb-16 flex justify-center">
      <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-8 sm:p-12 text-center text-slate-400 max-w-2xl w-full shadow-lg transition-all duration-500 ease-in-out mx-auto">
        <div className="text-5xl mb-6 animate-pulse">✨</div>
        <h3 className="text-2xl font-bold text-slate-200 tracking-wide">
          Your AI-generated story will appear here
        </h3>
        <p className="mt-3 text-base text-slate-400">
          Enter a creative prompt above and let StorySparkAI craft something magical.
        </p>
      </div>
    </div>
  );
}
  }

  if (!selectedStory) {
    return (
      <>
        {/* Empty state */}
        <EmptyStoriesState />
      </>
    );
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
            <div className="">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
                {selectedStory?.title}
              </h1>
            </div>

            {/* Story selector thumbnails */}
            <div className="flex justify-start sm:justify-end">
              <div className="flex -space-x-5">
                {stories && stories.length > 0 ? (
                  stories.map((story) => (
                    <button
                      key={story.uuid}
                      className={`relative w-16 h-16 rounded-full border-2 ${
                        selectedStory?.uuid === story.uuid
                          ? "border-blue-500 scale-110"
                          : "border-white"
                      } hover:scale-110 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-fuchsia-600`}
                      onClick={() => handelStorySelection(story)}
                    >
                      <img
                        src={story.imageURL}
                        alt={story.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-gray-400">
                    No stories available. Please generate some stories first.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient AI Glow inside the story card */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-200 relative z-10">
                Generated Story
              </h3>
              <div className="flex items-center gap-2 relative z-10">
                {selectedStory && (
                  <>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-slate-700 text-slate-200 font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={handleCopyStory}
                    >
                      {isCopied ? "✓ Copied" : "📋 Copy"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-indigo-700 text-white font-semibold hover:bg-indigo-600 transition-colors"
                      onClick={handleGenerateCharacterProfile}
                    >
                      {profileLoading ? "Generating..." : "👥 Characters"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-purple-700 text-slate-200 font-semibold cursor-pointer hover:bg-purple-600 transition-colors"
                      onClick={handleExportPDF}
                    >
                      📄 Export PDF
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-emerald-700 text-white font-semibold cursor-pointer hover:bg-emerald-600 transition-colors"
                      onClick={() => setShowTranslator(true)}
                    >
                      🌍 Translate
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className={`rounded-lg px-5 py-2 font-semibold flex items-center space-x-2 cursor-pointer bg-blue-600 text-white transition-all duration-200 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  }`}
                  onClick={handelPublishStory}
                  disabled={loading}
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
                  (() => {
                    if (!selectedStory) return null;
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
            <StoryVersionHistory
              story={selectedStory}
              onRestore={handleRestoreVersion}
            />
          </div>

          {selectedStory?.scientificWarnings && selectedStory.scientificWarnings.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500"></div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-amber-200 tracking-wide">Scientific Fact-Check</h4>
                  <p className="text-xs text-amber-400/80">Automated conceptual error detection</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedStory.scientificWarnings.map((warning, index) => (
                  <div key={index} className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/40 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                        Issue
                      </span>
                      <span className="text-slate-200 font-semibold text-sm">
                        {warning.detectedIssue}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed pl-1">
                      {warning.explanation}
                    </p>
                    <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-start space-x-2">
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wide flex-shrink-0">
                        Correction
                      </span>
                      <span className="text-sm text-slate-300 leading-relaxed">
                        {warning.suggestedCorrection}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          <GeneratedStoryTimeline
            content={selectedStory.content}
            title={selectedStory.title}
            narrationState={narrationState}
            narrationWordIndex={narrationWordIndex}
          />

          <div className="mb-4 text-left select-none px-0.5 mt-6">
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
            </div>
            {selectedStory && (
              <>
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 w-full box-border relative z-10">
                  <AudioPlayer 
                    ref={audioPlayerRef} 
                    text={selectedStory.content} 
                    title={selectedStory.title} 
                    onWordIndexChange={setNarrationWordIndex} 
                    onPlaybackStateChange={setNarrationState} 
                  />
                </div>
                <StoryVersionHistory
                  story={selectedStory}
                  onRestore={handleRestoreVersion}
                />
              </>
            )}
          </div>
          <div className="mt-6">
  {characterProfiles.length > 0 && (
    <>
      <h3 className="text-xl font-bold text-white mb-4">
        Character Profiles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characterProfiles.map((profile, index) => (
          <CharacterProfileCard
            key={index}
            profile={profile}
          />
        ))}
      </div>
    </>
  )}
</div>
          <div className="mt-7">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-200 mb-4">
                Select Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedStory ? (
                  <>
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`px-4 py-1.5 ${topic.color} rounded-full text-sm font-medium transition-transform hover:scale-105 cursor-pointer shadow-sm`}
                        onClick={() => handleTopicClick(index)}
                      >
                        {topic.selected ? (
                          <i className="fa-solid fa-check"></i>
                        ) : (
                          <i className="fa-solid fa-plus"></i>
                        )}{" "}
                        {topic.title}
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

      {/* showStoryVisualizer && storyboardScenes.length > 0 && (
        <StoryVisualizer
          title={selectedStory?.title ?? ""}
          scenes={storyboardScenes}
          styleGuide={storyboardStyleGuide}
          onClose={() => setShowStoryVisualizer(false)}
        />
      ) */}

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
          story={selectedStory}
          onClose={() => setShowContinueModal(false)}
          onApply={(continuedContent) => {
            setSelectedStory({
              ...selectedStory,
              content: continuedContent,
            });
            setStories(
              stories.map((s) =>
                s.uuid === selectedStory.uuid
                  ? { ...s, content: continuedContent }
                  : s
              )
            );
          }}
        />
      )}

        
      {showGenreTransformation && selectedStory && (
        <StoryGenreTransformation
          story={{
            title: selectedStory.title,
            content: selectedStory.content,
          }}
          onClose={() => setShowGenreTransformation(false)}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />

      {showTranslator && selectedStory && (
        <StoryTranslator
          story={selectedStory}
          isLogin={isLogin}
          onClose={() => setShowTranslator(false)}
        />
      )}
    </div>
  );
};

export default StoriesViewComponent;
