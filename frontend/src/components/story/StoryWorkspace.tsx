import React from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import { RootState } from "../../redux/store";
import { getUserInfo } from "../../services/auth.service";

import ChapterSidebar from "./ChapterSidebar";
import StoryViewer from "./StoryViewer";
import ContinueStoryButton from "./ContinueStoryButton";

const StoryWorkspace = () => {
  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );

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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      link.setAttribute("download", `${cleanTitle || "story"}.md`);
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition flex items-center gap-2 font-semibold cursor-pointer"
            >
              ⬇️ Export as Markdown
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