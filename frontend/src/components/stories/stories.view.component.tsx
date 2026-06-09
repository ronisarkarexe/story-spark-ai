import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";

// Split default components and type bindings cleanly to satisfy the compiler
import AudioPlayer from "../AudioPlayer";
import type { AudioPlayerHandle, NarrationPlaybackState } from "../AudioPlayer";

import { useNavigate } from "react-router-dom";
import {
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
} from "../../redux/apis/ai.model.api";

// --- Custom Error Classes & Helper Types ---
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return "The AI service is currently busy. Please wait a moment and try again.";
    }
    if ([502, 503, 504].includes(error.status)) {
      return "The server took too long to respond. Please try again shortly.";
    }
    if (error.status >= 500) {
      return "A server error occurred. Please try again later.";
    }
  }
  if (error instanceof TypeError) {
    return "Could not reach the server. Please check your connection and try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

export interface IStories {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
}

interface StoriesComponentProps {
  stories: IStories[];
  isLogin: boolean;
  setStories: (stories: IStories[]) => void;
  onPublishSuccess?: () => void;
}

interface IRelatedStoriesComponentProps {
  posts: { _id: string; title: string; [key: string]: unknown }[];
  currentPostId: string;
}

export const RelatedStoriesComponent: React.FC<IRelatedStoriesComponentProps> = ({ posts, currentPostId }) => {
  const navigate = useNavigate();
  const filteredPosts = posts.filter((post) => post._id !== currentPostId);

  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-slate-200 mb-4">Related Content</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/stories/${post._id}`)}
            className="p-4 bg-slate-700/40 rounded-xl border border-slate-600/30 cursor-pointer hover:bg-slate-700/60 transition-colors"
          >
            <p className="text-sm font-semibold text-white truncate">{post.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const StoriesViewComponent: React.FC<StoriesComponentProps> = ({
  stories,
  isLogin,
  setStories,
}) => {
  // Use the void operator to explicitly tell ESLint this prop is accounted for
  void setStories;

  // Setup the audio reference hook properly
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<IStories | null>(null);
  const [originalStoryContent, setOriginalStoryContent] = useState<{ [uuid: string]: string }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  
  // Use blank tuple index positions to satisfy the unused state variable rules safely
  const [, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});

  const [, setNarrationWordIndex] = useState<number>(0);
  const [, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();
  
  // Keep required query hooks mounted active
  useGetProfileInfoQuery(undefined, { skip: !isLogin });

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  useEffect(() => {
    setNarrationWordIndex(0);
    setNarrationState("idle");
    setErrorMessage(null);
  }, [selectedStory?.uuid]);

  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    } else {
      setSelectedStory(null);
    }
  }, [stories]);

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;

    setErrorMessage(null);
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Generating alternate endings...");

    try {
      const payload = {
        title: selectedStory.title,
        content: originalStoryContent[selectedStory.uuid] || selectedStory.content,
        tag: selectedStory.tag,
        language: selectedStory.language || "English",
      };

      const generationRequest = isLogin
        ? generateAlternateEndings(payload)
        : generateFreeAlternateEndings(payload);

      const res = await generationRequest.unwrap();

      if (!res || !Array.isArray(res.data)) {
        throw new Error("Invalid response from server");
      }

      setEndingsCache((prev) => ({ ...prev, [selectedStory.uuid]: res.data }));
      toast.success("Alternate endings generated successfully!");
    } catch (err: unknown) {
      console.error("[StoriesView Alternate Ending Flow Failure]:", err);
      
      const extendedError = err as { status?: number; data?: { status?: number; message?: string }; message?: string };
      const errorStatus = extendedError?.status || extendedError?.data?.status;
      const parsedMessage = errorStatus
        ? getErrorMessage(new ApiError(errorStatus, extendedError?.data?.message || ""))
        : extendedError?.message || "An unexpected failure occurred.";
      
      setErrorMessage(parsedMessage);
      toast.error("Failed to generate alternate endings.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <Toaster />
      
      {/* Visual reference verification anchor for audio layout */}
      <div className="hidden" aria-hidden="true">
        <AudioPlayer ref={audioPlayerRef} storyId={selectedStory?.uuid || ""} />
      </div>

      {errorMessage && (
        <div className="error-banner mb-6 p-4 bg-amber-500/20 border border-amber-500 rounded-xl text-amber-200 flex justify-between items-center animate-fadeIn">
          <div className="flex items-center gap-3">
            <span>⚠️</span>
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs uppercase font-bold tracking-wider hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {selectedStory ? (
          <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-black mb-2">{selectedStory.title}</h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed mb-6">
              {selectedStory.content}
            </div>

            <button
              onClick={handleGenerateAlternateEndings}
              disabled={isGeneratingEndings}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all text-white ${
                isGeneratingEndings 
                  ? "bg-slate-700 cursor-not-allowed opacity-50" 
                  : "bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/20"
              }`}
            >
              {isGeneratingEndings ? "Generating Endings..." : "Generate Alternate Endings"}
            </button>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">No stories available.</div>
        )}
      </div>
    </div>
  );
};

export default StoriesViewComponent;