import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import { RootState } from "../../redux/store";
import { getUserInfo } from "../../services/auth.service";

import ChapterSidebar from "./ChapterSidebar";
import StoryViewer from "./StoryViewer";
import ContinueStoryButton from "./ContinueStoryButton";
import CharacterNetwork from "../CharacterNetwork";
import StoryCoverGenerator from "../cover-generator/StoryCoverGenerator";
import StoryChecklist from "../checklist/StoryChecklist";
import StoryRewritePanel from "../rewrite/StoryRewritePanel";
import StoryBranchingEditor from "../branching/StoryBranchingEditor";

import {
  getSafeFileName,
  downloadBlob,
  createWorkspaceDocxBlob,
  exportWorkspacePDF,
} from "../../utils/story-export.utils";

const StoryWorkspace = () => {
  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );
  const [workspaceMode, setWorkspaceMode] = useState<"editor" | "network">("editor");

  const [selectedTheme, setSelectedTheme] = useState<
  "Classic" | "Novel" | "Minimal" | "Dark"
>("Classic");

  const handleCopyStory = async () => {
  if (!currentStory) {
    toast.error("No story available to copy.");
    return;
  }

  try {
    const storyText = (currentStory.chapters || [])
  .map(
    (chapter) => `${chapter.title}\n\n${chapter.content}`
  )
  .join("\n\n-----------------------------------\n\n");

    await navigator.clipboard.writeText(storyText);
    toast.success("Story copied to clipboard!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to copy story.");
  }
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

  const handleExportPDF = () => {
    if (!currentStory) {
      toast.error("No story available to export.");
      return;
    }
    const toastId = toast.loading("Preparing your PDF...");
    try {
      const title = currentStory.title || "Story";
      const user = getUserInfo();
      const authorName = user?.name || "Anonymous";
      const formattedDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      exportWorkspacePDF({
  title,
  authorName,
  dateStr: formattedDate,
  chapters: currentStory.chapters || [],
  theme: selectedTheme,
});

      toast.success("PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleExportDOCX = () => {
    if (!currentStory) {
      toast.error("No story available to export.");
      return;
    }
    try {
      const title = currentStory.title || "Story";
      const user = getUserInfo();
      const authorName = user?.name || "Anonymous";
      const formattedDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const blob = createWorkspaceDocxBlob({
  title,
  authorName,
  dateStr: formattedDate,
  chapters: currentStory.chapters || [],
  theme: selectedTheme,
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
            <div className="flex bg-zinc-950 rounded-lg p-0.5 border border-zinc-800 mr-2">
              <button
                onClick={() => setWorkspaceMode("editor")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  workspaceMode === "editor"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-250"
                }`}
              >
                📖 Read Story
              </button>
              <button
                onClick={() => setWorkspaceMode("network")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  workspaceMode === "network"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-255"
                }`}
              >
                🕸️ Character Network
              </button>
            </div>
            <select
  value={selectedTheme}
  onChange={(e) =>
    setSelectedTheme(
      e.target.value as "Classic" | "Novel" | "Minimal" | "Dark"
    )
  }
  className="bg-zinc-800 text-white rounded px-3 py-2 border border-zinc-700 text-sm"
>
  <option value="Classic">📖 Classic</option>
  <option value="Novel">📚 Novel</option>
  <option value="Minimal">✨ Minimal</option>
  <option value="Dark">🌙 Dark</option>
</select>
            <button
              onClick={handleCopyStory}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer text-sm"
              >
                📋 Copy Story
            </button>
            <button
              onClick={handleExportMarkdown}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer text-sm"
            >
              ⬇️ Markdown
            </button>
            <button
              onClick={handleExportDOCX}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer text-sm"
            >
              ⬇️ Word (DOCX)
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer text-sm"
            >
              ⬇️ PDF
            </button>
          </div>
        </div>

        {workspaceMode === "editor" ? (
  <>
  <div className="p-4 border-b border-zinc-800">
    <StoryChecklist
      title={currentStory.title}
      content={
        currentStory.chapters
          ?.map((chapter) => chapter.content)
          .join("\n\n") || ""
      }
    />
  </div>

  <StoryCoverGenerator
  title={currentStory.title}
  genre="Fantasy"
  theme="Adventure"
  characters={["Hero", "Villain"]}
/>

<StoryRewritePanel
  story={
    currentStory.chapters
      ?.map((chapter) => chapter.content)
      .join("\n\n") || ""
  }
/>

<StoryBranchingEditor
  storyTitle={currentStory.title}
/>

  <StoryViewer
    chapters={currentStory.chapters}
    storyId={currentStory.id}
    truncated={currentStory.truncated}
  />

  <div className="p-6 border-t border-zinc-800">
    <ContinueStoryButton />
  </div>
</>
        ) : (
          <CharacterNetwork storyId={currentStory.id} />
        )}
      </div>
    </div>
  );
};

export default StoryWorkspace;