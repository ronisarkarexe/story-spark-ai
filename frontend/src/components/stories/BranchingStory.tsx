import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ChoiceButtons from "./ChoiceButtons";
import StorySegment from "./StorySegment";
import StoryTimeline, { StoryTimelineEntry } from "./StoryTimeline";
import { useCreateBranchingStoryMutation } from "../../redux/apis/branching.story.api";

type BranchingHistoryEntry = StoryTimelineEntry;

type CurrentStoryState = {
  segment: string;
  choices: string[];
  segmentIndex: number;
};

const defaultTitle = "Branching Stories";

const fallbackStory = (segmentIndex: number): CurrentStoryState => ({
  segment:
    "The tale stirs, but the AI is taking a breath. The world holds still for a moment, waiting for the next choice.",
  choices: [
    "Press onward into the unknown",
    "Look for a safer route",
    "Pause and regroup",
  ],
  segmentIndex,
});

const BranchingStory = () => {
  const [history, setHistory] = useState<BranchingHistoryEntry[]>([]);
  const [currentStory, setCurrentStory] = useState<CurrentStoryState | null>(null);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState("");
  const [showTimeline, setShowTimeline] = useState(true);
  const [createBranchingStory] = useCreateBranchingStoryMutation();

  const fullContext = useMemo(
    () =>
      history
        .map((entry) => `${entry.segment}\n[Player chose: ${entry.choice}]`)
        .join("\n\n"),
    [history]
  );

  const loadStory = useCallback(async (selectedChoice: string, storyContext = fullContext) => {
    setLoading(true);

    try {
      const response = await createBranchingStory({
        storyContext,
        selectedChoice,
        genre: genre || undefined,
      }).unwrap();

      setCurrentStory({
        segment: response.data.storySegment,
        choices: response.data.choices,
        segmentIndex: response.data.segmentIndex,
      });
    } catch (error) {
      console.error("Unable to load branching story", error);
      toast.error("The story engine stalled. A fallback scene is ready.");
      setCurrentStory(fallbackStory(history.length + 1));
    } finally {
      setLoading(false);
    }
  }, [createBranchingStory, fullContext, genre, history.length]);

  useEffect(() => {
    void loadStory("");
  }, [loadStory]);

  const handleSelectChoice = async (choice: string) => {
    if (!currentStory || loading) {
      return;
    }

    const nextContext = [...history, { segment: currentStory.segment, choice }]
      .map((entry) => `${entry.segment}\n[Player chose: ${entry.choice}]`)
      .join("\n\n");

    const completedEntry: BranchingHistoryEntry = {
      segment: currentStory.segment,
      choice,
    };

    setHistory((prev) => [...prev, completedEntry]);

    await loadStory(choice, nextContext);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-0 h-48 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex-1 space-y-6">
          <header className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                  Interactive Fiction
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {defaultTitle}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Each segment ends with three choices. Select one, and the next scene will preserve the full narrative context.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {[
                  "Fantasy",
                  "Sci-Fi",
                  "Mystery",
                  "Romance",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGenre(item === genre ? "" : item)}
                    className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                      genre === item
                        ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowTimeline((prev) => !prev)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:border-cyan-300/40 hover:bg-white/10 md:hidden"
                >
                  {showTimeline ? "Hide timeline" : "Show timeline"}
                </button>
              </div>
            </div>
          </header>

          <main className="space-y-5 pb-36 md:pb-8">
            {history.map((entry, index) => (
              <StorySegment
                key={`${index}-${entry.choice}`}
                index={index + 1}
                text={entry.segment}
                choiceMade={entry.choice}
              />
            ))}

            {currentStory ? (
              <StorySegment
                index={history.length + 1}
                text={currentStory.segment}
                choiceMade={undefined}
              />
            ) : null}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20 backdrop-blur-md sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                    Next choices
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Choose what happens next
                  </h2>
                </div>

                <AnimatePresence>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100"
                    >
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-200 border-t-transparent" />
                      Generating the next scene
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {currentStory ? (
                <ChoiceButtons
                  choices={currentStory.choices}
                  onSelect={handleSelectChoice}
                  disabled={loading}
                />
              ) : (
                <div className="h-24 rounded-2xl border border-dashed border-white/10 bg-white/5" />
              )}
            </div>
          </main>
        </div>

        {showTimeline ? <StoryTimeline history={history} /> : null}
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default BranchingStory;