import useChapterBalance from "../../hooks/useChapterBalance";

interface Props {
  story: string;
}

export default function ChapterBalanceAnalyzer({
  story,
}: Props) {
  const chapters = useChapterBalance(story);

  return (
    <div className="rounded-lg border p-5 shadow bg-white">

      <h2 className="text-xl font-bold mb-5">
        Chapter Balance Analyzer
      </h2>

      {chapters.map((chapter) => (
        <div
          key={chapter.chapter}
          className="mb-5 border rounded-lg p-4"
        >
          <div className="flex justify-between mb-2">

            <h3 className="font-semibold">
              Chapter {chapter.chapter}
            </h3>

            <span
              className={
                chapter.status === "Balanced"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {chapter.status}
            </span>

          </div>

          <p>Words: {chapter.words}</p>

          <div className="w-full bg-gray-200 h-3 rounded mt-3">

            <div
              className="bg-blue-600 h-3 rounded"
              style={{
                width: `${chapter.score}%`,
              }}
            />

          </div>

          <p className="mt-2">
            Balance Score: {chapter.score}%
          </p>

        </div>
      ))}

    </div>
  );
}