import type { StoryQualityScore } from "../../utils/storyQualityAnalyzer";

interface ScoreCardProps {
  item: StoryQualityScore;
}

export default function ScoreCard({ item }: ScoreCardProps) {
  return (
    <div className="border rounded-xl p-5 shadow-sm">
      <div
        className="mx-auto grid h-20 w-20 place-items-center rounded-full border-8 border-blue-500 font-bold"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={item.score}
      >
        {item.score}
      </div>

      <h3 className="font-bold mt-4 text-center">
        {item.category}
      </h3>

      <p className="text-sm mt-2">
        {item.feedback}
      </p>

      <div className="mt-3 text-blue-600 text-sm">
        💡 {item.suggestion}
      </div>
    </div>
  );
}
