import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  getShortenedText,
  ITopicData,
  topicsData,
  CharacterProfile,
  getWordCount,
  SELECTED_TOPIC_CLASSES,
} from "./stories.utils";
import { calculateReadingTime } from "../../utils/reading-time";
import CharacterProfileCard from "./CharacterProfileCard";
import StoryGenreTransformation from "./StoryGenreTransformation";
import StoryMoodDashboard from "./StoryMoodDashboard";
import StoryTitleSuggestions from "./StoryTitleSuggestions";
import StoryVersionHistory from "./StoryVersionHistory";
import { formatReadingStats } from "../../utils/story-utils";
import { useCreatePostMutation } from "../../redux/apis/post.api";
import toast, { Toaster } from "react-hot-toast";
import StoryTranslator from "../translate/StoryTranslator";
import AudioPlayer, { type AudioPlayerHandle, type NarrationPlaybackState } from "../AudioPlayer";
import { useLocation } from "react-router-dom";
import ExportStoryModal from "./ExportStoryModal";

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;

  genre?: string;
  language?: string;
}

export type StorySentenceSegment = {
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

interface IPost extends IStories {
  topic: ITopicData[];
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
}

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
}) => {
  const [selectedStory, setSelectedStory] = useState<IStories | null>(
    stories && stories[0]
  );
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [characterProfiles, setCharacterProfiles] = useState<CharacterProfile[]>([]);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [showGenreTransformation, setShowGenreTransformation] = useState<boolean>(false);

  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  const isNarrationActive = narrationState !== "idle";

  useEffect(() => {
    return () => {
      audioPlayerRef.current?.stop();
    };
  }, [location.pathname]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    }
  }, [stories]);

useEffect(() => {
  if (!selectedStory || !isLogin) return;

  const timer = setTimeout(async () => {
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
  }, 1500);

  return () => clearTimeout(timer);
}, [selectedStory, isLogin, selectTopics]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleRestoreVersion = (restoredContent: string) => {
  if (!selectedStory) return;

  const updatedStory = {
    ...selectedStory,
    content: restoredContent,
  };

  setSelectedStory(updatedStory);

  setStories(
    stories.map((story) =>
      story.uuid === selectedStory.uuid
        ? updatedStory
        : story
    )
  );

  toast.success("Story version restored successfully!");
};

  const handleTopicClick = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics[index].selected = !updatedTopics[index].selected;
    setTopics(updatedTopics);
  };
const handleCopyStory = async () => {
  if (selectedStory?.content) {
    await navigator.clipboard.writeText(selectedStory.content);
    setIsCopied(true);
    toast.success("Story copied!");
    setTimeout(() => setIsCopied(false), 2000);
       }
    };


const handleGenerateCharacterProfile = async () => {
  if (!selectedStory) {
    toast.error("No story selected!");
    return;
  }

  setProfileLoading(true);

  try {
    // Replace with your backend API endpoint
    const response = await fetch(
      "/api/generate-character-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story: selectedStory.content,
        }),
      }
    );

    const data = await response.json();

    setCharacterProfiles(data.data);

    toast.success("Character profiles generated!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to generate profiles.");
  } finally {
    setProfileLoading(false);
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
      }
    } catch (error) {
      const message = error?.data?.message || error?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

if (!selectedStory) {
  return null;
}

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
            <div className="">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400 break-words max-w-full">
                {selectedStory?.title}
              </h1>
            </div>
            <div className="flex justify-start sm:justify-end">
              <div className="flex -space-x-5">
                {stories && stories.length > 0 ? (
                  stories.map((story) => (
                    <button
                      key={story.uuid}
                      className={`relative w-16 h-16 rounded-full border-2 ${
                        selectedStory?.uuid === story.uuid
                          ? "border-blue-500 scale-110"
                          : "border-white"
                      } hover:scale-110 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-fuchsia-600`}
                      onClick={() => handelStorySelection(story)}
                    >
                      <img
                        src={story.imageURL}
                        alt={story.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-gray-400">
                    No stories available. Please generate some stories first.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient AI Glow inside the story card */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-200 relative z-10">
                Generated Story
              </h3>
              <div className="flex items-center gap-2 relative z-10">
                {selectedStory && (
                  <>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-slate-700 text-slate-200 font-semibold cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={handleCopyStory}
                    >
                      {isCopied ? "✓ Copied" : "📋 Copy"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-indigo-700 text-white font-semibold hover:bg-indigo-600 transition-colors"
                      onClick={handleGenerateCharacterProfile}
                    >
                      {profileLoading ? "Generating..." : "👥 Characters"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-purple-700 text-slate-200 font-semibold cursor-pointer hover:bg-purple-600 transition-colors"
                      onClick={() => setShowExportModal(true)}
                    >
                      📄 Export
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-4 py-2 bg-emerald-700 text-white font-semibold cursor-pointer hover:bg-emerald-600 transition-colors"
                      onClick={() => setShowTranslator(true)}
                    >
                      🌍 Translate
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className={`rounded-lg px-5 py-2 font-semibold flex items-center space-x-2 cursor-pointer bg-blue-600 text-white transition-all duration-200 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  }`}
                  onClick={handelPublishStory}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
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
                    if (!selectedStory) return null;
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

            {selectedStory && (
              <>
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 w-full box-border relative z-10">
                  <AudioPlayer 
                    ref={audioPlayerRef} 
                    text={selectedStory.content} 
                    title={selectedStory.title} 
                    onWordIndexChange={setNarrationWordIndex} 
                    onPlaybackStateChange={setNarrationState} 
                  />
                </div>
                <StoryVersionHistory
                  story={selectedStory}
                  onRestore={handleRestoreVersion}
                />
              </>
            )}
          </div>
          <div className="mt-6">
  {characterProfiles.length > 0 && (
    <>
      <h3 className="text-xl font-bold text-white mb-4">
        Character Profiles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characterProfiles.map((profile, index) => (
          <CharacterProfileCard
            key={index}
            profile={profile}
          />
        ))}
      </div>
    </>
  )}
</div>
          <div className="mt-7">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-200 mb-4">
                Select Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedStory ? (
                  <>
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`px-4 py-1.5 ${topic.color} rounded-full text-sm font-medium transition-transform hover:scale-105 cursor-pointer shadow-sm`}
                        onClick={() => handleTopicClick(index)}
                      >
                        {topic.selected ? (
                          <i className="fa-solid fa-check"></i>
                        ) : (
                          <i className="fa-solid fa-plus"></i>
                        )}{" "}
                        {topic.title}
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
                  <img
                    src={selectedStory.imageURL}
                    alt="card-image"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-1">
                  <div className="mb-2 inline-flex items-center rounded-full bg-purple-600 py-1 px-3 text-xs font-semibold text-white shadow-sm">
                   {selectedStory.tag.toUpperCase()}
                  </div>
                  <h6 className="mb-1 text-gray-300 text-xl font-semibold truncate max-w-full" title={selectedStory.title}>
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
      {showGenreTransformation && selectedStory && (
        <StoryGenreTransformation
          story={{
            title: selectedStory.title,
            content: selectedStory.content,
          }}
          onClose={() => setShowGenreTransformation(false)}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />

      {showTranslator && selectedStory && (
        <StoryTranslator
          story={selectedStory}
          isLogin={isLogin}
          onClose={() => setShowTranslator(false)}
        />
      )}

      {showExportModal && selectedStory && (
        <ExportStoryModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          story={selectedStory as any}
        />
      )}
    </div>
  );
};

export default StoriesViewComponent;
