import useReadingStats from "../../hooks/useReadingStats";

interface Props {
  story: string;
}

export default function ReadingStatsWidget({
  story,
}: Props) {
  const stats = useReadingStats(story);

  return (
    <div className="rounded-lg border p-5 shadow bg-white">

      <h2 className="text-xl font-bold mb-4">
        Reading Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <strong>Words</strong>
          <p>{stats.words}</p>
        </div>

        <div>
          <strong>Reading Time</strong>
          <p>{stats.readingTime} min</p>
        </div>

        <div>
          <strong>Paragraphs</strong>
          <p>{stats.paragraphs}</p>
        </div>

        <div>
          <strong>Chapters</strong>
          <p>{stats.chapters}</p>
        </div>

        <div>
          <strong>Sentences</strong>
          <p>{stats.sentences}</p>
        </div>

        <div>
          <strong>Average Sentence</strong>
          <p>{stats.averageSentenceLength} words</p>
        </div>

      </div>

    </div>
  );
}