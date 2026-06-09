import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";

interface IStoryData {
  id: string;
  title: string;
  content: string;
  genre?: string;
}

export const StoriesViewComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<IStoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize the speech synthesis engine
  const {
    isPlaying,
    isPaused,
    play,
    pause,
    resume,
    stop,
    progress,
    voices,
    selectedVoiceId,
    setSelectedVoiceId
  } = useSpeechSynthesis(story?.content ?? "");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setIsLoading(true);
        // Simulated or real fetch structure matching hook consumer signature
        const mockStory: IStoryData = {
          id: id ?? "default",
          title: "The Chronicles of Spark",
          content: "Once upon a time in a digital landscape, code compiled cleanly without any errors or warnings.",
          genre: "Fantasy"
        };
        setStory(mockStory);
      } catch (err) {
        console.error("Failed to load narration text source packet", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-200">
        <p className="text-lg animate-pulse">Loading narration context engine...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-200">
        <p className="text-lg text-rose-400">Story entity could not be resolved.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-12 min-h-screen text-slate-100 bg-slate-950">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          {story.title}
        </h1>
        {story.genre && (
          <span className="inline-block mt-3 px-3 py-1 bg-purple-950/50 border border-purple-800/60 rounded-full text-xs font-semibold text-purple-300">
            {story.genre}
          </span>
        )}
      </header>

      {/* Narration Suite Interface */}
      <section className="mb-8 p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isPlaying && !isPaused ? (
            <button onClick={play} className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors text-sm">
              Play Narration
            </button>
          ) : isPlaying ? (
            <button onClick={pause} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition-colors text-sm">
              Pause
            </button>
          ) : (
            <button onClick={resume} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors text-sm">
              Resume
            </button>
          )}
          {(isPlaying || isPaused) && (
            <button onClick={stop} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors text-sm border border-slate-700">
              Stop
            </button>
          )}
        </div>

        {/* Progress Metrics */}
        {(isPlaying || isPaused || progress.currentWordIndex > 0) && (
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress.percentage * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Voice Selector Configuration Selection */}
        {voices.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="voice-select" className="text-xs font-medium text-slate-400">Voice:</label>
            <select
              id="voice-select"
              value={selectedVoiceId}
              onChange={(e) => setSelectedVoiceId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.label} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Main Prose Presentation Container */}
      <main className="prose prose-invert max-w-none leading-relaxed text-slate-300 text-lg selection:bg-purple-500/30">
        <p>{story.content}</p>
      </main>
    </div>
  );
};

export default StoriesViewComponent;