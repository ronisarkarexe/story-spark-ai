import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import { RootState } from "../../redux/store";
import { getUserInfo } from "../../services/auth.service";
import { setStory } from "../../redux/slices/storySlice";

import ChapterSidebar from "./ChapterSidebar";
import StoryViewer from "./StoryViewer";
import ContinueStoryButton from "./ContinueStoryButton";
import CharacterNetwork from "../CharacterNetwork";
import { VoiceCastSettings } from "../audio/VoiceCastSettings";
import { AudioPlayer } from "../audio/AudioPlayer";

import {
  getSafeFileName,
  downloadBlob,
  createWorkspaceDocxBlob,
  exportWorkspacePDF,
} from "../../utils/story-export.utils";

const StoryWorkspace = () => {
  const dispatch = useDispatch();
  const currentStory = useSelector(
    (state: RootState) => state.story.currentStory
  );
  const [workspaceMode, setWorkspaceMode] = useState<"editor" | "network">("editor");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showNarration, setShowNarration] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);

  const handleSaveVoiceMap = (voiceMap: Record<string, string>) => {
    if (!currentStory) return;
    const updatedStory = {
      ...currentStory,
      characterVoiceMap: voiceMap,
    };
    dispatch(setStory(updatedStory));
    toast.success("Voice cast settings saved!");
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

            {workspaceMode === "editor" && (
              <div className="flex gap-2 mr-2">
                <button
                  onClick={() => setShowVoiceSettings(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-zinc-700 font-bold transition text-xs cursor-pointer flex items-center gap-1.5"
                >
                  🎙️ Voice Cast
                </button>
                <button
                  onClick={() => setShowNarration(!showNarration)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition text-xs cursor-pointer flex items-center gap-1.5 ${
                    showNarration
                      ? "bg-indigo-600 text-white border-indigo-500 shadow"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                  }`}
                >
                  🔊 Narrate
                </button>
              </div>
            )}

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
            {showNarration && (
              <div className="p-4 bg-zinc-900/40 border-b border-zinc-800">
                <AudioPlayer
                  story={currentStory}
                  chapterIndex={activeChapterIndex}
                  onHighlightSegment={(segIdx) => setActiveSegmentIndex(segIdx)}
                  onClose={() => {
                    setShowNarration(false);
                    setActiveSegmentIndex(-1);
                  }}
                />
              </div>
            )}

            <StoryViewer
              chapters={currentStory.chapters}
              storyId={currentStory.id}
              activeChapterIndex={activeChapterIndex}
              activeSegmentIndex={activeSegmentIndex}
            />

            <div className="p-6 border-t border-zinc-800">
              <ContinueStoryButton />
            </div>
          </>
        ) : (
          <CharacterNetwork storyId={currentStory.id} />
        )}
      </div>

      {showVoiceSettings && (
        <VoiceCastSettings
          story={currentStory}
          onSave={handleSaveVoiceMap}
          onClose={() => setShowVoiceSettings(false)}
        />
      )}
    </div>
  );
};

export default StoryWorkspace;