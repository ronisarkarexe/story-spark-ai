import React, { useEffect, useState, useRef, useMemo } from "react";
import DOMPurify from "dompurify";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";

import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { useGenerateAlternateEndingsMutation, useGenerateFreeAlternateEndingsMutation } from "../../redux/apis/ai.model.api";

import StoryWorldMap from "../story-map/StoryWorldMap";
import StoryRemix from "../remix/StoryRemix";
import BookmarkButton from "../BookmarkButton";
import ImageFallback from "../ImageFallback";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import StoryVisualizer from "../story-visualizer/StoryVisualizer";
import logo from "../../assets/logoNew.png";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return "The AI service is currently busy. Please wait a moment and try again.";
    if ([502, 503, 504].includes(error.status)) return "The server took too long to respond. Please try again shortly.";
    if (error.status >= 500) return "A server error occurred. Please try again later.";
  }
  if (error instanceof TypeError) return "Could not reach the server. Please check your connection and try again.";
  return "An unexpected error occurred. Please try again.";
}

// Fallback utilities for missing imports in the provided code
const getInitials = (title: string) => title?.charAt(0)?.toUpperCase() || "S";
const getGenreTheme = (tag: string) => ({ gradient: "to bottom right, #4f46e5, #ec4899", accent: "#fff", icon: "✨" });

interface StoryCoverImageProps {
  title?: string;
  tag?: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}

const StoryCoverImage: React.FC<StoryCoverImageProps> = ({ title = "", tag = "default", size = "full", className = "", style = {} }) => {
  const theme = getGenreTheme(tag);
  const initials = getInitials(title);

  if (size === "thumb") {
    return (
      <div className={className} style={{ width: "100%", height: "100%", borderRadius: "50%", background: `linear-gradient(${theme.gradient})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, color: "#fff", ...style }}>
        {initials}
      </div>
    );
  }

  return (
    <div className={className} style={{ width: "100%", height: "100%", minHeight: "192px", position: "relative", overflow: "hidden", background: `linear-gradient(${theme.gradient})`, borderRadius: "inherit", ...style }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "5rem", fontWeight: 900, color: "rgba(255,255,255,0.12)" }}>{initials}</div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)", padding: "32px 14px 12px" }}>
        <p style={{ margin: 0, color: "#fff", fontSize: "0.9rem", fontWeight: 700, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{title}</p>
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
  isLoading?: boolean;
  setStories: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
}

type StorySentenceSegment = { id: string; text: string; startWordIndex: number; endWordIndex: number; };

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
    segments.push({ id: `${index}-${startWordIndex}-${endWordIndex}`, text: sentence, startWordIndex, endWordIndex });
    wordCursor += wordsInSentence;
  });
  return segments;
};

const getSafeFileName = (title: string, extension: "md" | "docx"): string => {
  const safeTitle = (title || "story").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").toLowerCase();
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

const escapeHtml = (value: string): string => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const createDocxBlob = ({ title, content, tag, author }: { title: string; content: string; tag: string; author: string; }): Blob => {
  const paragraphs = content.split(/\n+/).map((p) => `<p>${escapeHtml(p.trim())}</p>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(title)}</title></head><body><h1>${escapeHtml(title)}</h1><div>Tag: ${escapeHtml(tag)} | Author: ${escapeHtml(author)}</div>${paragraphs}</body></html>`;
  return new Blob([html], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8" });
};

// ─── Main Component ─────────────────────────────────────────────────────────

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({ stories, isLogin, setStories, isLoading, onPublishSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);

  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showRemix, setShowRemix] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [showStoryVisualizer, setShowStoryVisualizer] = useState<boolean>(false);
  const [storyboardScenes] = useState([]); 
  const [storyboardStyleGuide] = useState({});

  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });

  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);

  const [endingsCache, setEndingsCache] = useState<{ [uuid: string]: { style: string; ending: string; fullStory: string }[] }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{ [uuid: string]: string }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");

  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

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

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({ ...prev, [selectedStory.uuid]: selectedStory.content }));
    }
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory, originalStoryContent]);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    const player = audioPlayerRef.current;
    return () => { player?.stop(); };
  }, [location.pathname]);

  useEffect(() => {
    const autoSaveStory = async () => {
      if (!isLogin || !selectedStory || isSavingRef.current || hasSavedSessionRef.current) return;
      if (selectedStory.content === lastSavedContentRef.current) return;

      isSavingRef.current = true;
      try {
        const post: IPost = { ...selectedStory, topic: selectTopics };
        const result = await createPost(post).unwrap();
        if (result?.data?._id) savedPostIdRef.current = result.data._id;
        lastSavedContentRef.current = selectedStory.content;
        hasSavedSessionRef.current = true;
        toast.success("Story auto-saved!");
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        isSavingRef.current = false;
      }
    };
    const timer = setTimeout(() => { autoSaveStory(); }, 1000);
    return () => clearTimeout(timer);
  }, [selectedStory, isLogin, selectTopics, createPost]);

  const sentenceSegments = useMemo(() => buildSentenceSegments(selectedStory?.content ?? ""), [selectedStory?.content]);
  const isNarrationActive = narrationState !== "idle";
  const calculateReadingTime = (content: string): number => Math.max(1, Math.ceil(getWordCount(content) / 200));

  const handelStorySelection = (story: IStories) => setSelectedStory(story);

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) => currentTopics.map((topic, topicIndex) => topicIndex === index ? { ...topic, selected: !topic.selected } : topic));
  };

  const handleAddTopic = () => {
    const title = newTopicTitle.trim();
    if (!title) { toast.error("Please enter a topic."); return; }
    const normalizedTitle = title.startsWith("#") ? title : `#${title}`;
    if (topics.some((topic) => topic.title.toLowerCase() === normalizedTitle.toLowerCase())) { toast.error("This topic already exists."); return; }
    setTopics((current) => [...current, { title: normalizedTitle, className: SELECTED_TOPIC_CLASSES, color: SELECTED_TOPIC_CLASSES, selected: true }]);
    setNewTopicTitle("");
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 2) { toast.error("At least 2 topics are required."); return; }
    setTopics((currentTopics) => currentTopics.filter((_, topicIndex) => topicIndex !== index));
  };

  const handleCopyStory = async () => {
    if (!selectedStory?.content) return;
    await navigator.clipboard.writeText(selectedStory.content);
    setIsCopied(true);
    toast.success("Story copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!selectedStory?.content?.trim()) { toast.error("Story content is empty. Cannot export."); return; }
    try {
      const title = selectedStory.title || "Story";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${selectedStory.tag}"\nauthor: "${authorName}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${selectedStory.content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) { toast.error("Failed to export Markdown."); }
  };

  const handleExportDOCX = () => {
    if (!selectedStory?.content?.trim()) { toast.error("Story content is empty."); return; }
    try {
      const title = selectedStory.title || "Untitled Story";
      const docxBlob = createDocxBlob({ title, content: selectedStory.content, tag: selectedStory.tag || "Story", author: isLogin && profile?.name ? profile.name : "Anonymous" });
      downloadBlob(docxBlob, getSafeFileName(title, "docx"));
      toast.success("DOCX downloaded!");
    } catch (error) { toast.error("Failed to export DOCX."); }
  };

  const handleExportPDF = async () => {
    if (!selectedStory?.content?.trim()) { toast.error("Story content is empty."); return; }
    const toastId = toast.loading("Preparing your premium PDF...");
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const title = selectedStory.title || "Untitled Story";
      doc.setFont("helvetica", "bold"); doc.setFontSize(22);
      const splitTitle = doc.splitTextToSize(title, 170);
      let yCursor = 20;
      splitTitle.forEach((line: string) => { doc.text(line, 20, yCursor); yCursor += 9; });
      yCursor += 10;
      doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      const paragraphs = selectedStory.content.split(/\n+/);
      paragraphs.forEach((para: string) => {
        const lines = doc.splitTextToSize(para.trim(), 170);
        lines.forEach((line: string) => {
          if (yCursor > 270) { doc.addPage(); yCursor = 20; }
          doc.text(line, 20, yCursor); yCursor += 6.5;
        });
        yCursor += 4.5;
      });
      doc.save(`${getSafeFileName(title, "pdf")}`);
      toast.dismiss(toastId);
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  const handelPublishStory = async () => {
    if (!isLogin) { toast.error("Please login to publish the story."); return; }
    if (!selectedStory) { toast.error("No story available."); return; }
    if (selectTopics.length < 2) { toast.error("Please select at least 2 topics."); return; }
    
    setLoading(true);
    try {
      if (savedPostIdRef.current) await deletePost(savedPostIdRef.current).unwrap().catch(() => {});
      const post: IPost = { ...selectedStory, topic: selectTopics, isPublished: true };
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
    clearError();
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Generating alternate endings...");

    try {
      const payload = { title: selectedStory.title, content: originalStoryContent[selectedStory.uuid] || selectedStory.content, tag: selectedStory.tag, language: selectedStory.language || "English" };
      const generationRequest = isLogin ? generateAlternateEndings(payload) : generateFreeAlternateEndings(payload);
      const res = await generationRequest.unwrap();
      
      if (!res || !Array.isArray(res.data)) throw new Error("Unexpected response format.");
      setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
      toast.success("Alternate endings generated successfully!");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
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
    if (!selectedStory || !originalStoryContent[selectedStory.uuid]) return;
    const updatedStory = { ...selectedStory, content: originalStoryContent[selectedStory.uuid] };
    setSelectedStory(updatedStory);
    setStories(stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s)));
    toast.success("Reverted to original story ending!");
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><StoryGeneratingAnimation /></div>;
  if (!stories?.length) return <div className="w-full text-center text-slate-400 py-16">No stories generated yet. Start by entering a prompt ✨</div>;
  if (!selectedStory) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16 relative overflow-hidden box-border">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10 w-full box-border">
        
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 w-full box-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2">{selectedStory?.title}</h1>
              <div className="flex flex-wrap gap-2 select-none">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 py-1 px-3 text-xs font-bold uppercase shadow-sm">🎭 {selectedStory.tag}</span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 py-1 px-3 text-xs font-bold uppercase shadow-sm">🌐 {selectedStory.language || "English"}</span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 py-1 px-3 text-xs font-bold uppercase shadow-sm">😊 {selectedStory.emotions.join(", ")}</span>
                )}
              </div>
            </div>

            <div className="flex justify-start sm:justify-end shrink-0 select-none">
              <div className="flex -space-x-4">
                {stories.map((story) => (
                  <button key={story.uuid} className={`relative w-12 h-12 rounded-full border-2 ${selectedStory.uuid === story.uuid ? "border-blue-600 scale-110 z-10 shadow-md" : "border-white"} hover:scale-110 hover:z-10 transition-all focus:outline-none overflow-hidden cursor-pointer`} onClick={() => handelStorySelection(story)} title={story.title}>
                    <ImageFallback src={story.imageURL} alt={story.title} className="w-full h-full object-cover rounded-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-2xl shadow-sm w-full box-border text-left">
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5 select-none">
              <button onClick={handleCopyStory} className="rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer">{isCopied ? "✓ Copied" : "📋 Copy"}</button>
              <button onClick={handleExportPDF} className="rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer">📄 PDF</button>
              <button onClick={handleExportMarkdown} className="rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer">⬇️ Markdown</button>
              <button onClick={handleExportDOCX} className="rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer">📝 DOCX</button>
              <button onClick={() => setShowWorldMap(true)} className="rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer">🗺️ Map</button>
              <button onClick={() => setShowRemix(true)} className="rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase transition-all cursor-pointer">🔀 Remix</button>
              <button onClick={handelPublishStory} disabled={loading} className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-all cursor-pointer disabled:opacity-50 ml-auto">{loading ? "Publishing..." : "Publish"}</button>
            </div>

            {selectedStory.enhancedPrompt && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative z-10">
                <h4 className="text-sm font-semibold text-indigo-600 mb-2">✨ AI Enhanced Prompt</h4>
                <p className="text-slate-600 text-sm italic whitespace-pre-wrap">{selectedStory.enhancedPrompt}</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed tracking-wide relative z-10 text-sm sm:text-base">
              <p className="break-words whitespace-pre-wrap">
                {sentenceSegments.length > 0 ? sentenceSegments.map((segment) => {
                  const isActiveSentence = isNarrationActive && narrationWordIndex >= segment.startWordIndex && narrationWordIndex <= segment.endWordIndex;
                  return <span key={segment.id} className={isActiveSentence ? "bg-blue-500/20 px-1 py-0.5 rounded text-blue-900 dark:text-blue-100 transition-colors" : undefined}>{DOMPurify.sanitize(segment.text)}</span>;
                }) : DOMPurify.sanitize(selectedStory.content)}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              <AudioPlayer ref={audioPlayerRef} text={selectedStory.content} title={selectedStory.title} onWordIndexChange={setNarrationWordIndex} onPlaybackStateChange={setNarrationState} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">Categorization Indexes</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input type="text" value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTopic()} placeholder="Add related topic" className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button onClick={handleAddTopic} className="rounded-xl px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase hover:bg-slate-800 transition-colors">Add Topic</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold uppercase shadow-sm">
                  <button onClick={() => handleTopicClick(index)} className="font-bold flex items-center gap-1.5 text-blue-800">{topic.selected ? "✓" : "+"} {topic.title}</button>
                  <button onClick={() => handleRemoveTopic(index)} disabled={topics.length <= 2} className="border-l border-blue-200 pl-2 text-red-400 hover:text-red-600 disabled:opacity-50">✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase text-slate-500">Narrative Path Modifications</h3>
                <p className="text-xs text-slate-400 mt-1">Branch out into unique storytelling variations.</p>
              </div>
              {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                <button onClick={handleResetEnding} className="rounded-xl px-3 py-2 bg-red-50 text-red-600 text-xs font-bold uppercase hover:bg-red-100">Revert to Original</button>
              )}
            </div>

            {isGeneratingEndings ? (
              <div className="flex flex-col items-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4" /><p className="text-xs font-bold uppercase text-slate-500">Generating variants...</p></div>
            ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
              <div>
                <div className="flex border-b border-slate-200 mb-5 overflow-x-auto">
                  {["Happy Ending", "Dark Ending", "Plot Twist Ending", "Open Ending", "Cliffhanger Ending"].map((name) => {
                    const isApplied = endingsCache[selectedStory.uuid].find((e) => e.style === name)?.fullStory === selectedStory.content;
                    return (
                      <button key={name} onClick={() => setActiveEndingTab(name)} className={`px-4 py-2 font-bold text-xs uppercase border-b-2 ${activeEndingTab === name ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"}`}>
                        {name} {isApplied && "✓"}
                      </button>
                    );
                  })}
                </div>
                {(() => {
                  const endingData = endingsCache[selectedStory.uuid].find((e) => e.style === activeEndingTab);
                  if (!endingData) return null;
                  return (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold uppercase text-slate-500">{activeEndingTab} Excerpt</h4>
                        {selectedStory.content !== endingData.fullStory && <button onClick={() => handleApplyEnding(endingData)} className="px-3 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded-xl">Apply Branch</button>}
                      </div>
                      <p className="text-sm italic text-slate-600 bg-white p-4 rounded-xl border border-slate-200 mb-4">"{endingData.ending}"</p>
                      <details className="border border-slate-200 rounded-xl bg-white"><summary className="p-3 text-xs font-bold text-slate-400 uppercase cursor-pointer">Preview Full Story</summary><div className="p-4 border-t border-slate-200 text-sm text-slate-600">{endingData.fullStory}</div></details>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <button onClick={handleGenerateAlternateEndings} className="rounded-xl px-5 py-3 bg-blue-600 text-white text-xs font-bold uppercase">Transform Endings</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-6">
          <h2 className="text-sm font-bold uppercase text-slate-500 mb-4">Compilation Preview</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <div className="h-48 overflow-hidden relative">
              <ImageFallback src={selectedStory.imageURL} alt={selectedStory.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-100 text-purple-700 py-1 px-2 text-xs font-bold rounded-lg uppercase">{selectedStory.tag}</span>
                <span className="bg-slate-100 text-slate-600 py-1 px-2 text-xs font-bold rounded-lg uppercase">⏱️ {calculateReadingTime(selectedStory.content)} Min</span>
                <div className="ml-auto"><BookmarkButton storyId={selectedStory.uuid} /></div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{selectedStory.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{getShortenedText(selectedStory.content)}</p>
            </div>
          </div>
        </div>
      </div>

      {showWorldMap && <StoryWorldMap story={selectedStory.content} title={selectedStory.title} onClose={() => setShowWorldMap(false)} />}
      
      {/* We cast StoryRemix to generic any since the specific modal typing was heavily mangled in the Git merge */}
      {showRemix && React.createElement(StoryRemix as any, { story: selectedStory.content, title: selectedStory.title, selectedStory: selectedStory, onClose: () => setShowRemix(false), onApplyRemix: (content: string) => { const updatedStory = { ...selectedStory, content }; setSelectedStory(updatedStory); setStories(stories.map((story) => (story.uuid === selectedStory.uuid ? updatedStory : story))); setShowRemix(false); } })}

      {showStoryVisualizer && storyboardScenes.length > 0 && <StoryVisualizer title={selectedStory.title} scenes={storyboardScenes} styleGuide={storyboardStyleGuide} onClose={() => setShowStoryVisualizer(false)} />}

      <Toaster position="top-right" />
    </div>
  );
};

export default StoriesViewComponent;