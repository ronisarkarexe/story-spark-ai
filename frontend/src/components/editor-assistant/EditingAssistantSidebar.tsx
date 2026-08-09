import { useState } from "react";
import SuggestionCard from "./SuggestionCard";
import { useStoryAnalysis } from "../../hooks/useStoryAnalysis";

export default function EditingAssistantSidebar({
  story,
}) {
  const analysis = useStoryAnalysis(story);

  const [hidden, setHidden] = useState<number[]>([]);

  const suggestions = analysis.filter(
    (item) => !hidden.includes(item.id)
  );

  const dismiss = (id: number) => {
    setHidden([...hidden, id]);
  };

  const grouped = suggestions.reduce((acc, item) => {
    acc[item.category] ??= [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <aside className="w-full lg:w-96 border rounded-xl p-5">
      <h2 className="font-bold text-xl mb-4">
        AI Editing Assistant
      </h2>

      {Object.entries(grouped).map(([category, items]) => (
        <details key={category} open className="mb-4">
          <summary className="cursor-pointer font-semibold">
            {category}
          </summary>

          {items.map((item) => (
            <SuggestionCard
              key={item.id}
              suggestion={item}
              onDismiss={dismiss}
            />
          ))}
        </details>
      ))}
    </aside>
  );
}