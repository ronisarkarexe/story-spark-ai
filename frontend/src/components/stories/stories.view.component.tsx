import React, { useEffect, useState, useRef, useMemo } from "react";
import { getShortenedText } from "./stories.utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation } from "../../redux/apis/post.api";
import jsPDF from "jspdf";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import StoryCoverImage from "./StoryCoverImage";
import ImageFallback from "../ImageFallback";

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
  enhancedPrompt?: string;
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
  isLoading?: boolean;
  onPublishSuccess?: () => void;
}

export interface StorySentenceSegment {
  id: string;
  text: string;
  startWordIndex: number;
  endWordIndex: number;
}

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
  isLoading,
  onPublishSuccess,
}) => {
  const [selectedStory, setSelectedStory] = useState<IStories | null>(stories?.[0] || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  
  const [narrationWordIndex, setNarrationWordIndex] = useState(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>('idle');
  const isNarrationActive = narrationState === 'playing' || narrationState === 'paused';

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    }
  }, [stories]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      await navigator.clipboard.writeText(selectedStory.content);
      setIsCopied(true);
      toast.success("Story copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExportPDF = () => {
    if (!selectedStory) {
      toast.error("No story available to export.");
      return;
    }

    try {
      const doc = new jsPDF();
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";

      doc.setFontSize(18);
      doc.text(title, 15, 20);

      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(content, 180);
      doc.text(splitText, 15, 35);

      doc.save(`${title}.pdf`);
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedStory) return;
    const blob = new Blob([`# ${selectedStory.title}\n\n${selectedStory.content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStory.title}.md`;
    a.click();
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
    
    setLoading(true);
    try {
      const result = await createPost({
        ...selectedStory,
        topic: [],
      }).unwrap();
      
      if (result) {
        toast.success("Story published successfully!");
        setStories([]);
        setSelectedStory(null);
        if (onPublishSuccess) onPublishSuccess();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sentenceSegments = useMemo(() => {
    if (!selectedStory?.content) return [];
    
    const sentences = selectedStory.content.match(/[^.!?]+[.!?]+/g) || [selectedStory.content];
    let currentWordIndex = 0;
    
    return sentences.map((sentence, index) => {
      const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
      const wordCount = words.length;
      const startIdx = currentWordIndex;
      const endIdx = currentWordIndex + Math.max(0, wordCount - 1);
      
      currentWordIndex += wordCount;
      
      return {
        id: `sentence-${index}`,
        text: sentence,
        startWordIndex: startIdx,
        endWordIndex: endIdx
      };
    });
  }, [selectedStory?.content]);

  if (!stories || stories.length === 0) {
    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8 pb-16 flex justify-center">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-8 sm:p-12 text-center text-slate-400 max-w-2xl w-full shadow-lg transition-all duration-500 ease-in-out mx-auto">
          <div className="text-5xl mb-6 animate-pulse">✨</div>
          <h3 className="text-2xl font-bold text-slate-200 tracking-wide">
            Your AI-generated story will appear here
          </h3>
          <p className="mt-3 text-base text-slate-400">
            Enter a creative prompt above and let StorySparkAI craft something magical.
          </p>
        </div>
      </div>
    );
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
                  🎭 {selectedStory?.tag || "Story"}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                  🌐 {selectedStory?.language || "English"}
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
                          ? "border-blue-500 scale-110 z-10"
                          : "border-slate-600"
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

                <button
                  type="button"
                  id="publish-story-btn"
                  className={`rounded-lg px-5 py-2 font-semibold flex items-center space-x-2 cursor-pointer bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    loading || isLoading ? "" : "hover:bg-blue-500 hover:shadow-lg active:scale-95"
                  }`}
                  onClick={handelPublishStory}
                  disabled={loading || isLoading || !selectedStory}
                >
                  {loading || isLoading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>

            {selectedStory?.enhancedPrompt && (
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
                  selectedStory?.content
                )}
              </p>
            </div>

            {selectedStory && (
              <div className="relative z-10 mt-6">
                <AudioPlayer
                  ref={audioPlayerRef}
                  text={selectedStory.content}
                  title={selectedStory.title}
                  onWordIndexChange={setNarrationWordIndex}
                  onPlaybackStateChange={setNarrationState}
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4">
          <div className="mb-5">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Preview
            </h1>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden group">
            {selectedStory ? (
              <div className="relative flex flex-col rounded-lg">
                <div className="relative m-3 overflow-hidden text-white rounded-xl">
                  <StoryCoverImage
                    title={selectedStory.title}
                    tag={selectedStory.tag}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-1">
                  <div className="mb-2 inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                   {selectedStory.tag?.toUpperCase() || "STORY"}
                  </div>
                  <h6 className="mb-1 text-gray-300 text-xl font-semibold">
                    {selectedStory.title}
                  </h6>
                  <p className="text-gray-400 font-light breakwords text-sm sm:text-base">
                    {getShortenedText(selectedStory.content)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                No story available. Please generate a story first.
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default StoriesViewComponent;
