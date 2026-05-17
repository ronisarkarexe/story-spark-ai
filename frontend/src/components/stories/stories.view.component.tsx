import React, { useEffect, useState } from "react";
import { getShortenedText, ITopicData, topicsData } from "./stories.utils";
import toast, { Toaster } from "react-hot-toast";
import { useCreatePostMutation } from "../../redux/apis/post.api";

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
  const [createPost] = useCreatePostMutation();

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    }
  }, [stories]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleTopicClick = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics[index].selected = !updatedTopics[index].selected;
    setTopics(updatedTopics);
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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 px-4 sm:px-6 md:px-10 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div className="">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
                {selectedStory?.title}
              </h1>
            </div>
            <div className="flex justify-end mb-4">
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

          <div className="bg-blue-500/10 border border-gray-500 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-300">
                Generated Story
              </h3>
              <span className="text-sm text-gray-800">
                <button
                  className={`rounded-lg px-4 py-1 font-semibold flex items-center space-x-2 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-gray-300 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-indigo-500/50"
                  }`}
                  onClick={handelPublishStory}
                >
                  {loading ? "Publishing..." : "Publish"}
                </button>
              </span>
            </div>
            <div className="prose max-w-none text-gray-400">
              {selectedStory ? (
                <p className="break-words">{selectedStory.content}</p>
              ) : (
                <p>No story available. Please generate a story first.</p>
              )}
            </div>
          </div>
          <div className="mt-7">
            <div className="bg-blue-500/10 border border-gray-400 rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Select Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedStory ? (
                  <>
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 ${topic.color} rounded-full border text-sm font-semibold cursor-pointer transition hover:brightness-110`}
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
            <h1 className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-400">
              Preview
            </h1>
          </div>
          <div className="bg-blue-500/10 border border-gray-400 rounded-lg shadow-lg">
            {selectedStory ? (
              <div className="relative flex flex-col rounded-lg">
                <div className="relative m-2.5 overflow-hidden text-white rounded-md">
                  <img
                    src={selectedStory.imageURL}
                    alt="card-image"
                    className="w-full h-32 sm:h-40 object-cover rounded-b-md"
                  />
                </div>
                <div className="px-3 py-1">
                  <div className="mb-2 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-gray-400 transition-all shadow-sm w-20 text-center">
                    {selectedStory.tag.toUpperCase()}
                  </div>
                  <h6 className="mb-1 text-gray-300 text-xl font-semibold">
                    {selectedStory.title}
                  </h6>
                  <p className="text-gray-400 font-light break-words text-sm sm:text-base">
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
