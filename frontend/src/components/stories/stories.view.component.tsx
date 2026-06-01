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
    segments.push({ id: `${index}-${startWordIndex}-${endWordIndex}`, text: sentence, startWordIndex, endWordIndex });
    wordCursor += wordsInSentence;
  });
  return segments;
};

import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import { useUpdatePostMutation } from "../../redux/apis/post.api";


import ImageFallback from "../ImageFallback";
export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
  genre?: string;
  enhancedPrompt?: string;
}

const StoriesViewComponent: React.FC<{
  stories: IStories[];
  setStories: React.Dispatch<React.SetStateAction<IStories[]>>;
  isLogin?: boolean;
  isLoading?: boolean;
  onPublishSuccess?: () => void;
}> = ({
  stories,
  setStories,
  isLogin,
  isLoading,
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
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
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
    if (!selectedStory?.uuid) return;
    try {
      const storedDraftId = sessionStorage.getItem(`story_spark_autosave_draft_id:${selectedStory.uuid}`);
      if (storedDraftId) savedPostIdRef.current = storedDraftId;
    } catch (error) {
      console.warn("Failed to read autosave draft id from sessionStorage", error);
    }
  }, [selectedStory?.uuid]);

  useEffect(() => {
    const autoSaveStory = async () => {
      if (!isLogin || !selectedStory) return;
      if (selectedStory.content === lastSavedContentRef.current) return;
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      const post: any = { ...selectedStory, topic: selectTopics, isPublished: false };
      try {
        if (savedPostIdRef.current) {
          await updatePost({ id: savedPostIdRef.current, data: post as unknown as Record<string, unknown> }).unwrap();
        } else {
          const result = await createPost(post).unwrap();
          const createdId = result?.data?._id;
          if (createdId) {
            savedPostIdRef.current = createdId;
            try {
              sessionStorage.setItem(`story_spark_autosave_draft_id:${selectedStory.uuid}`, createdId);
            } catch (storageError) {
              console.warn("Failed to persist autosave draft id to sessionStorage", storageError);
            }
          }
        }
        lastSavedContentRef.current = selectedStory.content;
        if (!hasSavedSessionRef.current) {
          hasSavedSessionRef.current = true;
          toast.success("Story auto-saved!");
        }
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        isSavingRef.current = false;
      }
    };
    const timer = setTimeout(() => { autoSaveStory(); }, 1000);
    return () => clearTimeout(timer);
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost, updatePost]);

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
      toast.dismiss(toastId);
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

  const handleExportTXT = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const txtContent = `Title: ${title}\nAuthor: ${authorName}\nDate: ${isoDate}\n\n${content}\n`;
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "story"}.txt`);
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); URL.revokeObjectURL(url);
      toast.success("TXT downloaded!");
    } catch (error) { console.error(error); toast.error("Failed to export TXT."); }
  };

  const handleExportDOCX = async () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
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
      link.setAttribute("download", `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "story"}.docx`);
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
  };

  const handelPublishStory = async () => {
    if (!isLogin) { toast.error("Please login to publish the story."); return; }
    if (!selectedStory) { toast.error("No story available. Please generate a story first."); return; }
    if (selectTopics.length < 2) { toast.error("Please select at least 2 topics."); return; }
    const post: any = { ...selectedStory, topic: selectTopics, isPublished: true };
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
              <h3 className="text-xl font-bold text-slate-200 relative z-10">Generated Story</h3>
              <div className="flex flex-wrap items-center gap-2 relative z-50">
                <button type="button" className="rounded-lg px-4 py-2 bg-slate-700 text-slate-200 font-semibold cursor-pointer hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCopyStory} disabled={!selectedStory}>
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 bg-indigo-700 text-slate-200 font-semibold cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={!selectedStory}
                  >
                    ⬇️ Export <i className="fa-solid fa-chevron-down text-xs ml-1"></i>
                  </button>
                  <div className={`absolute top-full mt-2 left-0 w-48 bg-slate-800/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col transition-all duration-300 origin-top-left ${showExportMenu ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                    <button type="button" className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700/50" onClick={() => { handleExportPDF(); setShowExportMenu(false); }}>
                      📄 PDF
                    </button>
                    <button type="button" className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700/50" onClick={() => { handleExportDOCX(); setShowExportMenu(false); }}>
                      📘 Word (DOCX)
                    </button>
                    <button type="button" className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700/50" onClick={() => { handleExportMarkdown(); setShowExportMenu(false); }}>
                      Ⓜ️ Markdown
                    </button>
                    <button type="button" className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-3" onClick={() => { handleExportTXT(); setShowExportMenu(false); }}>
                      📝 Plain Text
                    </button>
                  </div>
                </div>
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
                <button type="button" className="rounded-lg px-4 py-2 bg-amber-700 text-slate-200 font-semibold cursor-pointer hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => toast.error("EPUB export is not available yet")} disabled={!selectedStory}>
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
                    const isActiveSentence = isNarrationActive && narrationWordIndex >= segment.startWordIndex && narrationWordIndex <= segment.endWordIndex;
                    
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
              </p>
            </div>

            <div className="relative z-10 mt-6">
              <AudioPlayer ref={audioPlayerRef} text={selectedStory.content} title={selectedStory.title} onWordIndexChange={setNarrationWordIndex} onPlaybackStateChange={setNarrationState} />
            </div>
            <div className="mt-6"><ContinueStoryButton /></div>

            {selectedStory.enhancedPrompt && (
              <div className="mt-6 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl relative z-10">
                <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                  <i className="fas fa-wand-magic-sparkles"></i> AI Enhanced Prompt
                </h4>
                <p className="text-slate-300 text-sm italic break-words whitespace-pre-wrap">{selectedStory.enhancedPrompt}</p>
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
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesViewComponent;
