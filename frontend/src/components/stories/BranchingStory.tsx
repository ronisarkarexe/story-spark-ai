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
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col w-full box-border relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none select-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row gap-6 px-4 py-8 sm:px-6 lg:px-8 box-border flex-grow">
        <div className="flex-1 space-y-6 min-w-0 w-full box-border">
          <header className="w-full bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm text-left box-border select-none">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between w-full box-border">
              <div className="max-w-2xl space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">
                  Interactive Fiction
                </p>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {defaultTitle}
                </h1>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium m-0">
                  Each segment ends with three choices. Select one, and the next scene will preserve the full narrative context.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-150 cursor-pointer active:scale-[0.97] ${
                      genre === item
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-sm"
                        : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowTimeline((prev) => !prev)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/5 md:hidden cursor-pointer active:scale-[0.97] transition-all duration-150"
                >
                  {showTimeline ? "Hide timeline" : "Show timeline"}
                </button>
              </div>
            </div>
          </header>

          <main className="space-y-6 pb-24 md:pb-6 w-full box-border">
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

            <div className="bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm text-left w-full box-border">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4 select-none w-full box-border">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                    Next choices
                  </p>
                  <h2 className="mt-1 text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight m-0">
                    Choose what happens next
                  </h2>
                </div>

                <AnimatePresence>
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-500/5 border border-blue-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 shadow-sm"
                    >
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent shrink-0" />
                      <span>Generating the next scene</span>
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
                <div className="h-24 rounded-2xl border border-dashed border-slate-200 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] w-full box-border" />
              )}
            </div>
          </main>
        </div>

        {showTimeline ? <StoryTimeline history={history} /> : null}
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default BranchingStory;