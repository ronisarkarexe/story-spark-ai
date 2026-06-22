import React, { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import DOMPurify from "dompurify";
import { useCreatePostMutation, useDeletePostMutation } from "../../redux/apis/post.api";
import { useGenerateAlternateEndingsMutation, useGenerateFreeAlternateEndingsMutation } from "../../redux/apis/ai.model.api";
import { fetchImageAsBlob, blobToBase64, exportStoryToPDF, exportStoryToEPUB } from "../../services/export.service";
import StoryGeneratingAnimation from "../loading/story-generating-animation.component";
import AudioPlayer, { NarrationPlaybackState } from "../AudioPlayer";
import BookmarkButton from "../BookmarkButton";
import ImageFallback from "../ImageFallback";
import GeneratedStoryTimeline from "./GeneratedStoryTimeline";
import EmptyStoriesState from "./EmptyStoriesState";
import { getWordCount, getShortenedText, ITopicData, topicsData, CharacterProfile } from "./stories.utils";
import logo from "../../assets/logoNew.png";

// Lazy Loaded Components
const StoryWorldMap = React.lazy(() => import("../story-map/StoryWorldMap"));
const StoryRemix = React.lazy(() => import("../remix/StoryRemix"));
const StoryVisualizer = React.lazy(() => import("../story-visualizer/StoryVisualizer"));
const StoryTrailer = React.lazy(() => import("../trailer/StoryTrailer"));

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
  genre?: string;
  emotions?: string[];
}

const buildSentenceSegments = (content: string) => {
  if (!content.trim()) return [];
  const sentenceMatches = content.match(/[^.!?]+[.!?]*\s*/g) ?? [content];
  const segments = [];
  let wordCursor = 0;
  for (const sentence of sentenceMatches) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    const wordsInSentence = sentence.match(/\S+/g)?.length ?? 0;
    segments.push({
      id: `${wordCursor}`,
      text: sentence,
      startWordIndex: wordCursor,
      endWordIndex: wordsInSentence > 0 ? wordCursor + wordsInSentence - 1 : wordCursor,
    });
    wordCursor += wordsInSentence;
  }
  return segments;
};

const StoriesViewComponent: React.FC<{ stories: IStories[]; isLogin: boolean; isLoading: boolean; setStories: any }> = ({ stories, isLogin, isLoading, setStories }) => {
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");
  const [endingsCache, setEndingsCache] = useState<{ [uuid: string]: any[] }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [originalStoryContent, setOriginalStoryContent] = useState<{ [uuid: string]: string }>({});

  // Modals & UI States
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
  const [showRemix, setShowRemix] = useState<boolean>(false);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [characterProfiles, setCharacterProfiles] = useState<CharacterProfile[]>([]);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [showGenreTransformation, setShowGenreTransformation] = useState<boolean>(false);
  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

  useEffect(() => {
    if (stories && stories.length > 0) setSelectedStory(stories[0]);
  }, [stories]);

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({ ...prev, [selectedStory.uuid]: selectedStory.content }));
    }
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => buildSentenceSegments(selectedStory?.content ?? ""), [selectedStory?.content]);
  const isNarrationActive = narrationState !== "idle";

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
      const request = isLogin ? generateAlternateEndings(payload) : generateFreeAlternateEndings(payload);
      const res = await request.unwrap();
      if (res?.data) {
        setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
        toast.success("Alternate endings generated!");
      }
    } catch (err) {
      toast.error("Failed to generate endings.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  const handleApplyEnding = (endingData: any) => {
    if (!selectedStory) return;
    setSelectedStory({ ...selectedStory, content: endingData.fullStory });
    toast.success(`${endingData.style} applied!`);
  };

  const handleResetEnding = () => {
    if (!selectedStory) return;
    setSelectedStory({ ...selectedStory, content: originalStoryContent[selectedStory.uuid] });
    toast.success("Reverted to original ending!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen bg-slate-50 dark:bg-slate-950">
        <StoryGeneratingAnimation />
      </div>
    );
  }

  if (!stories || !stories.length || !selectedStory) {
    return <EmptyStoriesState />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16 relative overflow-hidden box-border">
      <Toaster position="top-right" />
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10 w-full box-border">
        {/* Left Column: Story Viewer */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 animate-fade-in-up">
          
          <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-white/5 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                {selectedStory.title}
              </h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase rounded-xl">🎭 {selectedStory.tag}</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase rounded-xl">🌐 {selectedStory.language || "English"}</span>
              </div>
            </div>

            {/* Thumbnail Switcher */}
            <div className="flex -space-x-4">
              {stories.map((story) => (
                <button
                  key={story.uuid}
                  className={`w-12 h-12 rounded-full border-2 ${selectedStory.uuid === story.uuid ? "border-blue-500 scale-110 z-10 shadow-md" : "border-slate-800 hover:scale-110"} transition-all cursor-pointer overflow-hidden`}
                  onClick={() => setSelectedStory(story)}
                >
                  <ImageFallback src={story.imageURL} alt={story.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-sm relative">
            {/* Quick Tools */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <button onClick={() => setShowWorldMap(true)} className="px-3 py-2 bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase rounded-xl hover:bg-slate-200 transition">🗺️ Map</button>
              <button onClick={() => setShowRemix(true)} className="px-3 py-2 bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase rounded-xl hover:bg-slate-200 transition">🔀 Remix</button>
              <button onClick={() => setShowTrailer(true)} className="px-3 py-2 bg-rose-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-rose-500 transition">🎬 Trailer</button>
            </div>

            {/* Story Content */}
            <div className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed tracking-wide text-lg whitespace-pre-wrap">
              {sentenceSegments.length > 0 ? (
                sentenceSegments.map((segment) => {
                  const isActive = isNarrationActive && narrationWordIndex >= segment.startWordIndex && narrationWordIndex <= segment.endWordIndex;
                  return (
                    <span key={segment.id} className={isActive ? "bg-indigo-500/30 text-indigo-900 dark:text-indigo-200 rounded px-1 transition-all" : ""}>
                      {DOMPurify.sanitize(segment.text)}
                    </span>
                  );
                })
              ) : (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedStory.content) }} />
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
              <AudioPlayer text={selectedStory.content} title={selectedStory.title} onWordIndexChange={setNarrationWordIndex} onPlaybackStateChange={setNarrationState} />
            </div>
          </div>

          {/* Alternate Endings Panel */}
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl shadow-xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Alternate Endings</h3>
              {selectedStory.content !== originalStoryContent[selectedStory.uuid] && (
                <button onClick={handleResetEnding} className="px-4 py-2 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-200 rounded-lg text-sm font-semibold">
                  <i className="fa-solid fa-rotate-left" /> Reset to Original
                </button>
              )}
            </div>

            {isGeneratingEndings ? (
              <div className="text-center py-10 animate-pulse text-slate-500">Generating alternate endings...</div>
            ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
              <div>
                <div className="flex gap-2 overflow-x-auto mb-4 border-b border-slate-700/50 pb-2">
                  {["Happy Ending", "Dark Ending", "Plot Twist Ending", "Open Ending", "Cliffhanger Ending"].map(tab => (
                    <button key={tab} onClick={() => setActiveEndingTab(tab)} className={`px-4 py-2 font-semibold text-sm whitespace-nowrap rounded-t-lg transition-all ${activeEndingTab === tab ? "bg-purple-500/10 text-purple-400 border-b-2 border-purple-500" : "text-slate-500"}`}>{tab}</button>
                  ))}
                </div>
                {(() => {
                  const ending = endingsCache[selectedStory.uuid].find(e => e.style === activeEndingTab);
                  if (!ending) return null;
                  return (
                    <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-300">{activeEndingTab} Excerpt</h4>
                        <button onClick={() => handleApplyEnding(ending)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-purple-500">Apply Ending</button>
                      </div>
                      <p className="italic text-slate-400">{ending.ending}</p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8">
                <button onClick={handleGenerateAlternateEndings} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-500 transition-all">
                  🔮 Generate Alternate Endings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Timeline & Stats */}
        <div className="col-span-1 lg:col-span-4 sticky top-6">
          <GeneratedStoryTimeline content={selectedStory.content} title={selectedStory.title} narrationState={narrationState} narrationWordIndex={narrationWordIndex} />
        </div>
      </div>

      {/* Modals */}
      {showWorldMap && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">Loading...</div>}>
          <StoryWorldMap story={selectedStory.content} title={selectedStory.title} onClose={() => setShowWorldMap(false)} />
        </Suspense>
      )}

      {showRemix && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">Loading...</div>}>
          <StoryRemix story={selectedStory as any} isLogin={isLogin} onRemixComplete={(s: any) => { setStories([s, ...stories]); setShowRemix(false); }} onClose={() => setShowRemix(false)} />
        </Suspense>
      )}

      {showTrailer && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">Loading...</div>}>
          <StoryTrailer title={selectedStory.title} content={selectedStory.content} tag={selectedStory.tag} isLogin={isLogin} onClose={() => setShowTrailer(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default StoriesViewComponent;