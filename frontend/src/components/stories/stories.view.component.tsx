import React, { useEffect, useState } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation } from "../../redux/apis/post.api";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import jsPDF from "jspdf";
import BookmarkButton from "../BookmarkButton";
import logo from "../../assets/logoNew.png";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";

import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";
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
  isLoading?: boolean;
}

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
  isLoading,
  onPublishSuccess,
}) => {
  // Start with a clean state that adapts dynamically
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  // Alternate ending state & hooks
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{
    [uuid: string]: string;
  }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");

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

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Generating alternate endings...");
    try {
      const payload = {
        title: selectedStory.title,
        content: originalStoryContent[selectedStory.uuid] || selectedStory.content,
        tag: selectedStory.tag,
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

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  // Sync state instantly whenever a new template is submitted or selected
  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    } else {
      setSelectedStory(null);
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
}, [selectedStory, isLogin, selectTopics, createPost]);

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
    if (!selectedStory) {
      toast.error("No story available to export.");
      return;
    }

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

      const cleanTitle = title.replace(/"/g, '\\"');
      const cleanTag = tag.replace(/"/g, '\\"');
      const cleanAuthor = authorName.replace(/"/g, '\\"');

      const markdownContent = `---
title: "${cleanTitle}"
tag: "${cleanTag}"
author: "${cleanAuthor}"
date: "${isoDate}"
---

# ${title}

${content}
`;

      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const fileName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "story";
      link.setAttribute("download", `${fileName}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Markdown downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Markdown.");
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
    <div className="mt-16 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto pb-10 font-[EB_Garamond]">
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
              <h1 className="text-2xl font-bold font-[Playfair_Display] text-[#8b1a1a] dark:text-[#c9a227]">
                {selectedStory?.title}
              </h1>
            </div>
            <div className="flex justify-start sm:justify-end">
              <div className="flex -space-x-5">
                {stories && stories.length > 0 && (
                  stories.map((story) => (
                    <button
                      key={story.uuid}
                      className={`relative w-16 h-16 rounded-full border-2 ${
                        selectedStory?.uuid === story.uuid
                          ? "border-[#c9a227] scale-110 shadow-lg"
                          : "border-[#d4b896]"
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

          <div className="parchment-card p-8 relative overflow-hidden bg-[#f5ead6] border border-[#d4b896] dark:bg-[#2c1810] dark:border-[#5c3d2e]">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#c9a227]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-[#8b1a1a]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#d4b896]/40 pb-4 dark:border-[#5c3d2e]/40">
              <h3 className="text-lg font-bold font-[Playfair_Display] text-[#2c1810] relative z-10 dark:text-[#f5ead6]">
                Generated Story
              </h3>
              <div className="flex flex-wrap items-center gap-2 relative z-10 font-[Cormorant_Garamond]">
                <button
                  type="button"
                  className="parchment-btn text-xs"
                  onClick={handleCopyStory}
                  disabled={!selectedStory}
                >
                  {isCopied ? "✓ Copied" : "📋 Copy"}
                </button>
                <button
                  type="button"
                  className="parchment-btn text-xs"
                  onClick={handleExportPDF}
                  disabled={!selectedStory}
                >
                  📄 Export PDF
                </button>
                <button
                  type="button"
                  className="parchment-btn text-xs"
                  onClick={handleExportMarkdown}
                  disabled={!selectedStory}
                >
                  ⬇️ Export MD
                </button>
                <button
                  type="button"
                  id="publish-story-btn"
                  className={`parchment-btn-primary px-5 py-2 text-xs flex items-center space-x-2 ${
                    loading ? "opacity-50" : ""
                  }`}
                  onClick={handelPublishStory}
                  disabled={loading || !selectedStory}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
            <div id="story-content" className="prose max-w-none text-[#2c1810] font-[EB_Garamond] text-lg leading-relaxed tracking-wide relative z-10 dark:text-[#f5ead6]">
              <p className="break-words first-letter:text-4xl first-letter:font-bold first-letter:text-[#8b1a1a] dark:first-letter:text-[#c9a227] first-letter:mr-1 first-letter:float-left">{selectedStory.content}</p>
            </div>
          </div>
          <div className="mt-7">
            <div className="parchment-card p-6 mb-8 bg-[#f5ead6] border border-[#d4b896] dark:bg-[#2c1810] dark:border-[#5c3d2e]">
              <h3 className="text-lg font-bold font-[Playfair_Display] text-[#2c1810] mb-4 dark:text-[#f5ead6]">
                Select Topics
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4 font-[Cormorant_Garamond]">
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
                  className="flex-1 rounded border border-[#d4b896] bg-[#fdf8f0] px-4 py-2 text-sm text-[#2c1810] placeholder:text-[#5c3d2e]/40 focus:border-[#8b1a1a] focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20 dark:bg-[#1a0f08] dark:border-[#5c3d2e] dark:text-[#f5ead6] dark:placeholder:text-[#d4b896]/30 dark:focus:border-[#c9a227] dark:focus:ring-[#c9a227]/20 font-[EB_Garamond]"
                />
                <button
                  type="button"
                  className="parchment-btn-primary px-5 py-2 text-xs"
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
                        className={`inline-flex items-center gap-2 px-3 py-1 bg-[#fdf8f0] border border-[#d4b896] text-[#5c3d2e] rounded-full text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 shadow-sm dark:bg-[#1a0f08] dark:border-[#5c3d2e] dark:text-[#d4b896] font-[Cormorant_Garamond]`}
                      >
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => handleTopicClick(index)}
                        >
                          {topic.selected ? (
                            <i className="fa-solid fa-check text-emerald-600 dark:text-emerald-400"></i>
                          ) : (
                            <i className="fa-solid fa-plus text-[#8b5e3c]"></i>
                          )}{" "}
                          {topic.title}
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer border-l border-[#d4b896] pl-2 disabled:cursor-not-allowed disabled:opacity-40 hover:text-red-600 dark:border-[#5c3d2e]"
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
                  <p className="text-[#5c3d2e]/60 dark:text-[#d4b896]/60">
                    No topics available. Please generate a story first.
                  </p>
                )}
              </div>
            </div>

            {/* Alternate Endings Section */}
            {selectedStory && (
              <div className="parchment-card p-6 mt-8 relative overflow-hidden bg-[#f5ead6] border border-[#d4b896] dark:bg-[#2c1810] dark:border-[#5c3d2e]">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#8b1a1a]/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6] flex items-center gap-2">
                      Alternate Endings
                    </h3>
                    <p className="text-xs text-[#5c3d2e]/80 dark:text-[#d4b896]/80 font-[EB_Garamond] mt-1">
                      Explore alternate narrative styles for your story context.
                    </p>
                  </div>
                  {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                    <button
                      type="button"
                      onClick={handleResetEnding}
                      className="parchment-btn border-red-800 text-red-700 hover:bg-red-50 text-xs flex items-center gap-1.5 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      <i className="fa-solid fa-rotate-left"></i> Reset to Original
                    </button>
                  )}
                </div>

                {isGeneratingEndings ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8b1a1a] dark:border-[#c9a227] mb-4"></div>
                    <p className="text-[#2c1810] dark:text-[#f5ead6] text-sm font-semibold animate-pulse">
                      Generating alternate endings...
                    </p>
                  </div>
                ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
                  <div>
                    {/* Tabs */}
                    <div className="flex border-b border-[#d4b896] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none dark:border-[#5c3d2e]">
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
                            className={`px-5 py-3 font-semibold font-[Cormorant_Garamond] uppercase tracking-wider text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                              activeEndingTab === s.name
                                ? "border-[#8b1a1a] text-[#8b1a1a] bg-[#8b1a1a]/5 dark:border-[#c9a227] dark:text-[#c9a227]"
                                : "border-transparent text-[#5c3d2e] hover:text-[#2c1810] dark:text-[#d4b896] dark:hover:text-[#f5ead6]"
                            }`}
                          >
                            <span>{s.name}</span>
                            {isApplied && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
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
                        <div className="bg-[#fdf8f0] rounded-xl p-6 border border-[#d4b896] dark:bg-[#1a0f08] dark:border-[#5c3d2e]">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold font-[Playfair_Display] text-[#2c1810] dark:text-[#f5ead6]">
                              {activeEndingTab} Suggestion
                            </h4>
                            <div className="font-[Cormorant_Garamond]">
                              {isCurrentlyApplied ? (
                                <span className="text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 dark:text-emerald-400">
                                  <i className="fa-solid fa-check"></i> Applied to Story
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleApplyEnding(currentEndingData)}
                                  className="parchment-btn-primary px-4 py-2 text-xs"
                                >
                                  Apply to Story
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4 font-[EB_Garamond]">
                            <div className="bg-[#fdf8f0]/40 p-5 rounded-xl border border-[#d4b896]/60 leading-relaxed text-[#3d2314] text-sm md:text-base italic shadow-inner whitespace-pre-wrap dark:bg-[#1a0f08]/40 dark:border-[#5c3d2e]/60 dark:text-[#d4b896]">
                              <p>{currentEndingData.ending}</p>
                            </div>
                            
                            <div>
                              <details className="group border border-[#d4b896] rounded-lg overflow-hidden bg-[#fdf8f0]/20 dark:border-[#5c3d2e]">
                                <summary className="list-none flex items-center justify-between p-3 text-xs font-bold font-[Cormorant_Garamond] text-[#8b5e3c] hover:text-[#2c1810] cursor-pointer select-none dark:text-[#d4b896]">
                                  <span>PREVIEW FULL STORY WITH THIS ENDING</span>
                                  <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
                                </summary>
                                <div className="p-4 border-t border-[#d4b896]/80 text-xs text-[#5c3d2e] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap dark:border-[#5c3d2e]/80 dark:text-[#d4b896]">
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
                  <div className="flex flex-col items-center justify-center py-8 bg-[#fdf8f0] border border-dashed border-[#d4b896] rounded-xl dark:bg-[#1a0f08] dark:border-[#5c3d2e]">
                    <button
                      type="button"
                      onClick={handleGenerateAlternateEndings}
                      className="parchment-btn-primary px-6 py-3 font-semibold font-[Cormorant_Garamond] tracking-widest uppercase flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Generate Alternate Endings
                    </button>
                    <p className="text-xs text-[#5c3d2e]/80 mt-3 text-center max-w-sm px-4 leading-relaxed dark:text-[#d4b896]/80 font-[EB_Garamond]">
                      Uses the story context to produce 5 unique ending variations (Happy, Dark, Plot Twist, Open, Cliffhanger) for comparison.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4">
          <div className="mb-5 font-[Playfair_Display]">
            <h1 className="text-2xl font-bold text-[#8b1a1a] dark:text-[#c9a227]">
              Preview
            </h1>
          </div>
          <div className="parchment-card overflow-hidden group">
            <div className="relative flex flex-col rounded-lg">
              <div className="relative m-3 overflow-hidden text-white rounded-xl">
                <img
                  src={selectedStory.imageURL}
                  alt="card-image"
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-1">
                <div className="flex justify-between items-center mb-2 w-full font-[Cormorant_Garamond]">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded bg-[#8b1a1a] py-1 px-3 text-xs font-semibold text-white shadow-sm">
                      {selectedStory.tag.toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded bg-[#f5ead6] py-1 px-2.5 text-xs font-medium text-[#5c3d2e] shadow-sm gap-1 border border-[#d4b896] dark:bg-[#2c1810] dark:text-[#d4b896] dark:border-[#5c3d2e]">
                      ⏱️ {calculateReadingTime(selectedStory.content)} min read
                    </div>
                  </div>
                  <div>
                    <BookmarkButton storyId={selectedStory.uuid} />
                  </div>
                </div>
                <h6 className="mb-1 text-[#2c1810] text-xl font-bold font-[Playfair_Display] dark:text-[#f5ead6]">
                  {selectedStory.title}
                </h6>
                <p className="text-[#5c3d2e] font-light breakwords text-sm sm:text-base dark:text-[#d4b896]">
                  {getShortenedText(selectedStory.content)}
                </p>
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
