import React from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";

import { RootState } from "../../redux/store";
import { getUserInfo } from "../../services/auth.service";

import ChapterSidebar from "./ChapterSidebar";
import StoryViewer from "./StoryViewer";
import ContinueStoryButton from "./ContinueStoryButton";

const StoryWorkspace = () => {
  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );

  const getSafeFileName = (title: string, ext: string) => {
    const clean = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `${clean || "story"}.${ext}`;
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!currentStory) {
      toast.error("No story available to export.");
      return;
    }
    try {
      const title = currentStory.title || "Story";
      const user = getUserInfo();
      const authorName = user?.name || "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      let chaptersContent = "";
      if (currentStory.chapters && currentStory.chapters.length > 0) {
        currentStory.chapters.forEach((chapter) => {
          chaptersContent += `## ${chapter.title}\n\n${chapter.content}\n\n`;
        });
      } else {
        chaptersContent = "*No chapters in this story.*";
      }

      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${chaptersContent}`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Markdown.");
    }
  };

  const handleExportPDF = async () => {
    if (!currentStory) {
      toast.error("No story available to export.");
      return;
    }
    const toastId = toast.loading("Preparing PDF...");
    try {
      const title = currentStory.title || "Untitled Story";
      const user = getUserInfo();
      const authorName = user?.name || "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20;
      const printableWidth = 210 - leftMargin - rightMargin;
      const maxY = 297 - bottomMargin - 10;
      let yCursor = topMargin;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text("StorySparkAI", leftMargin, yCursor + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("AI GENERATED STORY", 190, yCursor + 5, { align: "right" });
      yCursor += 10;
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 8;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      const splitTitle = doc.splitTextToSize(title, printableWidth);
      splitTitle.forEach((line: string) => { doc.text(line, leftMargin, yCursor); yCursor += 9; });
      yCursor += 2;

      // Metadata row
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Author: ${authorName}`, leftMargin, yCursor);
      doc.text(`Date: ${isoDate}`, 190, yCursor, { align: "right" });
      yCursor += 6;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 10;

      // Chapters
      const chapters = currentStory.chapters && currentStory.chapters.length > 0
        ? currentStory.chapters
        : [];

      if (chapters.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text("No chapters in this story.", leftMargin, yCursor);
      } else {
        chapters.forEach((chapter) => {
          if (yCursor > maxY) { doc.addPage(); yCursor = 30; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(99, 102, 241);
          const splitChTitle = doc.splitTextToSize(chapter.title, printableWidth);
          splitChTitle.forEach((line: string) => {
            if (yCursor > maxY) { doc.addPage(); yCursor = 30; }
            doc.text(line, leftMargin, yCursor);
            yCursor += 7;
          });
          yCursor += 3;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59);
          const paragraphs = chapter.content.split(/\n+/);
          paragraphs.forEach((para: string, pIdx: number) => {
            const cleanPara = para.trim();
            if (!cleanPara) return;
            const lines = doc.splitTextToSize(cleanPara, printableWidth);
            lines.forEach((line: string) => {
              if (yCursor > maxY) { doc.addPage(); yCursor = 30; }
              doc.setFont("helvetica", "normal");
              doc.setFontSize(11);
              doc.setTextColor(30, 41, 59);
              doc.text(line, leftMargin, yCursor);
              yCursor += 6.5;
            });
            if (pIdx < paragraphs.length - 1) yCursor += 4.5;
          });
          yCursor += 10;
        });
      }

      // Running footer/header
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.25);
        doc.line(leftMargin, 280, 190, 280);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Generated with StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
        if (i > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(99, 102, 241);
          doc.text("StorySparkAI", leftMargin, 14);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
          doc.text(headerTitle, 190, 14, { align: "right" });
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.2);
          doc.line(leftMargin, 17, 190, 17);
        }
      }

      doc.save(getSafeFileName(title, "pdf"));
      toast.dismiss(toastId);
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportDOCX = () => {
    if (!currentStory) {
      toast.error("No story available to export.");
      return;
    }
    try {
      const title = currentStory.title || "Untitled Story";
      const user = getUserInfo();
      const authorName = user?.name || "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];

      const escapeHtml = (val: string) =>
        val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

      const chapters = currentStory.chapters && currentStory.chapters.length > 0
        ? currentStory.chapters
        : [];

      const chaptersHtml = chapters.length === 0
        ? "<p><em>No chapters in this story.</em></p>"
        : chapters.map((ch) => {
            const paragraphs = ch.content
              .split(/\n+/)
              .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
              .join("");
            return `<h2>${escapeHtml(ch.title)}</h2>${paragraphs}`;
          }).join("<hr/>");

      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
    h1 { color: #312e81; }
    h2 { color: #4338ca; margin-top: 24px; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Author: ${escapeHtml(authorName)} | Date: ${escapeHtml(isoDate)}</div>
  ${chaptersHtml}
</body>
</html>`;

      const blob = new Blob([html], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
      });
      downloadBlob(blob, getSafeFileName(title, "docx"));
      toast.success("DOCX downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export DOCX.");
    }
  };

  if (!currentStory) {
    return (
      <div className="text-white p-10">
        No Story Available
      </div>
    );
  }

  return (
    <div className="flex bg-black h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <ChapterSidebar
        chapters={currentStory.chapters}
      />

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-white text-lg font-bold">{currentStory.title}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportMarkdown}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer"
            >
              ⬇️ Markdown
            </button>
            <button
              onClick={handleExportDOCX}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer"
            >
              ⬇️ DOCX
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer"
            >
              ⬇️ PDF
            </button>
          </div>
        </div>

        <StoryViewer
          chapters={currentStory.chapters}
        />

        <div className="p-6 border-t border-zinc-800">
          <ContinueStoryButton />
        </div>
      </div>
    </div>
  );
};

export default StoryWorkspace;