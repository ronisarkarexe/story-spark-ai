import React, { useEffect, useRef, useState } from "react";
import { Chapter } from "../../types/story.types";
import ReadingTimeBadge from "../ReadingTimeBadge";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { AudioPlayer } from "../AudioPlayer";

interface Props {
  chapters: Chapter[];
  storyId: string;
  truncated?: boolean;
}

const StoryViewer: React.FC<Props> = ({ chapters, storyId, truncated }) => {
  const [progress, setProgress] = useState(0);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const storageKey = `story-progress-${storyId}`;

  const [copiedId, setCopiedId] = useState<number | null>(null);

const handleCopy = async (text: string, id: number) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 3000);
  } catch (error) {
    console.error("Copy failed:", error);
  }
};

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    try {
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        const progressValue = Number(savedProgress);
        setProgress(progressValue);
        if (progressValue > 0 && progressValue < 100) {
          setShowResumeBanner(true);
        }
      }
    } catch (e) {
      console.warn("Failed to read reading progress from storage:", e);
    }
  }, [storageKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;
      const currentProgress = (container.scrollTop / maxScroll) * 100;
      const rounded = Math.min(100, Math.max(0, Math.round(currentProgress)));
      setProgress(rounded);
      try {
        localStorage.setItem(storageKey, rounded.toString());
        if (rounded === 100) {
          localStorage.removeItem(storageKey);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
          toast.error("Reading progress could not be saved because storage is full.");
        } else {
          console.warn("Failed to persist reading progress:", e);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [storageKey]);

  const handleResume = () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        const progressValue = Number(savedProgress);
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTo({
          top: (progressValue / 100) * maxScroll,
          behavior: "smooth",
        });
      }
    } catch (e) {
      console.warn("Failed to read reading progress from storage:", e);
    }
    setShowResumeBanner(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title || "StorySparkAI Story";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleExportPDF = () => {
    if (!chapters || chapters.length === 0) {
      toast.error("No story content to export.");
      return;
    }

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const leftMargin = 20;
      const printableWidth = 170;
      let yCursor = 25;
      const maxY = 280;

      // Title from first chapter or fallback
      const storyTitle = chapters[0]?.title || "Untitled Story";

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      const titleLines = doc.splitTextToSize(storyTitle, printableWidth);
      titleLines.forEach((line: string) => {
        doc.text(line, leftMargin, yCursor);
        yCursor += 9;
      });
      yCursor += 4;

      // Separator
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 10;

      // Chapter content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);

      chapters.forEach((chapter, idx) => {
        // Chapter title
        if (yCursor > maxY - 20) {
          doc.addPage();
          yCursor = 25;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(99, 102, 241);
        const chTitleLines = doc.splitTextToSize(chapter.title || `Chapter ${idx + 1}`, printableWidth);
        chTitleLines.forEach((line: string) => {
          if (yCursor > maxY) { doc.addPage(); yCursor = 25; }
          doc.text(line, leftMargin, yCursor);
          yCursor += 7;
        });
        yCursor += 3;

        // Chapter paragraphs
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        const paragraphs = (chapter.content || "").split(/\n+/);
        paragraphs.forEach((para: string) => {
          const clean = para.trim();
          if (!clean) return;
          const lines = doc.splitTextToSize(clean, printableWidth);
          lines.forEach((line: string) => {
            if (yCursor > maxY) { doc.addPage(); yCursor = 25; }
            doc.text(line, leftMargin, yCursor);
            yCursor += 6.5;
          });
          yCursor += 4;
        });
        yCursor += 6;
      });

      // Page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
      }

      const safeName = storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "story";
      doc.save(`${safeName}.pdf`);
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-8 py-10 bg-zinc-950"
    >
      {truncated && (
        <div className="sticky top-0 z-30 bg-yellow-900/90 backdrop-blur-md rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-yellow-200">
            Your story was truncated because it exceeded the maximum length. Try a shorter prompt.
          </span>
        </div>
      )}
      {showResumeBanner && (
        <div className="sticky top-0 z-20 bg-indigo-900/90 backdrop-blur-md rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-indigo-200">
            You left off at {progress}% � continue where you stopped?
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors"
            >
              Continue Reading
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md rounded-lg p-4 mb-8">
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
  <span className="text-sm text-zinc-400">
    Reading Progress
  </span>

  <span className="text-sm font-medium text-indigo-400">
    {progress}%
  </span>
</div>
        <button
          onClick={handleExportPDF}
          className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          📄 Export PDF
        </button>
      </div>
      <div className="max-w-4xl mx-auto">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="mb-16">
            <div className="flex items-center justify-between mb-6">
  <h1 className="text-4xl font-extrabold tracking-tight text-white">
    {chapter.title}
  </h1>

  <button
    onClick={() => handleCopy(chapter.content, chapter.id)}
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
  >
    {copiedId === chapter.id ? "Copied! ✓" : "Copy"}
  </button>
</div>

<ReadingTimeBadge text={chapter.content} />
            <p className="text-lg text-zinc-300 whitespace-pre-line leading-9">
              {chapter.content}
            </p>
            <hr className="border-zinc-800 mt-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryViewer;
