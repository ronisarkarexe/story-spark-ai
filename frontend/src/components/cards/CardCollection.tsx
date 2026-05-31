import React from "react";
import type { IStories } from "../stories/stories.view.component";
import StoryTradingCard, {
  getStoryCardRank,
  getStoryCardRarity,
} from "./StoryTradingCard";

interface CardCollectionProps {
  stories: IStories[];
  selectedStoryId?: string;
  onSelectStory: (story: IStories) => void;
}

const CardCollection: React.FC<CardCollectionProps> = ({
  stories,
  selectedStoryId,
  onSelectStory,
}) => {
  const sortedStories = [...stories].sort(
    (a, b) =>
      getStoryCardRank(getStoryCardRarity(b.content)) -
      getStoryCardRank(getStoryCardRarity(a.content))
  );
  const rarityCounts = sortedStories.reduce<Record<string, number>>((acc, story) => {
    const rarity = getStoryCardRarity(story.content);
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});

  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-100">My Collection</h2>
          <p className="mt-1 text-xs text-slate-400">
            {stories.length} collected {stories.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          {["Common", "Rare", "Epic", "Legendary"].map((rarity) => (
            <span
              key={rarity}
              className="rounded-full border border-slate-600 bg-slate-900/60 px-2 py-1 text-slate-300"
            >
              {rarity}: {rarityCounts[rarity] || 0}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sortedStories.map((story) => {
          const isSelected = story.uuid === selectedStoryId;

          return (
            <button
              key={story.uuid}
              type="button"
              onClick={() => onSelectStory(story)}
              className={`rounded-xl border p-2 text-left transition ${
                isSelected
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-slate-700 bg-slate-950/30 hover:border-slate-500"
              }`}
            >
              <StoryTradingCard story={story} compact />
              <p className="mt-2 line-clamp-1 text-xs font-bold text-slate-200">
                {story.title}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                {getStoryCardRarity(story.content)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CardCollection;
