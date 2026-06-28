import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";

import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";

import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { useApiError } from "../../hooks/useApiError";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
  useGenerateStoryVisualsMutation,
} from "../../redux/apis/ai.model.api";

import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import BookmarkButton from "../BookmarkButton";
import StoryWorldMap from "../story-map/StoryWorldMap";
import StoryRemix from "../remix/StoryRemix";
import StoryVisualizer from "../story-visualizer/StoryVisualizer";
import StoryTrailer from "../trailer/StoryTrailer";

import StoryCoverImage from "./StoryCoverImage";
import EmptyStoriesState from "./EmptyStoriesState";
import ContinueStoryButton from "../story/ContinueStoryButton";
import ContinueStoryModal from "./ContinueStoryModal";
import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
import CharacterProfileCard from "./CharacterProfileCard";

import ImageFallback from "../ImageFallback";

import { useDispatch } from "react-redux";

import { fetchImageAsBlob, exportStoryToEPUB } from "../../services/export.service";


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

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
  isLoading?: boolean;
}

type StorySentenceSegment = {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
};

function buildSentenceSegments(content: string): StorySentenceSegment[] {
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
}

function getSafeFileName(title: string, extension: "md" | "docx" | "pdf" | "epub") {
  const safeTitle = (title || "story")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return `${safeTitle || "story"}.${extension}`;
}

function calculateReadingTime(content: string): { minutes: number; label: string } {
  const words = getWordCount(content);
  const minutes = Math.ceil(words / 200);
  if (!minutes || minutes < 1) return { minutes: 0, label: "Less than 1 min read" };
  return { minutes, label: `⏱️ ${minutes} min read` };
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function StoriesViewComponent({
  stories,
  isLogin,
  setStories,
  onPublishSuccess,
  isLoading: isGlobalLoading,
}: StoriesComponentProps) {
  const dispatch = useDispatch();

  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");

  const [isCopied, setIsCopied] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showContinueModal, setShowContinueModal] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showRemix, setShowRemix] = useState(false);
  const [showStoryVisualizer, setShowStoryVisualizer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const [storyboardScenes, setStoryboardScenes] = useState<any[]>([]);
  const [storyboardStyleGuide, setStoryboardStyleGuide] = useState<string>("");

  const [endingsCache, setEndingsCache] = useState<Record<string, { style: string; ending: string; fullStory: string }[]>>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<Record<string, string>>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");

  const [narrationWordIndex, setNarrationWordIndex] = useState(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");
  const isNarrationActive = narrationState !== "idle";

  const [topicsLoaded, setTopicsLoaded] = useState(false);

  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const { setError, clearError } = useApiError();

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();
  const [generateStoryVisuals, { isLoading: isGeneratingVisuals }] = useGenerateStoryVisualsMutation();

  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);

  useEffect(() => {
    setTopicsLoaded(true);
  }, []);

  useEffect(() => {
    if (!topicsLoaded) return;
    setSelectTopics(topics.filter((t) => t.selected));
  }, [topics, topicsLoaded]);

  useEffect(() => {
    setSelectedStory(stories?.[0] ?? null);
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;

    setNarrationWordIndex(0);
    setNarrationState("idle");
    setErrorMessage(null);
  }, [stories]);

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({ ...prev, [selectedStory.uuid]: selectedStory.content }));
    }
  }, [selectedStory, originalStoryContent]);

  const sentenceSegments = useMemo(
    () => buildSentenceSegments(selectedStory?.content ?? ""),
    [selectedStory?.content]
  );

  // Auto-save
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
        if (result && (result as any).data?._id) {
          savedPostIdRef.current = (result as any).data._id;
        }
        lastSavedContentRef.current = selectedStory.content;
        hasSavedSessionRef.current = true;
        toast.success("Story auto-saved!");
      } catch (e) {
        console.error("Auto-save failed", e);
      } finally {
        isSavingRef.current = false;
      }
    };

    const t = window.setTimeout(autoSaveStory, 1000);
    return () => window.clearTimeout(t);
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost]);

  const handelStorySelection = (story: IStories) => setSelectedStory(story);

  const handleTopicClick = (index: number) => {
    setTopics((current) => current.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t)));
  };

  const handleAddTopic = () => {
    const title = newTopicTitle.trim();
    if (!title) return toast.error("Please enter a topic.");

    const normalizedTitle = title.startsWith("#") ? title : `#${title}`;
    const topicExists = topics.some((t) => t.title.toLowerCase() === normalizedTitle.toLowerCase());
    if (topicExists) return toast.error("This topic already exists.");

    setTopics((cur) => [
      ...cur,
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
    if (topics.length <= 2) return toast.error("At least 2 topics are required.");
    setTopics((cur) => cur.filter((_, i) => i !== index));
  };

  const handleCopyStory = async () => {
    if (!selectedStory?.content) return;
    await navigator.clipboard.writeText(selectedStory.content);
    setIsCopied(true);
    toast.success("Story copied!");
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    if (!selectedStory) return toast.error("No story available to export.");
    if (!selectedStory.content?.trim()) return toast.error("Story content is empty. Cannot export.");

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const title = selectedStory.title || "Untitled Story";
      const content = selectedStory.content || "";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(title, 15, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(content, 180);
      doc.text(splitText, 15, 30);

      doc.save(getSafeFileName(title, "pdf"));
      toast.success("PDF downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedStory) return toast.error("No story available to export.");
    if (!selectedStory.content?.trim()) return toast.error("Story content is empty. Cannot export.");

    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      const markdownContent = `---\ntitle: "${title.replace(/"/g, "\\\"")}"\ntag: "${tag.replace(/"/g, "\\\"")}"\nauthor: "${authorName.replace(/"/g, "\\\"")}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export Markdown.");
    }
  };

  const handleExportDOCX = async () => {
    if (!selectedStory) return toast.error("No story available to export.");

    const toastId = toast.loading("Preparing your DOCX file...");
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
              new Paragraph({ children: [new TextRun({ text: `Author: ${authorName}`, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: `Date: ${isoDate}`, size: 24 })] }),
              new Paragraph({ text: "" }),
              ...content
                .split(/\n+/)
                .filter((p) => p.trim() !== "")
                .map(
                  (p) =>
                    new Paragraph({
                      children: [new TextRun({ text: p.trim(), size: 24 })],
                      spacing: { after: 200 },
                    })
                ),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, getSafeFileName(title, "docx"));
      toast.dismiss(toastId);
      toast.success("DOCX downloaded!");
    } catch (e) {
      console.error(e);
      toast.dismiss(toastId);
      toast.error("Failed to export DOCX.");
    }
  };

  const handleExportEPUB = async () => {
    if (!selectedStory) return toast.error("No story available to export.");
    if (!selectedStory.content?.trim()) return toast.error("Story content is empty. Cannot export.");

    try {
      let imageBlob: Blob | null = null;
      if (selectedStory.imageURL) {
        try {
          imageBlob = await fetchImageAsBlob(selectedStory.imageURL);
        } catch {
          // ignore
        }
      }

      await exportStoryToEPUB(selectedStory, imageBlob);
      toast.success("EPUB downloaded successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export EPUB.");
    }
  };

  const handelPublishStory = async () => {
    if (!isLogin) return toast.error("Please login to publish the story.");
    if (!selectedStory) return toast.error("No story available. Please generate a story first.");
    if (selectTopics.length < 2) return toast.error("Please select at least 2 topics.");

    const post: IPost = { ...selectedStory, topic: selectTopics };
    setLoading(true);

    try {
      if (savedPostIdRef.current) {
        try {
          await deletePost(savedPostIdRef.current).unwrap();
        } catch {
          // ignore
        }
      }

      await createPost(post).unwrap();
      toast.success("Story published successfully!");
      setStories([]);
      setSelectedStory(null);
      onPublishSuccess?.();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStoryVisuals = async () => {
    if (!selectedStory) return toast.error("No story available. Please generate a story first.");

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
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate visuals. Please try again.");
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

      const generationRequest = isLogin ? generateAlternateEndings(payload) : generateFreeAlternateEndings(payload);
      const res = await generationRequest.unwrap();

      if (!res || !Array.isArray(res.data)) throw new Error("Unexpected response format from AI service.");

      setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
      toast.success("Alternate endings generated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(String(err?.data?.message ?? err?.message ?? err));
      toast.error("Failed to generate alternate endings.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
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

  if (isGlobalLoading || (loading && stories.length === 0)) {
    return (
      <div className="flex items-center justify-center py-20">
        <StoryGeneratingAnimation />
      </div>
    );
  }

  if (!stories || !stories.length) {
    return <EmptyStoriesState />;
  }

  if (!selectedStory) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16 relative overflow-hidden box-border">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10 w-full box-border">
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 w-full box-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 w-full box-border border-b border-slate-200/60 dark:border-white/5 pb-6">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">{selectedStory.title}</h1>
              <div className="flex flex-wrap gap-2 select-none">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🎭 {selectedStory.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🌐 {selectedStory.language || "English"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/5 text-slate-600 dark:text-slate-400 border border-slate-700/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  📖 {calculateReadingTime(selectedStory.content).label}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                    😊 {selectedStory.emotions.join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-start sm:justify-end shrink-0 select-none">
              <div className="flex -space-x-4">
                {stories.map((story) => (
                  <button
                    key={story.uuid}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 ${
                      selectedStory?.uuid === story.uuid
                        ? "border-blue-600 scale-110 z-10 shadow-md"
                        : "border-white dark:border-slate-800"
                    } hover:scale-110 hover:z-10 transition-all duration-150 focus:outline-none overflow-hidden cursor-pointer`}
                    onClick={() => handelStorySelection(story)}
                    title={story.title}
                  >
                    {story.imageURL ? (
                      <ImageFallback src={story.imageURL} alt={story.title} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <StoryCoverImage title={story.title} tag={story.tag} size="thumb" className="w-full h-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm w-full box-border text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5 select-none">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Workspace Blueprint</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={handleCopyStory}
                >
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={handleExportPDF}
                >
                  📄 PDF
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={handleExportMarkdown}
                >
                  ⬇️ Markdown
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={handleExportDOCX}
                >
                  📝 DOCX
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={handleExportEPUB}
                >
                  📘 EPUB
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={() => setShowWorldMap(true)}
                >
                  🗺️ Map
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={() => setShowRemix(true)}
                >
                  🔀 Remix
                </button>

                <button
                  type="button"
                  className="rounded-xl px-3 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200/60 dark:border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer"
                  onClick={() => setShowTrailer(true)}
                >
                  🎬 Trailer
                </button>

                <button
                  type="button"
                  className="rounded-xl px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  onClick={handelPublishStory}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>

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

            <div id="story-content" className="w-full text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed tracking-wide font-medium">
              <p className="break-words whitespace-pre-wrap m-0">
                {sentenceSegments.length > 0
                  ? sentenceSegments.map((segment) => {
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
                              ? "transition-colors duration-300 text-slate-900 dark:text-slate-100 font-semibold"
                              : undefined
                          }
                        >
                          {rawParts.map((part, partIdx) => {
                            if (part === "") return null;
                            if (/^\s+$/.test(part)) return part;

                            const absoluteWordIndex = segment.startWordIndex + wordOffset;
                            wordOffset++;

                            const isActiveWord = isNarrationActive && narrationWordIndex === absoluteWordIndex;

                            return isActiveWord ? (
                              <span
                                key={partIdx}
                                className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded px-0.5 transition-all duration-150"
                              >
                                {part}
                              </span>
                            ) : (
                              <span key={partIdx}>{part}</span>
                            );
                          })}
                        </span>
                      );
                    })
                  : null}
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
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 ${topic.className} rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border border-slate-100 dark:border-transparent select-none`}
                >
                  <button
                    type="button"
                    className="cursor-pointer font-bold uppercase flex items-center gap-1.5"
                    onClick={() => handleTopicClick(index)}
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
              ))}
            </div>
          </div>

          {selectedStory && (
            <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm w-full box-border text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 select-none w-full box-border">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Narrative Path Modifications</h3>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
                    Branch out into unique storytelling variations.
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
                <div className="flex flex-col items-center justify-center py-12 select-none w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-blue-600 dark:border-white/10 dark:border-t-white mb-4" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
                    Running variant projection logic...
                  </p>
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
                      {calculateReadingTime(selectedStory.content).label}
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

          <div className="mt-6">
            <GeneratedStoryTimeline
              content={selectedStory.content}
              title={selectedStory.title}
              narrationState={narrationState}
              narrationWordIndex={narrationWordIndex}
            />
          </div>
        </div>
      </div>

      {showWorldMap && selectedStory && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-white font-semibold">Loading Map...</div>}>
          <StoryWorldMap story={selectedStory.content} title={selectedStory.title} onClose={() => setShowWorldMap(false)} />
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
        <StoryTrailer title={selectedStory.title} content={selectedStory.content} tag={selectedStory.tag} isLogin={isLogin} onClose={() => setShowTrailer(false)} />
      )}

      {showContinueModal && selectedStory && (
        <ContinueStoryModal
          story={{ title: selectedStory.title, content: selectedStory.content, language: selectedStory.language ?? "English" }}
          onClose={() => setShowContinueModal(false)}
        />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

