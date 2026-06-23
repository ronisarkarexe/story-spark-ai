import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import {
  Copy,
  Check,
  Globe,
  Sparkles,
  BookOpen,
  Clock,
  Download,
  Share2,
  FileText,
  Bookmark,
  Users,
  Compass
} from "lucide-react";

import { useCreatePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";

import CharacterProfileCard from "./CharacterProfileCard";
import StoryGenreTransformation from "./StoryGenreTransformation";
import StoryMoodDashboard from "./StoryMoodDashboard";
import StoryTitleSuggestions from "./StoryTitleSuggestions";
import StoryVersionHistory from "./StoryVersionHistory";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import StoryTranslator from "../translate/StoryTranslator";

import {
  CharacterProfile,
  getShortenedText,
  ITopicData,
  topicsData,
  getWordCount,
} from "./stories.utils";

import { formatReadingStats } from "../../utils/story-utils";
import jsPDF from "jspdf";

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  emotions?: string[];
  enhancedPrompt?: string;
  language?: string;
  genre?: string;
}

interface IPost extends IStories {
  topic: ITopicData[];
}

interface StoriesViewComponentProps {
  stories: IStories[];
  selectedStory?: IStories | null;
  setSelectedStory?: (story: IStories | null) => void;
  setStories: React.Dispatch<React.SetStateAction<IStories[]>>;
  isLogin: boolean;
  onPublishSuccess?: () => void;
}

type StorySentenceSegment = {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
};

const buildSentenceSegments = (content: string): StorySentenceSegment[] => {
  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments: StorySentenceSegment[] = [];
  let wordCursor = 0;

  sentenceMatches.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) {
      return;
    }
    const wordsInSentence = trimmedSentence.split(/\s+/).length;
    segments.push({
      id: `sentence-${index}`,
      text: sentence,
      startWordIndex: wordCursor,
      endWordIndex: wordCursor + wordsInSentence - 1,
    });
    wordCursor += wordsInSentence;
  });

  return segments;
};

const StoriesViewComponent: React.FC<StoriesViewComponentProps> = ({
  stories,
  selectedStory: passedSelectedStory,
  setSelectedStory: passedSetSelectedStory,
  setStories,
  isLogin,
  onPublishSuccess,
}) => {
  const [localSelectedStory, setLocalSelectedStory] = useState<IStories | null>(null);

  const selectedStory = passedSelectedStory !== undefined ? passedSelectedStory : localSelectedStory;
  const setSelectedStory = passedSetSelectedStory !== undefined ? passedSetSelectedStory : setLocalSelectedStory;

  useEffect(() => {
    if (passedSelectedStory === undefined && stories && stories.length > 0) {
      setLocalSelectedStory(stories[0]);
    }
  }, [stories, passedSelectedStory]);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [characterProfiles, setCharacterProfiles] = useState<CharacterProfile[]>([]);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [showGenreTransformation, setShowGenreTransformation] = useState<boolean>(false);
  
  // Reading progress tracker
  const [scrollProgress, setScrollProgress] = useState(0);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  // Audio / TTS State
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  // Alternate Endings State
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{
    [uuid: string]: string;
  }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");

  const [createPost] = useCreatePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  // Sync scroll progress inside the story container
  const handleScroll = () => {
    const element = storyContainerRef.current;
    if (!element) return;
    const totalHeight = element.scrollHeight - element.clientHeight;
    if (totalHeight === 0) {
      setScrollProgress(0);
      return;
    }
    const progress = (element.scrollTop / totalHeight) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    // Reset reading scroll progress on story changes
    setScrollProgress(0);
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  // Auto-scroll active word during voice narration
  useEffect(() => {
    if (narrationState === "playing") {
      const activeWordElement = document.querySelector('[data-active-word="true"]');
      if (activeWordElement) {
        activeWordElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [narrationWordIndex, narrationState]);

  // Auto save on selected story / topics selection
  useEffect(() => {
    const autoSaveStory = async () => {
      if (!selectedStory || !isLogin) return;

      const post: IPost = {
        ...selectedStory,
        topic: selectTopics,
      };

      try {
        await createPost(post).unwrap();
      } catch (error) {
        console.error("Auto-save failed", error);
      }
    };

    const timer = setTimeout(() => {
      autoSaveStory();
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedStory, isLogin, selectTopics, createPost]);

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  const wordCount = useMemo(() => {
    return getWordCount(selectedStory?.content);
  }, [selectedStory?.content]);

  const characterCount = useMemo(() => {
    return selectedStory?.content?.length || 0;
  }, [selectedStory?.content]);

  const readingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const handleTopicClick = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics[index].selected = !updatedTopics[index].selected;
    setTopics(updatedTopics);
  };

  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      try {
        await navigator.clipboard.writeText(selectedStory.content);
        setIsCopied(true);
        toast.success("Story copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        toast.error("Failed to copy story.");
      }
    }
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
      const doc = new jsPDF();
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const leftMargin = 15;
      const printableWidth = 180;
      const maxY = 270;
      let yCursor = 20;

      // 1. Premium cover image check / load
      let storyImg: HTMLImageElement | null = null;
      if (selectedStory.imageURL) {
        try {
          storyImg = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = selectedStory.imageURL;
          });
        } catch {
          console.warn("Could not load image for PDF export");
        }
      }

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

  const handleExportMarkdown = () => {
    if (!selectedStory) {
      toast.error("No story available to export.");
      return;
    }
    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${tag.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Markdown file downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Markdown.");
    }
  };

  const handleGenerateCharacterProfile = async () => {
    if (!selectedStory) {
      toast.error("No story selected!");
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch("/api/generate-character-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story: selectedStory.content,
        }),
      });

      const data = await response.json();
      setCharacterProfiles(data.data || []);
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
      toast.error("Please login to publish your story.");
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
        onPublishSuccess?.();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Weaving alternate endings...");
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
        toast.success("Alternate endings ready!");
      } else {
        toast.error("Failed to generate alternate endings.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate endings. Please try again.");
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
    toast.success(`${endingData.style} endings applied to canvas!`);
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
    toast.success("Reverted story back to the original ending!");
  };

  const isNarrationActive = narrationState !== "idle";

  if (!selectedStory) return null;

  return (
    <div className="flex flex-col h-full relative">
      {/* Scroll Progress Bar */}
      <div className="w-full bg-slate-200/50 dark:bg-white/5 h-1.5 sticky top-0 z-30 overflow-hidden rounded-t-2xl">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Action Toolbar */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 shadow-lg">
          <button
            onClick={handleCopyStory}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full transition-colors cursor-pointer"
            title="Copy story"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowTranslator(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full transition-colors cursor-pointer"
            title="Translate story"
          >
            <Globe className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportPDF}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportMarkdown}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full transition-colors cursor-pointer"
            title="Download Markdown"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={handleGenerateCharacterProfile}
            disabled={profileLoading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            title="Extract characters profiles"
          >
            <Users className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-300 dark:bg-white/10 mx-1" />

          <button
            onClick={handelPublishStory}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-indigo-500/20"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Story Content & Reading Panel */}
      <div
        ref={storyContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          
          {/* Genre Badge & Tag */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {selectedStory.tag || "General"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
            {selectedStory.title}
          </h1>

          {/* Reading Statistics Cards */}
          <div className="grid grid-cols-3 gap-3 border-y border-slate-200/60 dark:border-white/5 py-4 my-2">
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Word Count</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{wordCount}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Read Time</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{readingTime} min</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
              <FileText className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Characters</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{characterCount}</span>
            </div>
          </div>

          {/* Story Body */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-lg tracking-wide whitespace-pre-wrap select-text selection:bg-indigo-500/20 py-4">
            <p>
              {sentenceSegments.length > 0 ? (
                sentenceSegments.map((segment) => {
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
                          ? "bg-indigo-500/10 text-slate-900 dark:text-white transition-colors duration-300 rounded px-0.5"
                          : undefined
                      }
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
                              className="bg-indigo-500/40 text-indigo-900 dark:text-indigo-200 rounded px-1 transition-all duration-150 active-narrated-word"
                              data-active-word="true"
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
                selectedStory.content
              )}
            </p>
          </div>

          {/* Narrator Player Block */}
          <div className="mt-4 pt-6 border-t border-slate-200 dark:border-white/5">
            <AudioPlayer
              ref={audioPlayerRef}
              text={selectedStory.content}
              title={selectedStory.title}
              onWordIndexChange={setNarrationWordIndex}
              onPlaybackStateChange={setNarrationState}
            />
          </div>

          {/* Custom Characters profiles */}
          {characterProfiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                👤 Extracted Characters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {characterProfiles.map((profile, index) => (
                  <CharacterProfileCard key={index} profile={profile} />
                ))}
              </div>
            </div>
          )}

          {/* Alternate Endings Section */}
          <div className="mt-8 bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  🪄 Alternate Endings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Whip up and apply alternative final acts to your canvas.
                </p>
              </div>
              {selectedStory.content !== originalStoryContent[selectedStory.uuid] ? (
                <button
                  type="button"
                  onClick={handleResetEnding}
                  className="rounded-full px-4 py-1.5 bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  Reset to Original
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateAlternateEndings}
                  disabled={isGeneratingEndings}
                  className="rounded-full px-4 py-1.5 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/20 text-slate-200 dark:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingEndings ? "Weaving..." : "Generate Alternate Endings"}
                </button>
              )}
            </div>

            {endingsCache[selectedStory.uuid] && endingsCache[selectedStory.uuid].length > 0 && (
              <div className="mt-4 flex flex-col gap-4">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/5 pb-2">
                  {endingsCache[selectedStory.uuid].map((ending) => (
                    <button
                      key={ending.style}
                      onClick={() => setActiveEndingTab(ending.style)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all relative ${
                        activeEndingTab === ending.style
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {ending.style}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {(() => {
                  const currentEndings = endingsCache[selectedStory.uuid] || [];
                  const currentEndingData = currentEndings.find((e) => e.style === activeEndingTab);
                  if (!currentEndingData) return null;

                  const isCurrentlyApplied = selectedStory.content === currentEndingData.fullStory;

                  return (
                    <div className="bg-slate-200/20 dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-200/60 dark:border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {activeEndingTab} Suggestion
                        </h4>
                        <div>
                          {isCurrentlyApplied ? (
                            <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Applied to Story
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyEnding(currentEndingData)}
                              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
                            >
                              Apply to Story
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm italic whitespace-pre-wrap leading-relaxed">
                        {currentEndingData.ending}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Topics & Tag list section */}
          <div className="mt-8 bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              🏷️ Topics & Tags
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select tag topics for indexing your story in the database feeds.
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <button
                  key={topic.title}
                  onClick={() => handleTopicClick(index)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    topic.selected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {topic.selected ? <Check className="w-3 h-3" /> : null}
                  {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* Version History Component */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5">
            <StoryVersionHistory
              story={selectedStory}
              onRestore={handleRestoreVersion}
            />
          </div>

        </div>
      </div>

      {/* Auxiliary Modals */}
      <AnimatePresence>
        {showTranslator && (
          <StoryTranslator
            story={selectedStory}
            isLogin={isLogin}
            onClose={() => setShowTranslator(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGenreTransformation && (
          <StoryGenreTransformation
            story={{
              title: selectedStory.title,
              content: selectedStory.content,
            }}
            onClose={() => setShowGenreTransformation(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoriesViewComponent;
