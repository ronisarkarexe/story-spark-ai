import React, { useEffect, useState, useRef, useMemo } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
import StoryWorldMap from "../story-map/StoryWorldMap";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation } from "react-router-dom";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
import ImageFallback from "../ImageFallback";
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
  isLoading?: boolean;
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

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
  isLoading,
  onPublishSuccess,
}) => {
  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // Start with a clean state that adapts dynamically
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
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
    const player = audioPlayerRef.current;
    return () => {
      player?.stop();
    };
  }, [location.pathname]);

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

  const calculateReadingTime = (content: string): number => {
    const words = getWordCount(content);
    return Math.max(1, Math.ceil(words / 200));
  };

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
                  className="rounded-xl px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50"
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
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-white/[0.01] border border-dashed border-slate-200 dark:border-white/5 rounded-xl select-none w-full box-border">
                  <button
                    type="button"
                    onClick={handleGenerateAlternateEndings}
                    className="rounded-xl px-5 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 transition-all duration-150 hover:scale-105 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
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

        <div className="col-span-1 lg:col-span-4">
          <GeneratedStoryTimeline
            content={selectedStory.content}
            title={selectedStory.title}
            narrationState={narrationState}
            narrationWordIndex={narrationWordIndex}
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-500">
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
                <button type="button" className="rounded-xl px-3 py-2 bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white border border-transparent text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm" onClick={() => setShowContinueModal(true)}>
                  ✦ Continue →
                </button>
                <button type="button" className={`rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50 ${loading ? 'opacity-70' : ''}`} onClick={handelPublishStory} disabled={loading}>
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
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-700/30">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          {activeEndingTab} Suggestion
                        </h4>
                        <div>
                          {isCurrentlyApplied ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                              <i className="fa-solid fa-check"></i> Applied to Story
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyEnding(currentEndingData)}
                              className="rounded-lg px-4 py-2 bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md hover:shadow-purple-500/20"
                            >
                              Apply to Story
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Glassmorphic Anti-Gravity Scroll Control Panel Dock */}
                        <div className="bg-slate-100 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-xl select-none">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                              Anti-Gravity Engine
                            </span>
                            <span className="text-[9px] bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase">
                              {isAntiGravityPlaying ? "Active" : "Idle"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Speed: {antiGravitySpeed.toFixed(1)}x
                              </span>
                              <input
                                type="range"
                                min="0.5"
                                max="5.0"
                                step="0.1"
                                value={antiGravitySpeed}
                                onChange={(e) => setAntiGravitySpeed(parseFloat(e.target.value))}
                                disabled={!isAntiGravityPlaying}
                                className="w-24 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAntiGravityPlaying(!isAntiGravityPlaying)}
                              className={`px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                isAntiGravityPlaying
                                  ? "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20 active:scale-95"
                                  : "bg-linear-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 border border-indigo-500/30 active:scale-95"
                              }`}
                            >
                              {isAntiGravityPlaying ? (
                                <>
                                  <i className="fa-solid fa-pause text-[9px] animate-pulse" />
                                  <span>Pause Engine</span>
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-play text-[9px]" />
                                  <span>Engage Scroll</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div ref={storyScrollContainerRef} className="bg-white dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed text-slate-700 dark:text-slate-300 text-sm md:text-base italic shadow-inner whitespace-pre-wrap max-h-[520px] overflow-y-auto">
                          <p>{currentEndingData.ending}</p>
                        </div>
                        
                        <div>
                          <details className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950/20">
                            <summary className="list-none flex items-center justify-between p-3 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer select-none">
                              <span>PREVIEW FULL STORY WITH THIS ENDING</span>
                              <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
                            </summary>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
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
              <div className="flex flex-col items-center justify-center py-8 bg-slate-100 dark:bg-slate-900/20 border border-dashed border-slate-300 dark:border-slate-700/40 rounded-xl">
                <button
                  type="button"
                  onClick={handleGenerateAlternateEndings}
                  disabled={isGeneratingEndings}
                  className="rounded-xl px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Alternate Endings
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center max-w-sm px-4 leading-relaxed">
                  Uses the story context to produce 5 unique ending variations (Happy, Dark, Plot Twist, Open, Cliffhanger) for comparison.
                </p>
              </div>
            )}
          </div>

          {/* Topics management section */}
          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm w-full box-border text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-4 select-none">Categorization Indexes</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-5 select-none w-full box-border">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(event) => setNewTopicTitle(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); handleAddTopic(); } }}
                placeholder="Add contextual keyword index tag..."
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-blue-500/40 focus:outline-none transition-colors"
              />
              <button type="button" className="rounded-xl px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors active:scale-[0.98] cursor-pointer" onClick={handleAddTopic}>
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2 w-full box-border">
              {topics.length > 0 ? (
                topics.map((topic, index) => (
                  <span key={index} className={`inline-flex items-center gap-2 px-3 py-1.5 ${topic.className} rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border border-slate-200 dark:border-transparent select-none`}>
                    <button type="button" className="cursor-pointer font-bold uppercase flex items-center gap-1.5" onClick={() => handleTopicClick(index)}>
                      {topic.selected ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-plus" />} {topic.title}
                    </button>
                    <button type="button" className="cursor-pointer border-l border-current/20 pl-2 opacity-50 hover:opacity-100 disabled:cursor-not-allowed" onClick={() => handleRemoveTopic(index)} disabled={topics.length <= 2} aria-label={`Remove ${topic.title}`}>
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 m-0">No keyword topics registered.</p>
              )}
            </div>
          </div>

        </div>

        {/* ── Right Column ── */}
        <div className="col-span-1 lg:col-span-4">
          <div className="mb-5">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-500">
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
