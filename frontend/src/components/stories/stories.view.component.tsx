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
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStory } from "../../redux/slices/storySlice";
import ContinueStoryButton from "../story/ContinueStoryButton";
import StoryCoverImage from "./StoryCoverImage";
import StoryVisualizer from "../story-visualizer/StoryVisualizer";

const StoryWorldMap = React.lazy(() => import("../story-map/StoryWorldMap"));
const StoryRemix = React.lazy(() => import("../remix/StoryRemix"));
import { useApiError } from "../../hooks/useApiError";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import { useGenerateStoryVisualsMutation } from "../../redux/apis/story.visualizer.api";
import type { StoryboardScene } from "../../redux/apis/story.visualizer.api";
import ImageFallback from "../ImageFallback";
import StoryVisualizer from "../story-visualizer/StoryVisualizer";
import ContinueStoryModal from "./ContinueStoryModal";
import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
import PublishConfirmModal from "./PublishConfirmModal";

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
}

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
}) => {
  const [selectedStory, setSelectedStory] = useState<IStories | null>(
    stories && stories[0]
  );
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Used for initial generative state

  // Modals
  const [showContinueModal, setShowContinueModal] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showRemix, setShowRemix] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
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

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 w-full box-border">
              <AudioPlayer
                ref={audioPlayerRef}
                text={selectedStory.content}
                title={selectedStory.title}
                onWordIndexChange={setNarrationWordIndex}
                onPlaybackStateChange={setNarrationState}
              />
            </div>
            <div className="mt-4 w-full box-border">
              <ContinueStoryButton />
            </div>
          </div>

          {/* Topics management section */}
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm w-full box-border text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 select-none">Categorization Indexes</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-5 select-none w-full box-border">
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
                placeholder="Add contextual keyword index tag..."
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
            <div className="flex flex-wrap gap-2 w-full box-border">
              {selectedStory ? (
                topics.map((topic, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 ${topic.className} rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border border-slate-100 dark:border-transparent select-none`}
                  >
                    <button
                      type="button"
                      className="cursor-pointer font-bold uppercase flex items-center gap-1.5"
                      onClick={() => {
                        handleTopicClick(index);
                      }}
                    >
                      {topic.selected ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-plus" />}
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
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 m-0">No keyword topics registered.</p>
              )}
            </div>
          </div>

          {/* Alternate endings control hub */}
          {selectedStory && (
            <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm w-full box-border text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 select-none w-full box-border">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Narrative Path Modifications</h3>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Branch out into unique storytelling variations.</p>
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
                <div className="flex flex-col items-center justify-center py-12 select-none w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-blue-600 dark:border-white/10 dark:border-t-white mb-4"></div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">Running variant projection logic...</p>
                </div>
              ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
                <div className="w-full box-border">
                  <div className="flex border-b border-slate-100 dark:border-white/5 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none select-none w-full box-border">
                    {["Happy Ending", "Dark Ending", "Plot Twist Ending", "Open Ending", "Cliffhanger Ending"].map((name) => {
                      const endingData = (endingsCache[selectedStory.uuid] || []).find((e) => e.style === name);
                      const isApplied = endingData && selectedStory.content === endingData.fullStory;
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
                          {isApplied && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                        </button>
                      );
                    })}
                  </div>
                  {(() => {
                    const currentEndingData = (endingsCache[selectedStory.uuid] || []).find((e) => e.style === activeEndingTab);
                    if (!currentEndingData) return null;
                    const isCurrentlyApplied = selectedStory.content === currentEndingData.fullStory;
                    return (
                      <div className="bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-5 border border-slate-200/60 dark:border-white/5 w-full box-border">
                        <div className="flex justify-between items-center mb-4 select-none w-full box-border">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{activeEndingTab} Excerpt</h4>
                          <div>
                            {isCurrentlyApplied ? (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                <i className="fa-solid fa-circle-check" /> Active Node
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
                        </div>
                        <div className="space-y-4 w-full box-border">
                          <div className="bg-white dark:bg-[#111827]/40 p-4 rounded-xl border border-slate-200/80 dark:border-white/5 leading-relaxed text-slate-600 dark:text-slate-300 text-xs sm:text-sm italic shadow-inner whitespace-pre-wrap text-left font-medium">
                            <p className="m-0">"{currentEndingData.ending}"</p>
                          </div>
                          <details className="group border border-slate-200/80 dark:border-white/5 rounded-xl overflow-hidden bg-white dark:bg-transparent">
                            <summary className="list-none flex items-center justify-between p-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer select-none">
                              <span>Preview Integrated Compounded Chronicle</span>
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
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/5 rounded-xl select-none w-full box-border">
                  <button
                    type="button"
                    onClick={handleGenerateAlternateEndings}
                    className="rounded-xl px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 transition-all duration-150 hover:scale-105 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-shuffle text-xs" /> Transform Endings
                  </button>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-3.5 text-center max-w-sm px-4">
                    Analyzes the current plot architecture to frame 5 distinct structural variations including Happy, Dark, Plot Twist, Open, and Cliffhanger resolutions.
                  </p>
                </div>
              )}
            </div>
          )}
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
          title={selectedStory?.title}
          scenes={storyboardScenes}
          styleGuide={storyboardStyleGuide}
          onClose={() => setShowStoryVisualizer(false)}
        />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    const updatedStory = { ...selectedStory, content: originalContent };
    setSelectedStory(updatedStory);
    setStories(stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s)));
    toast.success("Reverted to original story ending!");
  };

  const handleExportPDF = async () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) { toast.error("Story content is empty. Cannot export."); return; }
    
    setIsExportDropdownOpen(false);
    const toastId = toast.loading("Preparing your premium PDF...");
    
    try {
      const loadImageWithTimeout = (src: string, timeoutMs: number = 3000): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const timeout = setTimeout(() => { img.src = ""; reject(new Error(`Timeout loading image: ${src}`)); }, timeoutMs);
          img.onload = () => { clearTimeout(timeout); resolve(img); };
          img.onerror = (e) => { clearTimeout(timeout); reject(e); };
          img.src = src;
        });
      };

      let logoImg: HTMLImageElement | null = null;
      let storyImg: HTMLImageElement | null = null;

      try { logoImg = await loadImageWithTimeout(logo); } catch (err) { console.warn("Failed to load logo", err); }
      if (selectedStory.imageURL) {
        try { storyImg = await loadImageWithTimeout(selectedStory.imageURL); } catch (err) { console.warn("Failed to load story banner", err); }
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
        doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(99, 102, 241);
        doc.text("StorySparkAI", leftMargin, yCursor + 6);
      }
      
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text("PREMIUM AI GENERATED STORY", 190, yCursor + 5, { align: "right" });
      yCursor += 10;
      
      doc.setDrawColor(99, 102, 241); doc.setLineWidth(0.5); doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 8;

      // Story Banner Image
      if (storyImg) {
        const bannerHeight = 55;
        doc.addImage(storyImg, "JPEG", leftMargin, yCursor, printableWidth, bannerHeight);
        yCursor += bannerHeight + 8;
      }

      doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(30, 41, 59);
      const splitTitle = doc.splitTextToSize(title, printableWidth);
      splitTitle.forEach((line: string) => { doc.text(line, leftMargin, yCursor); yCursor += 9; });
      yCursor += 1;

      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
      const formattedDate = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      doc.text(`Generated on ${formattedDate}`, leftMargin, yCursor);
      
      doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
      const tagWidth = doc.getTextWidth(tag);
      const chipWidth = tagWidth + 5, chipHeight = 5, chipX = 190 - chipWidth, chipY = yCursor - 3.8;
      doc.setFillColor(99, 102, 241); doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 1, 1, "F");
      doc.setTextColor(255, 255, 255); doc.text(tag, chipX + 2.5, chipY + 3.5);
      
      yCursor += 4.5;
      doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 10;

      const paragraphs = content.split(/\n+/);
      paragraphs.forEach((para: string, pIdx: number) => {
        const cleanPara = para.trim();
        if (!cleanPara) return;
        const lines = doc.splitTextToSize(cleanPara, printableWidth);
        lines.forEach((line: string) => {
          if (yCursor > maxY) { doc.addPage(); yCursor = 30; }
          doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(30, 41, 59);
          doc.text(line, leftMargin, yCursor); yCursor += 6.5;
        });
        if (pIdx < paragraphs.length - 1) yCursor += 4.5;
      });

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.25); doc.line(leftMargin, 280, 190, 280);
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
        doc.text("Generated with StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
        if (i > 1) {
          doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(99, 102, 241);
          doc.text("StorySparkAI", leftMargin, 14);
          doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
          const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
          doc.text(headerTitle, 190, 14, { align: "right" });
          doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.2); doc.line(leftMargin, 17, 190, 17);
        }
      }

      doc.save(getSafeFileName(title, "pdf"));
      toast.dismiss(toastId);
      toast.success("Premium PDF downloaded!");
    } catch (error) {
      console.error(error); 
      toast.dismiss(toastId); 
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) { toast.error("Story content is empty. Cannot export."); return; }
    setIsExportDropdownOpen(false);

    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${tag.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });

      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) { 
      console.error(error); 
      toast.error("Failed to export Markdown."); 
    }
  };

  const handleExportDOCX = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) { toast.error("Story content is empty. Cannot export."); return; }
    setIsExportDropdownOpen(false);
    
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to export DOCX.");
    }
  };

  const handelPublishStory = async () => {
    if (!isLogin) { toast.error("Please login to publish the story."); return; }
    if (!selectedStory) { toast.error("No story available. Please generate a story first."); return; }
    if (selectTopics.length < 2) { toast.error("Please select at least 2 topics."); return; }
    
    const post: IPost = { ...selectedStory, topic: selectTopics, isPublished: true };
    setLoading(true);
    
    try {
      if (savedPostIdRef.current) {
        try { await deletePost(savedPostIdRef.current).unwrap(); }
        catch (deleteError) { console.warn("Failed to delete draft:", deleteError); }
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

  const isNarrationActive = narrationState !== "idle";

  if (isLoading) {
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
                <button type="button" className="rounded-xl px-3 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white border border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm" onClick={() => setShowContinueModal(true)}>
                  ✦ Continue →
                </button>
                <button type="button" className={`rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 ${loading ? 'opacity-70' : ''}`} onClick={() => setShowPublishConfirm(true)} disabled={loading}>
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
                      </span>
                    );
                  })
                ) : (
                  DOMPurify.sanitize(selectedStory.content)
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
      {showPublishConfirm && (
        <PublishConfirmModal
          onConfirm={() => {
            setShowPublishConfirm(false);
            handelPublishStory();
          }}
          onCancel={() => setShowPublishConfirm(false)}
        />
      )}
    </div>

export default StoriesViewComponent;
