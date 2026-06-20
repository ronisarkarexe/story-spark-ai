import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NarrationPlaybackState } from "../AudioPlayer";

type TimelineEvent = {
  id: string;
  title: string;
  summary: string;
  wordStart: number;
  wordEnd: number;
};

type GeneratedStoryTimelineProps = {
  content: string;
  title: string;
  narrationState: NarrationPlaybackState;
  narrationWordIndex: number;
  onNavigate?: (wordStart: number) => void;
};

const EVENT_COUNT = 5;

const getWords = (text: string) => text.match(/\S+/g) ?? [];

const cleanText = (text: string) => text.replace(/\s+/g, " ").trim();

const truncate = (text: string, maxLength: number) => {
  const normalized = cleanText(text);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

const splitStoryIntoEvents = (content: string): TimelineEvent[] => {
  const normalizedContent = cleanText(content);
  if (!normalizedContent) return [];

  const sentences =
    normalizedContent.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(cleanText) ?? [
      normalizedContent,
    ];
  const totalWords = getWords(normalizedContent).length;
  const targetEventCount = Math.min(EVENT_COUNT, Math.max(1, sentences.length));
  const wordsPerEvent = Math.max(1, Math.ceil(totalWords / targetEventCount));

  const events: TimelineEvent[] = [];
  let wordCursor = 0;
  let currentSentences: string[] = [];
  let currentWordCount = 0;
  let eventStartWord = 0;

  sentences.forEach((sentence, sentenceIndex) => {
    const sentenceWordCount = getWords(sentence).length;
    currentSentences.push(sentence);
    currentWordCount += sentenceWordCount;

    const remainingSentences = sentences.length - sentenceIndex - 1;
    const remainingEvents = targetEventCount - events.length - 1;
    const shouldCloseEvent =
      events.length < targetEventCount - 1 &&
      currentWordCount >= wordsPerEvent &&
      remainingSentences >= remainingEvents;

    if (shouldCloseEvent || sentenceIndex === sentences.length - 1) {
      const eventText = currentSentences.join(" ");
      const eventEndWord = Math.max(eventStartWord, wordCursor + currentWordCount - 1);

      events.push({
        id: `${events.length}-${eventStartWord}-${eventEndWord}`,
        title: `Chapter ${events.length + 1}`,
        summary: truncate(eventText, 180),
        wordStart: eventStartWord,
        wordEnd: eventEndWord,
      });

      wordCursor += currentWordCount;
      eventStartWord = wordCursor;
      currentSentences = [];
      currentWordCount = 0;
    }
  });

  return events;
};

const GeneratedStoryTimeline = ({
  content,
  title,
  narrationState,
  narrationWordIndex,
  onNavigate,
}: GeneratedStoryTimelineProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const events = useMemo(() => splitStoryIntoEvents(content), [content]);

  const narratedEvent = events.find(
    (event) =>
      narrationWordIndex >= event.wordStart && narrationWordIndex <= event.wordEnd
  );
  const activeEventId =
    narrationState !== "idle" && narratedEvent
      ? narratedEvent.id
      : selectedEventId || events[0]?.id;
  const activeIndex = Math.max(
    0,
    events.findIndex((event) => event.id === activeEventId)
  );
  const progress =
    events.length <= 1 ? 100 : Math.round((activeIndex / (events.length - 1)) * 100);

  if (events.length === 0) {
    return null;
  }

  const activeEvent = events[activeIndex] ?? events[0];

  return (
    <section className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            Story Timeline
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-100">
            {title || "Generated story flow"}
          </h3>
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          {activeIndex + 1} / {events.length}
        </div>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <div className="relative">
        <div className="absolute left-4 top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-cyan-400/50 via-indigo-400/30 to-transparent md:block" />
        <div className="grid gap-3">
          {events.map((event, index) => {
            const isActive = event.id === activeEventId;
            const isComplete = index < activeIndex;

            return (
              <button
                type="button"
                key={event.id}
                onClick={() => {
                  setSelectedEventId(event.id);
                  onNavigate?.(event.wordStart);
                }}
                className={`group relative rounded-xl border p-4 text-left transition-all duration-300 md:ml-8 ${
                  isActive
                    ? "border-cyan-300/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                    : "border-slate-700/70 bg-slate-950/35 hover:border-indigo-400/40 hover:bg-slate-800/70"
                }`}
              >
                <span
                  className={`absolute -left-10 top-4 hidden h-8 w-8 items-center justify-center rounded-full border text-xs font-bold md:flex ${
                    isActive
                      ? "border-cyan-300 bg-cyan-400 text-slate-950"
                      : isComplete
                      ? "border-indigo-300 bg-indigo-400 text-slate-950"
                      : "border-slate-600 bg-slate-900 text-slate-400"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-slate-100">
                    {event.title}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="timeline-active-pill"
                      className="rounded-full bg-cyan-400/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200"
                    >
                      Active
                    </motion.span>
                  )}
                </span>
                <span className="line-clamp-2 text-sm leading-6 text-slate-400 group-hover:text-slate-300">
                  {event.summary}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeEvent.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Highlight
          </p>
          <p className="text-sm leading-6 text-slate-200">{activeEvent.summary}</p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default GeneratedStoryTimeline;
