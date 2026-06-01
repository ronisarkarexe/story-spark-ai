import React, { useEffect, useState, useRef, useMemo } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import StoryWorldMap from "../story-map/StoryWorldMap";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStory } from "../../redux/slices/storySlice";
import ContinueStoryButton from "../story/ContinueStoryButton";
import StoryTradingCard from "../cards/StoryTradingCard";
import CardCollection from "../cards/CardCollection";
import StoryCoverImage from "./StoryCoverImage";

ImageFallback
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";

// ─── StoryCoverImage ────────────────────────────────────────────────────────

const GENRE_THEMES: Record<string, { gradient: string; accent: string; icon: string }> = {
  fantasy:    { gradient: "135deg, #667eea 0%, #764ba2 50%, #f093fb 100%", accent: "#c084fc", icon: "✦" },
  romance:    { gradient: "135deg, #f857a6 0%, #ff5858 50%, #ffb347 100%", accent: "#fb7185", icon: "♡" },
  horror:     { gradient: "135deg, #0f0c29 0%, #302b63 50%, #24243e 100%", accent: "#a855f7", icon: "☽" },
  thriller:   { gradient: "135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%", accent: "#38bdf8", icon: "◈" },
  mystery:    { gradient: "135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%", accent: "#60a5fa", icon: "◎" },
  adventure:  { gradient: "135deg, #f7971e 0%, #ffd200 50%, #21d4fd 100%", accent: "#fbbf24", icon: "⊕" },
  scifi:      { gradient: "135deg, #0f2027 0%, #203a43 50%, #2c5364 100%", accent: "#22d3ee", icon: "◇" },
  "sci-fi":   { gradient: "135deg, #0f2027 0%, #203a43 50%, #2c5364 100%", accent: "#22d3ee", icon: "◇" },
  comedy:     { gradient: "135deg, #fddb92 0%, #d1fdff 50%, #f5af19 100%", accent: "#f59e0b", icon: "◉" },
  drama:      { gradient: "135deg, #8e2de2 0%, #4a00e0 50%, #3b82f6 100%", accent: "#a78bfa", icon: "✧" },
  historical: { gradient: "135deg, #b79891 0%, #94716b 50%, #6b4226 100%", accent: "#d4a574", icon: "⬡" },
  default:    { gradient: "135deg, #667eea 0%, #764ba2 50%, #4facfe 100%", accent: "#a78bfa", icon: "✦" },
};

function getGenreTheme(tag?: string) {
  const key = (tag || "default").toLowerCase().trim();
  return GENRE_THEMES[key] ?? GENRE_THEMES.default;
}

function getInitials(title?: string): string {
  if (!title || !title.trim()) return "?";
  const words = title.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

interface StoryCoverImageProps {
  title?: string;
  tag?: string;
  imageUrl?: string;
  size?: "full" | "thumb";
  className?: string;
  style?: React.CSSProperties;
}

const StoryCoverImage: React.FC<StoryCoverImageProps> = ({
  title = "",
  tag = "default",
  imageUrl = "",
  size = "full",
  className = "",
  style = {},
}) => {
  const theme = getGenreTheme(tag);
  const initials = getInitials(title);

  // Fallback high-fidelity asset image link requested in issue #1246 description
  const defaultPlaceholder = "https://images.unsplash.com/photo-11455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80";
  const finalImageSrc = imageUrl && imageUrl.trim() !== "" && !imageUrl.includes("placeholder.com") ? imageUrl : defaultPlaceholder;

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
      {/* Decorative orbs */}
      <div style={{
        position: "absolute", top: "-30%", right: "-15%",
        width: "60%", height: "120%",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", left: "-10%",
        width: "45%", height: "80%",
        background: "rgba(0,0,0,0.12)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      {/* Accent glyph */}
      <div style={{
        position: "absolute", top: "12px", right: "16px",
        fontSize: "3.5rem",
        color: theme.accent,
        opacity: 0.35,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        fontWeight: 300,
      }}>
        {theme.icon}
      </div>

      {/* Genre pill */}
      <div style={{
        position: "absolute", top: "14px", left: "14px",
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
      }}>
        {tag}
      </div>

      {/* Large faded initials centered if background asset image fails to show up */}
      {!imageUrl && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontSize: "5rem",
            fontWeight: 900,
            color: "rgba(255,255,255,0.12)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}>
            {initials}
          </div>
        </div>
      )}

      {/* Title at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
        padding: "40px 14px 14px",
      }}>
        <p style={{
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
        }}>
          {title}
        </p>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

import ImageFallback from "../ImageFallback";
export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
import React from "react";
import { Post } from "../../models/post";
import { useNavigate } from "react-router-dom";

interface IRelatedStoriesComponentProps {
  posts: Post[],
  currentPostId: string;
}

const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({
  posts, currentPostId,
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
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{ [uuid: string]: string }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({ ...prev, [selectedStory.uuid]: selectedStory.content }));
    }
  }, [selectedStory, originalStoryContent]);

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
        setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
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

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    const player = audioPlayerRef.current;
    return () => { player?.stop(); };
  }, [location.pathname]);

  useEffect(() => { setNarrationWordIndex(0); setNarrationState("idle"); }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => buildSentenceSegments(selectedStory?.content ?? ""), [selectedStory?.content]);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
      dispatch(setStory({
        id: stories[0].uuid,
        title: stories[0].title,
        chapters: [{ id: 1, title: "Chapter 1", content: stories[0].content, createdAt: new Date().toISOString() }],
      }));
    } else {
      setSelectedStory(null);
    }
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
  }, [stories, dispatch]);

  useEffect(() => {
    const autoSaveStory = async () => {
      if (!isLogin || !selectedStory) return;
      if (selectedStory.content === lastSavedContentRef.current) return;
      if (hasSavedSessionRef.current) return;
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      const post: IPost = { ...selectedStory, topic: selectTopics, isPublished: false };
      try {
        const result = await createPost(post).unwrap();
        if (result && result.data && result.data._id) savedPostIdRef.current = result.data._id;
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
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost]);

  const handelStorySelection = (story: IStories) => { setSelectedStory(story); };

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic, topicIndex) =>
        topicIndex === index ? { ...topic, selected: !topic.selected } : topic
      )
    );
  };

  const handleAddTopic = () => {
    const title = newTopicTitle.trim();
    if (!title) { toast.error("Please enter a topic."); return; }
    const normalizedTitle = title.startsWith("#") ? title : `#${title}`;
    const topicExists = topics.some((topic) => topic.title.toLowerCase() === normalizedTitle.toLowerCase());
    if (topicExists) { toast.error("This topic already exists."); return; }
    setTopics((currentTopics) => [...currentTopics, { title: normalizedTitle, className: SELECTED_TOPIC_CLASSES, color: SELECTED_TOPIC_CLASSES, selected: true }]);
    setNewTopicTitle("");
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 2) { toast.error("At least 2 topics are required."); return; }
    setTopics((currentTopics) => currentTopics.filter((_, topicIndex) => topicIndex !== index));
  };

  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      await navigator.clipboard.writeText(selectedStory.content);
      setIsCopied(true);
      toast.success("Story copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
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
      try { logoImg = await loadImageWithTimeout(logo); } catch (err) { console.warn("Failed to load logo", err); }

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const title = selectedStory.title || "Untitled Story";
      const content = selectedStory.content || "";
      const tag = (selectedStory.tag || "STORY").toUpperCase();
      const leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20;
      const printableWidth = 210 - leftMargin - rightMargin;
      const maxY = 297 - bottomMargin - 10;
      let yCursor = topMargin;

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
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(30, 41, 59);
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

      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`${safeTitle}.pdf`);
      toast.withTimeout(toastId);
      toast.success("Premium PDF downloaded!");
    } catch (error) {
      console.error(error); toast.dismiss(toastId); toast.error("Failed to export PDF.");
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
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
      link.setAttribute("download", `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "story"}.md`);
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); URL.revokeObjectURL(url);
      toast.success("Markdown downloaded!");
    } catch (error) { console.error(error); toast.error("Failed to export Markdown."); }
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
      if (result) { toast.success("Story published successfully!"); setStories([]); setSelectedStory(null); onPublishSuccess?.(); }
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const calculateReadingTime = (content: string): number => Math.max(1, Math.ceil(getWordCount(content) / 200));
  const isNarrationActive = narrationState !== "idle";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <StoryGeneratingAnimation />
      </div>
    );
  }

  if (!stories || !stories.length) {
    return (
      <div className="text-center text-gray-400 py-10">
        No stories generated yet. Start by entering a prompt ✨
      </div>
    );
  }

  if (!selectedStory) {
    return null;
  }
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post) => post._id !== currentPostId);

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
                  🎭 {selectedStory.tag}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                  🌐 {selectedStory.language || "English"}
                </span>
              </div>
            </div>
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
                      <ImageFallback
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
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-purple-700 text-slate-200 font-semibold cursor-pointer hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportPDF}
                  disabled={!selectedStory}
                >
                  📄 Export PDF
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-indigo-700 text-slate-200 font-semibold cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportMarkdown}
                  disabled={!selectedStory}
                >
            ⬇️ Export Markdown
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-pink-600 text-slate-200 font-semibold cursor-pointer hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleShareStory("twitter")} disabled={!selectedStory}>
                  🐦 Share
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-violet-700 text-slate-200 font-semibold cursor-pointer hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setShowWorldMap(true)} disabled={!selectedStory}>
                  🗺️ World Map
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-fuchsia-700 text-slate-200 font-semibold cursor-pointer hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setShowRemix(true)} disabled={!selectedStory}>
                  🔀 Remix
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-sky-700 text-slate-200 font-semibold cursor-pointer hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleExportDOCX} disabled={!selectedStory}>
                  📝 Export Word
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-slate-700 text-slate-200 font-semibold cursor-pointer hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleExportTXT} disabled={!selectedStory}>
                  📄 Export TXT
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-amber-700 text-slate-200 font-semibold cursor-pointer hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleExportEPUB} disabled={!selectedStory}>
                  📚 Export EPUB
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-violet-700 text-slate-200 font-semibold cursor-pointer hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setShowWorldMap(true)} disabled={!selectedStory}>
                  🗺️ World Map
                </button>
                <button type="button" className="rounded-lg px-4 py-2 bg-fuchsia-700 text-slate-200 font-semibold cursor-pointer hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setShowRemix(true)} disabled={!selectedStory}>
                  🔀 Remix
                </button>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-violet-700 text-slate-200 font-semibold cursor-pointer hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowWorldMap(true)}
                  disabled={!selectedStory}
                >
                  🗺️ World Map
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
            <div id="story-content" className="prose prose-invert max-w-none text-slate-300 leading-relaxed tracking-wide relative z-10">
              <p className="break-words whitespace-pre-wrap">
                {sentenceSegments.length > 0 ? (
                  sentenceSegments.map((segment: StorySentenceSegment) => {
                    const isActiveSentence =
                      isNarrationActive &&
                      narrationWordIndex >= segment.startWordIndex &&
                      narrationWordIndex <= segment.endWordIndex;

                    return (
                      <span
                        key={segment.id}
                        className={
                          isActiveSentence
                            ? "rounded-md bg-indigo-500/20 px-0.5 py-0.5 text-indigo-100 ring-1 ring-indigo-400/30"
                            : undefined
                        }
                      >
                        {segment.text}
                      </span>
                    );
                  })
                ) : (
                  selectedStory.content
                )}
              </p>
            </div>

            <div className="relative z-10 mt-6">
              <AudioPlayer
                ref={audioPlayerRef}
                text={selectedStory.content}
                title={selectedStory.title}
                onWordIndexChange={setNarrationWordIndex}
                onPlaybackStateChange={setNarrationState}
    <div className="grid grid-cols-2 gap-6">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post: Post) => (
          <div
            onClick={() => navigate(`/post/${post._id}`)}
            key={post._id}
            className="cursor-pointer bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full"
          >
            <div className="relative overflow-hidden">
              <img
                src={post.imageURL}
                alt="Related Story"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 pointer-events-none"></div>
            </div>

            {selectedStory.enhancedPrompt && (
              <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl relative z-10">
                <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                  <i className="fas fa-wand-magic-sparkles"></i> AI Enhanced Prompt
                </h4>
                <p className="text-slate-300 text-sm italic break-words whitespace-pre-wrap">{selectedStory.enhancedPrompt}</p>
              </div>
            )}

            <div id="story-content" className="prose prose-invert max-w-none text-slate-300 leading-relaxed tracking-wide relative z-10">
              <p className="break-words whitespace-pre-wrap">
                {sentenceSegments.length > 0 ? (
                  sentenceSegments.map((segment: StorySentenceSegment) => {
                    const isActiveSentence = isNarrationActive && narrationWordIndex >= segment.startWordIndex && narrationWordIndex <= segment.endWordIndex;
                    
                    // Split the sentence text into word tokens, preserving whitespace
                    const rawParts = segment.text.split(/(\s+)/);
                    let wordOffset = 0;

                    return (
                      <span
                        key={segment.id}
                        className={isActiveSentence ? "transition-colors duration-300 text-slate-100" : undefined}
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
                                className="bg-indigo-500/20 text-indigo-300 rounded px-0.5 transition-all duration-150"
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
                            className="bg-indigo-500/20 text-indigo-300 rounded px-0.5 transition-all duration-150"
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
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Preview ── */}
        <div className="col-span-1 lg:col-span-4">
          <div className="mb-5">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Preview
            </h1>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden group">
            <div className="relative flex flex-col rounded-lg">
              <div className="relative m-3 overflow-hidden text-white rounded-xl" style={{ height: "192px" }}>
                {/* ── Updated Cover Image with dynamic imageURL support ── */}
                <StoryCoverImage
                  title={selectedStory.title}
                  tag={selectedStory.tag}
                  imageUrl={selectedStory.imageURL}
                  className="transition-transform duration-500 group-hover:scale-105"
                  style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
                />
              </div>

              <div className="px-3 py-1">
                <div className="flex justify-between items-center mb-2 w-full">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      {selectedStory.tag.toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-indigo-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      🌐 {(selectedStory.language || "English").toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-700 py-1 px-2.5 text-xs font-medium text-slate-300 shadow-sm gap-1">
                      ⏱️ {calculateReadingTime(selectedStory.content)} min read
                    </div>
                  </div>
                  <div><BookmarkButton storyId={selectedStory.uuid} /></div>
                </div>
                <h6 className="mb-1 text-gray-300 text-xl font-semibold">{selectedStory.title}</h6>
                <p className="text-gray-400 font-light break-words text-sm sm:text-base">{getShortenedText(selectedStory.content)}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-slate-500 col-span-2 py-8">No related stories found.</p>
      )}
    </div>
  );
};

export default RelatedStoriesComponent;
