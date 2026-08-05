import ScoreCard from "./ScoreCard";
import { analyzeStoryQuality } from "../../utils/storyQualityAnalyzer";

interface Props {
  story: string;
}

export default function StoryQualityDashboard({ story }: Props) {
  const scores = analyzeStoryQuality(story);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Story Quality Dashboard
      </h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {scores.map((item) => (
          <ScoreCard
            key={item.category}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}