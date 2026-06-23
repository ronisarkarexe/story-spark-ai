import React, { useEffect, useState } from "react";
import CharacterProfileCard from "./CharacterProfileCard";
import StoryGenreTransformation from "./StoryGenreTransformation";
import StoryMoodDashboard from "./StoryMoodDashboard";
import StoryTitleSuggestions from "./StoryTitleSuggestions";
import StoryVersionHistory from "./StoryVersionHistory";
import { CharacterProfile } from "./stories.utils";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation } from "../../redux/apis/post.api";
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
import ContinueStoryModal from "./ContinueStoryModal";
export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
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

const detectStoryMood = (content: string) => {
  const lowercase = content.toLowerCase();
  
  const moodKeywords = {
    Happy: {
      emoji: "😊",
      words: ["happy", "joy", "smile", "laugh", "glad", "cheerful", "delighted", "celebrat", "sunshine", "peace", "content", "love", "wonderful", "positive"],
      colorClass: "text-amber-300",
      bgClass: "bg-amber-900/60",
      borderClass: "border-amber-700/50"
    },
    Suspense: {
      emoji: "😨",
      words: ["shadow", "mysteri", "mystery", "whisper", "dark", "silence", "sudden", "fear", "dread", "tense", "tension", "escape", "warning", "danger", "trap", "alert", "nervous", "heartbeat", "chill"],
      colorClass: "text-orange-300",
      bgClass: "bg-orange-900/60",
      borderClass: "border-orange-700/50"
    },
    Sad: {
      emoji: "💔",
      words: ["sad", "tears", "tear", "cry", "weep", "grief", "grieve", "loss", "lost", "lonely", "pain", "sorrow", "mourn", "broken", "empty", "tragic", "regret"],
      colorClass: "text-cyan-300",
      bgClass: "bg-cyan-900/60",
      borderClass: "border-cyan-700/50"
    },
    Action: {
      emoji: "🔥",
      words: ["run", "fight", "battle", "sword", "strike", "clash", "weapon", "burst", "speed", "explod", "explosion", "chase", "leap", "attack", "defense", "power"],
      colorClass: "text-rose-300",
      bgClass: "bg-rose-900/60",
      borderClass: "border-rose-700/50"
    },
    Fantasy: {
      emoji: "✨",
      words: ["magic", "spell", "wizard", "witch", "elf", "dwarf", "fairy", "dragon", "portal", "crystal", "kingdom", "cast", "wand", "sparkle", "enchant", "dream", "myth", "legend"],
      colorClass: "text-purple-300",
      bgClass: "bg-purple-900/60",
      borderClass: "border-purple-700/50"
    }
  };

  const scores: Record<string, number> = {
    Happy: 0,
    Suspense: 0,
    Sad: 0,
    Action: 0,
    Fantasy: 0
  };

  for (const [mood, data] of Object.entries(moodKeywords)) {
    data.words.forEach(word => {
      const regex = new RegExp(`\\b${word}`, 'g');
      const matches = lowercase.match(regex);
      if (matches) {
        scores[mood] += matches.length;
      }
    });
  }

  let maxMood = "Fantasy"; // default fallback mood
  let maxScore = 0;

  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxMood = mood;
    }
  }

  return {
    label: maxMood,
    emoji: moodKeywords[maxMood as keyof typeof moodKeywords].emoji,
    colorClass: moodKeywords[maxMood as keyof typeof moodKeywords].colorClass,
    bgClass: moodKeywords[maxMood as keyof typeof moodKeywords].bgClass,
    borderClass: moodKeywords[maxMood as keyof typeof moodKeywords].borderClass
  };
};

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
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
  const [showContinueModal, setShowContinueModal] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [showGenreTransformation, setShowGenreTransformation] = useState<boolean>(false);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    }
  }, [stories]);

useEffect(() => {
  const autoSaveStory = async () => {
    if (!selectedStory) return;

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
}, [selectedStory, isLogin, selectTopics]);

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

  const handleTopicClick = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics[index].selected = !updatedTopics[index].selected;
    setTopics(updatedTopics);
  };
const handleCopyStory = async () => {
  if (selectedStory?.content) {
    await navigator.clipboard.writeText(selectedStory.content);
    setIsCopied(true);
    toast.success("Story copied!");
    setTimeout(() => setIsCopied(false), 2000);
       }
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
            <StoryVersionHistory
              story={selectedStory}
              onRestore={handleRestoreVersion}
            />
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
              {selectedStory ? (
                <p className="break-words">{selectedStory.content}</p>
              ) : (
                <p>No story available. Please generate a story first.</p>
              )}
            </div>
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

        


        <div className="col-span-1 lg:col-span-4">
          <div className="mb-5">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Preview
            </h1>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden group">
            {selectedStory ? (
              <div className="relative flex flex-col rounded-lg">
                <div className="relative m-3 overflow-hidden text-white rounded-xl">
                  <img
                    src={selectedStory.imageURL}
                    alt="card-image"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-1">
                  <div className="mb-2 inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                   {selectedStory.tag.toUpperCase()}
                  </div>
                  <h6 className="mb-1 text-gray-300 text-xl font-semibold">
                    {selectedStory.title}
                  </h6>
                  <p className="text-gray-400 font-light breakwords text-sm sm:text-base">
                    {getShortenedText(selectedStory.content)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                No story available. Please generate a story first.
              </div>
            )}
          </div>
        </div>
      </div>
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
