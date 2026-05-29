import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { useCreatePostMutation } from "../../redux/apis/post.api";
import { ITopicData, topicsData } from "./stories.utils";
import StoryAnimationWrapper from "../story-effects/StoryAnimationWrapper";
import { detectStoryMood } from "../story-effects/StoryMoodDetector";
import StoryCinematicPlayer from "../story/StoryCinematicPlayer";

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
  selectedGenre?: string;
  prompt?: string;
  setStories: (stories: IStories[]) => void;
}

const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  selectedGenre,
  prompt,
  setStories,
}) => {
  const [selectedStory, setSelectedStory] = useState<IStories | null>(
    stories[0] ?? null
  );
  const [topics, setTopics] = useState<ITopicData[]>(topicsData);
  const [selectTopics, setSelectTopics] = useState<ITopicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [isCinematicMode, setIsCinematicMode] = useState<boolean>(false);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    setSelectedStory(stories[0] ?? null);
    if (stories.length > 0) {
      setIsCinematicMode(true);
    }
  }, [stories]);

  const mood = useMemo(
    () =>
      detectStoryMood({
        selectedGenre,
        title: selectedStory?.title,
        content: selectedStory?.content,
        prompt,
      }),
    [prompt, selectedGenre, selectedStory?.content, selectedStory?.title]
  );

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic, topicIndex) =>
        topicIndex === index ? { ...topic, selected: !topic.selected } : topic
      )
    );
  };

  const handleCopyStory = async () => {
    if (!selectedStory?.content) {
      return;
    }

    await navigator.clipboard.writeText(selectedStory.content);
    setIsCopied(true);
    toast.success("Story copied!");
    window.setTimeout(() => setIsCopied(false), 2000);
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
      doc.text(doc.splitTextToSize(content, 180), 15, 35);
      doc.save(`${title}.pdf`);

      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to export PDF.");
    }
  };

  const handlePublishStory = async () => {
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
      await createPost({
        ...selectedStory,
        topic: selectTopics,
      } as IPost).unwrap();

      toast.success("Story published successfully!");
      setStories([]);
      setSelectedStory(null);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!stories.length) {
    return (
      <div className="mt-16 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl justify-center">
          <div className="w-full rounded-[2rem] border border-slate-700 bg-slate-900/60 p-8 text-center text-slate-400 shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="mb-6 text-5xl animate-pulse">✨</div>
            <h3 className="text-2xl font-bold text-slate-100">
              Your AI-generated story will appear here
            </h3>
            <p className="mt-3 text-base text-slate-400">
              Enter a creative prompt above and StorySparkAI will turn it into a cinematic short-form story.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-8xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[0.9fr_2.1fr]">
        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Story Reels
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-100">
                  Generated Scenes
                </h3>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                {stories.length} versions
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {stories.map((story, index) => {
                const thumbnailMood = detectStoryMood({
                  selectedGenre,
                  title: story.title,
                  content: story.content,
                  prompt,
                });

                return (
                  <motion.button
                    key={story.uuid}
                    type="button"
                    onClick={() => setSelectedStory(story)}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`group overflow-hidden rounded-[1.6rem] border text-left transition ${
                      selectedStory?.uuid === story.uuid
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={story.imageURL}
                        alt={story.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${thumbnailMood.backgroundStyle} opacity-80`} />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                          Scene {index + 1}
                        </p>
                        <h4 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
                          {story.title}
                        </h4>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 shadow-xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-100">
              Select Topics
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <button
                  key={topic.title}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition hover:scale-[1.02] ${topic.color}`}
                  onClick={() => handleTopicClick(index)}
                >
                  {topic.selected ? "✓" : "+"} {topic.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {selectedStory && (
            <StoryAnimationWrapper
              title={selectedStory.title}
              content={selectedStory.content}
              mood={mood}
            >
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition shadow-lg flex items-center gap-2 ${
                      isCinematicMode 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30 hover:bg-indigo-500' 
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                    }`}
                    onClick={() => setIsCinematicMode(!isCinematicMode)}
                  >
                    <i className="fas fa-video"></i> {isCinematicMode ? 'Disable Cinematic Mode' : 'Enable Cinematic Mode'}
                  </button>
                </div>

                {isCinematicMode ? (
                  <StoryCinematicPlayer 
                    content={selectedStory.content}
                    title={selectedStory.title}
                    genre={selectedGenre || 'fantasy'}
                    mood={mood}
                    imageURL={selectedStory.imageURL}
                  />
                ) : (
                  <div className="space-y-6">
                <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-md">
                  <div className="relative h-64 overflow-hidden sm:h-80">
                    <motion.img
                      src={selectedStory.imageURL}
                      alt={selectedStory.title}
                      className="h-full w-full object-cover"
                      initial={{ scale: 1.04 }}
                      animate={{ scale: [1.02, 1.08, 1.03] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${mood.backgroundStyle} opacity-65`} />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/65">
                        {selectedStory.tag || mood.mood}
                      </p>
                      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                        {selectedStory.title}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-6 shadow-xl backdrop-blur-md">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-100">
                      Generated Story
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                        onClick={handleCopyStory}
                      >
                        {isCopied ? "Copied" : "Copy"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                        onClick={handleExportPDF}
                      >
                        Export PDF
                      </button>
                      <button
                        id="publish-story-btn"
                        type="button"
                        className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
                          loading
                            ? "cursor-not-allowed bg-slate-600"
                            : "bg-blue-600 hover:bg-blue-500"
                        }`}
                        onClick={handlePublishStory}
                        disabled={loading}
                      >
                        {loading ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-200">
                    {selectedStory.content
                      .split(/\n+/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={`${selectedStory.uuid}-${index}`} className="leading-8 text-slate-200/95">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            )}
            </StoryAnimationWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoriesViewComponent;
