import { useEffect, useState } from "react";
import {
  extractStoryEvents,
  StoryEvent,
} from "../../utils/storyTimeline";

interface Props {
  story: string;
}

export default function StoryTimelineVisualization({
  story,
}: Props) {
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  useEffect(() => {
    setEvents(extractStoryEvents(story));
  }, [story]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        📅 Story Timeline
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setActiveEvent(event.id)}
            className={`w-full text-left rounded-lg border p-4 transition ${
              activeEvent === event.id
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-zinc-700 bg-zinc-800 text-gray-300"
            }`}
          >
            <h3 className="font-semibold">
              {event.title}
            </h3>

            <p className="mt-2 text-sm line-clamp-2">
              {event.content}
            </p>
          </button>
        ))}
      </div>

    </div>
  );
}